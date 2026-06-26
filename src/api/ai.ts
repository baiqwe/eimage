import { generateImage } from '@tanstack/ai';
import { falImage } from '@tanstack/ai-fal';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { serverEnv } from '@/env/server';

/**
 * AI demo server functions.
 *
 * - Text summarization: Cloudflare Workers AI (`@cf/facebook/bart-large-cnn`)
 *   via the plain Workers AI REST API (no extra adapter needed).
 *   Endpoint: https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/{model}
 *
 * - Translation: Cloudflare Workers AI (`@cf/meta/m2m100-1.2b`).
 *
 * - Tagline generation (Chat): Cloudflare Workers AI
 *   (`@cf/meta/llama-3.1-8b-instruct`) — system + user messages.
 *
 * - Image generation (fal): fal.ai via the `@tanstack/ai-fal` adapter.
 *   Supports switching between `fal-ai/flux/schnell`,
 *   `fal-ai/nano-banana` (Nano Banana), and `openai/gpt-image-2`.
 *
 * - Image editing / image-to-image (fal): `fal-ai/nano-banana/edit`.
 *   Takes a base64 portrait + prompt and returns a stylized version (e.g.
 *   bobblehead caricature). Identity preservation is excellent on this model.
 *
 * - Image generation (Cloudflare): Workers AI text-to-image models such as
 *   `@cf/black-forest-labs/flux-1-schnell` and
 *   `@cf/bytedance/stable-diffusion-xl-lightning`. These return the image
 *   either as base64 inside a JSON envelope or as a raw binary body — we
 *   detect via `Content-Type` and return a data URL either way.
 *
 * - Text-to-Speech: Cloudflare Workers AI (`@cf/deepgram/aura-1`) — returns
 *   the MP3 audio inline as a base64 data URL.
 *
 * - Image captioning (Image-to-Text): Cloudflare Workers AI
 *   (`@cf/llava-hf/llava-1.5-7b-hf`) — accepts a base64 image plus a prompt,
 *   returns a caption / answer about the image.
 *
 * Required env (Worker secrets):
 * - CLOUDFLARE_ACCOUNT_ID  (for Workers AI calls)
 * - CLOUDFLARE_API_TOKEN   Workers AI API token (for Workers AI calls)
 * - FAL_KEY                fal.ai API key (for image generation)
 */

const SUPPORTED_LANGUAGES = [
  'english',
  'chinese',
  'french',
  'german',
  'spanish',
  'japanese',
  'korean',
  'russian',
  'portuguese',
  'arabic',
] as const;
const languageEnum = z.enum(SUPPORTED_LANGUAGES);

const summarizationSchema = z.object({
  text: z
    .string()
    .min(50, 'Please provide at least 50 characters to summarize.')
    .max(500, 'Text is too long, please keep it under 500 characters.'),
});

const translationSchema = z
  .object({
    text: z
      .string()
      .min(1, 'Please provide some text to translate.')
      .max(1000, 'Text is too long, please keep it under 1000 characters.'),
    sourceLang: languageEnum,
    targetLang: languageEnum,
  })
  .refine((value) => value.sourceLang !== value.targetLang, {
    message: 'Source and target languages must be different.',
    path: ['targetLang'],
  });

const taglineSchema = z.object({
  product: z
    .string()
    .min(10, 'Please describe your product in at least 10 characters.')
    .max(400, 'Description is too long, please keep it under 400 characters.'),
});

const FAL_IMAGE_MODELS = [
  'fal-ai/flux/schnell',
  'fal-ai/nano-banana',
  'openai/gpt-image-2',
] as const;

const imageGenerationSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt is too short.')
    .max(500, 'Prompt is too long, please keep it under 500 characters.'),
  model: z.enum(FAL_IMAGE_MODELS).default('fal-ai/nano-banana'),
});

const CF_IMAGE_MODELS = [
  '@cf/black-forest-labs/flux-1-schnell',
  '@cf/bytedance/stable-diffusion-xl-lightning',
  '@cf/lykon/dreamshaper-8-lcm',
] as const;

const cfImageGenerationSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt is too short.')
    .max(500, 'Prompt is too long, please keep it under 500 characters.'),
  model: z
    .enum(CF_IMAGE_MODELS)
    .default('@cf/black-forest-labs/flux-1-schnell'),
});

const TTS_SPEAKERS = [
  'angus',
  'asteria',
  'arcas',
  'orion',
  'orpheus',
  'athena',
  'luna',
  'zeus',
  'perseus',
  'helios',
  'hera',
  'stella',
] as const;

const ttsSchema = z.object({
  text: z
    .string()
    .min(1, 'Please provide some text to synthesize.')
    .max(1000, 'Text is too long, please keep it under 1000 characters.'),
  speaker: z.enum(TTS_SPEAKERS),
});

const imageEditSchema = z.object({
  /** Base64-encoded source image (with or without `data:` prefix). */
  imageBase64: z
    .string()
    .min(100, 'Image data is too small.')
    .max(1_400_000, 'Image is too large (please use one under ~1 MB).'),
  prompt: z
    .string()
    .min(5, 'Please provide a longer prompt.')
    .max(500, 'Prompt is too long, please keep it under 500 characters.'),
});

const captionSchema = z.object({
  /**
   * Image as base64-encoded bytes (no `data:` prefix). The client strips the
   * data URL prefix before sending. We cap the encoded length so the JSON
   * payload to the server function stays under ~1.4 MB.
   */
  imageBase64: z
    .string()
    .min(100, 'Image data is too small.')
    .max(1_400_000, 'Image is too large (please use one under ~1 MB).'),
  prompt: z
    .string()
    .min(1, 'Please provide a prompt.')
    .max(300, 'Prompt is too long, please keep it under 300 characters.'),
});

const workbenchPromptSchema = z.object({
  description: z
    .string()
    .min(4, 'Please describe the product first.')
    .max(800, 'Description is too long, please keep it under 800 characters.'),
  imageType: z.enum(['main', 'detail']),
  style: z.string().min(2).max(120),
  locale: z.enum(['zh', 'en', 'ja', 'ko', 'es']).default('zh'),
});

/**
 * Helper: invoke the Cloudflare Workers AI REST endpoint for a given model.
 * Returns the parsed `result` object on success, throws on any error.
 */
async function runWorkersAi<TResult>(
  model: string,
  body: Record<string, unknown>
): Promise<TResult> {
  const accountId = serverEnv.CLOUDFLARE_ACCOUNT_ID;
  const apiKey = serverEnv.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiKey) {
    throw new Error(
      'Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN env.'
    );
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(
      `Workers AI request failed (${response.status}): ${errBody.slice(0, 200)}`
    );
  }

  const payload = (await response.json()) as {
    success?: boolean;
    result?: TResult;
    errors?: Array<{ message?: string }>;
  };

  if (!payload.success || !payload.result) {
    const message =
      payload.errors?.[0]?.message ?? 'Empty response from Workers AI.';
    throw new Error(`Workers AI error: ${message}`);
  }

  return payload.result;
}

/**
 * Summarize a long piece of text using Cloudflare Workers AI BART CNN
 * via the Workers AI REST API.
 */
export const summarizeText = createServerFn({ method: 'POST' })
  .inputValidator(summarizationSchema)
  .handler(async ({ data }) => {
    const result = await runWorkersAi<{ summary?: string }>(
      '@cf/facebook/bart-large-cnn',
      { input_text: data.text }
    );

    if (!result.summary) {
      throw new Error('Summarization returned an empty response.');
    }

    return { summary: result.summary };
  });

/**
 * Translate text between languages using Cloudflare Workers AI
 * `@cf/meta/m2m100-1.2b` (Many-to-Many multilingual translation).
 */
export const translateText = createServerFn({ method: 'POST' })
  .inputValidator(translationSchema)
  .handler(async ({ data }) => {
    const result = await runWorkersAi<{ translated_text?: string }>(
      '@cf/meta/m2m100-1.2b',
      {
        text: data.text,
        source_lang: data.sourceLang,
        target_lang: data.targetLang,
      }
    );

    if (!result.translated_text) {
      throw new Error('Translation returned an empty response.');
    }

    return { translatedText: result.translated_text };
  });

/**
 * Generate 5 SaaS taglines from a short product description using
 * Cloudflare Workers AI `@cf/meta/llama-3.1-8b-instruct` (chat model).
 *
 * Demonstrates a single-shot chat call with a system prompt that constrains
 * the output to a numbered list — no follow-up turns are kept.
 */
export const generateTaglines = createServerFn({ method: 'POST' })
  .inputValidator(taglineSchema)
  .handler(async ({ data }) => {
    const result = await runWorkersAi<{ response?: string }>(
      '@cf/meta/llama-3.1-8b-instruct',
      {
        messages: [
          {
            role: 'system',
            content:
              'You are a creative copywriter for SaaS products. Write exactly 5 short, punchy taglines (max 8 words each) for the product the user describes. Return them as a numbered list (1. ... 2. ...). Do not add any introduction, explanation, or trailing notes — only the 5 lines.',
          },
          {
            role: 'user',
            content: `Product description: ${data.product}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.85,
      }
    );

    if (!result.response) {
      throw new Error('Tagline generation returned an empty response.');
    }

    const taglines = parseTaglines(result.response);
    if (taglines.length === 0) {
      throw new Error('Could not parse taglines from model response.');
    }

    return { taglines };
  });

/**
 * Extract numbered taglines from a model's free-form response.
 * Tolerates "1.", "1)", "- ", and "* " bullets, plus surrounding markdown.
 */
function parseTaglines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(\d+[.)]|[-*])\s*/, '').trim())
    .map((line) => line.replace(/^["“'']|["”'']$/g, '').trim())
    .filter((line) => line.length > 0 && line.length <= 120)
    .slice(0, 5);
}

/**
 * Generate an image from a text prompt using fal.ai. Caller picks the model
 * (Flux Schnell, Nano Banana, or GPT Image 2).
 * Returns the hosted image URL produced by fal.
 */
export const generateAiImage = createServerFn({ method: 'POST' })
  .inputValidator(imageGenerationSchema)
  .handler(async ({ data }) => {
    const apiKey = serverEnv.FAL_KEY;
    if (!apiKey) {
      throw new Error(
        'Missing FAL_KEY env. Set it as a Worker secret to use fal.ai.'
      );
    }

    const adapter = falImage(data.model, { apiKey });

    // GPT Image 2 defaults to high quality which can take 60–75s and may
    // exhaust the Cloudflare Worker subrequest budget while polling fal's
    // queue. Force the cheaper / faster `low` quality + jpeg encoding so it
    // completes in ~30s for the demo.
    const modelOptions =
      data.model === 'openai/gpt-image-2'
        ? { quality: 'low' as const, output_format: 'jpeg' as const }
        : undefined;

    const result = await generateImage({
      adapter,
      prompt: data.prompt,
      ...(modelOptions ? { modelOptions } : {}),
    });

    const image = result.images?.[0];
    const imageUrl = image?.url;
    if (!imageUrl) {
      throw new Error('Image generation failed: empty response.');
    }

    return { imageUrl, model: data.model };
  });

/**
 * Image-to-image edit using fal.ai Nano Banana (`/edit` endpoint).
 * Sends the user's base64 image as a data URI in `image_urls` and returns a
 * stylized version. Great at preserving the subject's identity, so it works
 * well for portrait → caricature / cartoon / anime transformations.
 */
export const editAiImage = createServerFn({ method: 'POST' })
  .inputValidator(imageEditSchema)
  .handler(async ({ data }) => {
    const apiKey = serverEnv.FAL_KEY;
    if (!apiKey) {
      throw new Error(
        'Missing FAL_KEY env. Set it as a Worker secret to use fal.ai.'
      );
    }

    const dataUrl = data.imageBase64.startsWith('data:')
      ? data.imageBase64
      : `data:image/jpeg;base64,${data.imageBase64}`;

    const adapter = falImage('fal-ai/nano-banana/edit', { apiKey });

    const result = await generateImage({
      adapter,
      prompt: data.prompt,
      modelOptions: { image_urls: [dataUrl] },
    });

    const image = result.images?.[0];
    const imageUrl = image?.url;
    if (!imageUrl) {
      throw new Error('Image edit failed: empty response.');
    }

    return { imageUrl };
  });

/**
 * Synthesize speech from text using Cloudflare Workers AI Deepgram Aura
 * (`@cf/deepgram/aura-1`). Unlike the JSON-based models above, this endpoint
 * returns raw MP3 bytes (`Content-Type: audio/mpeg`), so we base64-encode
 * them and return a data URL the browser can feed straight to `<audio>`.
 */
export const synthesizeSpeech = createServerFn({ method: 'POST' })
  .inputValidator(ttsSchema)
  .handler(async ({ data }) => {
    const accountId = serverEnv.CLOUDFLARE_ACCOUNT_ID;
    const apiKey = serverEnv.CLOUDFLARE_API_TOKEN;
    if (!accountId || !apiKey) {
      throw new Error(
        'Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN env.'
      );
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/deepgram/aura-1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: data.text, speaker: data.speaker }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      throw new Error(
        `TTS request failed (${response.status}): ${errBody.slice(0, 200)}`
      );
    }

    const contentType = response.headers.get('content-type') ?? 'audio/mpeg';
    const buffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);

    return {
      audioUrl: `data:${contentType};base64,${base64}`,
      bytes: buffer.byteLength,
    };
  });

/**
 * Convert an ArrayBuffer to base64 in chunks. Avoids the ~64k argument
 * limit of `String.fromCharCode(...bytes)` on realistic audio payloads.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/**
 * Generate an image from a text prompt using a Cloudflare Workers AI
 * text-to-image model. Different models return different shapes:
 *
 * - JSON `{ result: { image: <base64 jpeg> } }` (e.g. `flux-1-schnell`)
 * - Raw binary image body (e.g. `stable-diffusion-xl-lightning`)
 *
 * We branch on `Content-Type` and always return a `data:` URL the browser
 * can render directly.
 */
export const generateCfImage = createServerFn({ method: 'POST' })
  .inputValidator(cfImageGenerationSchema)
  .handler(async ({ data }) => {
    const accountId = serverEnv.CLOUDFLARE_ACCOUNT_ID;
    const apiKey = serverEnv.CLOUDFLARE_API_TOKEN;
    if (!accountId || !apiKey) {
      throw new Error(
        'Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN env.'
      );
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${data.model}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: data.prompt }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      throw new Error(
        `Workers AI request failed (${response.status}): ${errBody.slice(
          0,
          200
        )}`
      );
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      const payload = (await response.json()) as {
        success?: boolean;
        result?: { image?: string };
        errors?: Array<{ message?: string }>;
      };
      const base64 = payload.result?.image;
      if (!payload.success || !base64) {
        const message =
          payload.errors?.[0]?.message ?? 'Empty response from Workers AI.';
        throw new Error(`Workers AI error: ${message}`);
      }
      return {
        imageUrl: `data:image/jpeg;base64,${base64}`,
        model: data.model,
      };
    }

    // Binary image body — content-type may be image/png, image/jpeg, etc.
    const buffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);
    const mime = contentType.startsWith('image/') ? contentType : 'image/jpeg';
    return {
      imageUrl: `data:${mime};base64,${base64}`,
      model: data.model,
    };
  });

/**
 * Generate a caption (or answer a custom prompt) for an image using
 * Cloudflare Workers AI LLaVA 1.5 (`@cf/llava-hf/llava-1.5-7b-hf`).
 *
 * The model expects `image` as an array of byte values plus an optional
 * `prompt`; the client uploads a file, base64-encodes it, and we decode +
 * forward the bytes here.
 */
export const captionImage = createServerFn({ method: 'POST' })
  .inputValidator(captionSchema)
  .handler(async ({ data }) => {
    const bytes = base64ToBytes(data.imageBase64);

    const result = await runWorkersAi<{ description?: string }>(
      '@cf/llava-hf/llava-1.5-7b-hf',
      {
        image: Array.from(bytes),
        prompt: data.prompt,
        max_tokens: 256,
      }
    );

    if (!result.description) {
      throw new Error('Image captioning returned an empty response.');
    }

    return { description: result.description.trim() };
  });

export const draftProductImagePrompt = createServerFn({ method: 'POST' })
  .inputValidator(workbenchPromptSchema)
  .handler(async ({ data }) => {
    const systemPrompt = getWorkbenchSystemPrompt(data.locale);
    const reasoningLanguage = {
      zh: 'Simplified Chinese',
      en: 'English',
      ja: 'Japanese',
      ko: 'Korean',
      es: 'Spanish',
    }[data.locale];
    const userPrompt = getWorkbenchUserPrompt(data, reasoningLanguage);

    const accountId = serverEnv.CLOUDFLARE_ACCOUNT_ID;
    const apiKey = serverEnv.CLOUDFLARE_API_TOKEN;

    if (accountId && apiKey) {
      try {
        const result = await runWorkersAi<{ response?: string }>(
          '@cf/meta/llama-3.1-8b-instruct',
          {
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            max_tokens: 700,
            temperature: 0.72,
          }
        );

        const parsed = parseJsonObject(result.response ?? '');
        if (
          typeof parsed.prompt === 'string' &&
          typeof parsed.reasoning === 'string' &&
          Array.isArray(parsed.keywords)
        ) {
          return {
            prompt: parsed.prompt,
            reasoning: parsed.reasoning,
            keywords: parsed.keywords
              .filter(
                (keyword): keyword is string => typeof keyword === 'string'
              )
              .slice(0, 4),
            source: 'workers-ai' as const,
          };
        }
      } catch {
        // Fall through to a deterministic local draft so the workbench stays
        // usable in local environments without AI secrets.
      }
    }

    return {
      ...createLocalProductPrompt(data),
      source: 'local-template' as const,
    };
  });

function parseJsonObject(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  const json = trimmed.match(/\{[\s\S]*\}/)?.[0] ?? trimmed;
  return JSON.parse(json) as Record<string, unknown>;
}

function getWorkbenchSystemPrompt(
  locale: z.infer<typeof workbenchPromptSchema>['locale']
) {
  return {
    zh: '你是一名资深电商视觉总监。只返回严格 JSON，不要输出额外说明。',
    en: 'You are a senior ecommerce visual director. Return strict JSON only.',
    ja: 'あなたはシニア EC ビジュアルディレクターです。厳密な JSON のみを返してください。',
    ko: '당신은 시니어 이커머스 비주얼 디렉터입니다. 엄격한 JSON만 반환하세요.',
    es: 'Eres un director visual senior de ecommerce. Devuelve solo JSON estricto.',
  }[locale];
}

function getWorkbenchUserPrompt(
  data: z.infer<typeof workbenchPromptSchema>,
  reasoningLanguage: string
) {
  const imageType =
    data.imageType === 'main' ? 'main hero image' : 'lifestyle detail image';
  return {
    zh: `商品基础描述：${data.description}
图片类型：${data.imageType === 'main' ? '平台主图' : '详情场景图'}
风格预设：${data.style}
当前界面语言：${data.locale}

请编写一个适合扩散模型的提示词，要求严格保留源商品图的轮廓、比例、材质、logo、正面结构与主体几何。你只能重设计背景、光线、台面、反射、氛围与场景道具，不能虚构新的拍摄角度，也不能修改商品结构。

请返回 JSON：
{
  "prompt": "完整图片提示词，语言与界面保持一致",
  "reasoning": "一条清晰的${reasoningLanguage}说明，解释画面逻辑",
  "keywords": ["3-4 个${reasoningLanguage}短关键词"]
}`,
    en: `Product base description: ${data.description}
Image type: ${imageType}
Style preset: ${data.style}
User interface language: ${data.locale}

Write a diffusion prompt that preserves the product silhouette, proportions,
materials, logos, and front-facing structure from the source photo. The prompt
may redesign only background, lighting, surface, reflection, atmosphere, and
scene props. Do not invent another angle or alter the product geometry.

Return JSON:
{
  "prompt": "long image prompt in the same language as the interface",
  "reasoning": "one clear ${reasoningLanguage} sentence explaining the scene logic",
  "keywords": ["3-4 short display keywords in ${reasoningLanguage}"]
}`,
    ja: `商品の基本説明：${data.description}
画像タイプ：${data.imageType === 'main' ? '主画像' : '詳細ライフスタイル画像'}
スタイルプリセット：${data.style}
UI 言語：${data.locale}

拡散モデル向けの Prompt を作成してください。元画像の商品シルエット、比率、素材、ロゴ、正面構造、主体ジオメトリは厳密に維持してください。変更してよいのは背景、照明、台面、反射、空気感、シーン小物のみです。新しい角度を作ったり、商品の構造を変えたりしないでください。

JSON を返してください：
{
  "prompt": "UI と同じ言語の詳細な画像 Prompt",
  "reasoning": "${reasoningLanguage}で画面意図を説明する明確な 1 文",
  "keywords": ["${reasoningLanguage}の短い表示キーワードを 3〜4 個"]
}`,
    ko: `상품 기본 설명: ${data.description}
이미지 유형: ${data.imageType === 'main' ? '메인 히어로 이미지' : '상세 라이프스타일 이미지'}
스타일 프리셋: ${data.style}
UI 언어: ${data.locale}

확산 모델용 프롬프트를 작성하세요. 원본 상품 사진의 실루엣, 비율, 재질, 로고, 정면 구조와 형태를 엄격히 유지해야 합니다. 배경, 조명, 표면, 반사, 분위기, 소품만 재설계할 수 있으며 새로운 각도를 만들거나 상품 구조를 변경하면 안 됩니다.

JSON 형식으로 반환하세요:
{
  "prompt": "인터페이스와 같은 언어로 된 긴 이미지 프롬프트",
  "reasoning": "장면 의도를 설명하는 ${reasoningLanguage} 한 문장",
  "keywords": ["${reasoningLanguage} 짧은 키워드 3-4개"]
}`,
    es: `Descripción base del producto: ${data.description}
Tipo de imagen: ${data.imageType === 'main' ? 'imagen principal' : 'imagen lifestyle de detalle'}
Preset de estilo: ${data.style}
Idioma de la interfaz: ${data.locale}

Escribe un prompt para un modelo de difusión que preserve la silueta, proporciones,
materiales, logos y estructura frontal del producto de la foto original. El prompt
solo puede rediseñar el fondo, la iluminación, la superficie, el reflejo, la atmósfera
y los props de escena. No inventes otro ángulo ni alteres la geometría del producto.

Devuelve JSON:
{
  "prompt": "prompt de imagen largo en el mismo idioma que la interfaz",
  "reasoning": "una frase clara en ${reasoningLanguage} explicando la lógica visual",
  "keywords": ["3-4 palabras clave cortas en ${reasoningLanguage}"]
}`,
  }[data.locale];
}

function createLocalProductPrompt(data: z.infer<typeof workbenchPromptSchema>) {
  const isMain = data.imageType === 'main';
  const prompt = getLocalPromptTemplate(
    data.locale,
    data.description,
    data.style,
    isMain
  );

  return {
    prompt,
    reasoning: getLocalPromptReasoning(data.locale, isMain),
    keywords: getLocalPromptKeywords(data.locale, isMain),
  };
}

function getLocalPromptReasoning(
  locale: z.infer<typeof workbenchPromptSchema>['locale'],
  isMain: boolean
) {
  return {
    zh: isMain
      ? '通过干净背景和受控反射突出商品轮廓，同时避免改变原图里的主体结构。'
      : '用环境光和生活化道具制造场景感，但让商品仍保持原始形貌作为视觉锚点。',
    en: isMain
      ? 'A clean background and controlled reflections emphasize the product silhouette without changing its source structure.'
      : 'Environmental light and lifestyle props add context while keeping the uploaded product as the fixed visual anchor.',
    ja: isMain
      ? 'クリーンな背景と制御された反射で商品輪郭を強調し、元画像の主体構造は変更しません。'
      : '環境光とライフスタイル小物で文脈を加えつつ、商品を固定された視覚アンカーとして保ちます。',
    ko: isMain
      ? '깨끗한 배경과 제어된 반사로 상품 윤곽을 강조하면서 원본 구조는 변경하지 않습니다.'
      : '환경광과 라이프스타일 소품으로 맥락을 더하되 업로드된 상품을 고정된 시각 기준으로 유지합니다.',
    es: isMain
      ? 'Un fondo limpio y reflejos controlados resaltan la silueta sin cambiar la estructura original.'
      : 'La luz ambiental y los props lifestyle añaden contexto manteniendo el producto como ancla visual fija.',
  }[locale];
}

function getLocalPromptKeywords(
  locale: z.infer<typeof workbenchPromptSchema>['locale'],
  isMain: boolean
) {
  return {
    zh: isMain
      ? ['锁定轮廓', '棚拍光影', '高级反射']
      : ['生活场景', '自然光', '主体不变'],
    en: isMain
      ? ['Silhouette lock', 'Studio light', 'Premium reflection']
      : ['Lifestyle scene', 'Natural light', 'Shape preserved'],
    ja: isMain
      ? ['輪郭固定', 'スタジオ光', '高級反射']
      : ['ライフスタイル', '自然光', '形状維持'],
    ko: isMain
      ? ['윤곽 고정', '스튜디오 조명', '프리미엄 반사']
      : ['라이프스타일', '자연광', '형태 유지'],
    es: isMain
      ? ['Silueta fija', 'Luz de estudio', 'Reflejo premium']
      : ['Escena lifestyle', 'Luz natural', 'Forma preservada'],
  }[locale];
}

function getLocalPromptTemplate(
  locale: z.infer<typeof workbenchPromptSchema>['locale'],
  description: string,
  style: string,
  isMain: boolean
) {
  return {
    zh: [
      '基于提供的商品源图生成专业电商商品摄影画面。',
      `商品描述：${description}。`,
      `视觉方向：${style}。`,
      isMain
        ? '保持原商品居中并完整展示轮廓，采用干净高级的商业棚拍构图、精致台面、可控反射与柔和接触阴影。'
        : '在可信的生活方式环境中保持原商品不变，只在商品周围构建场景语境、自然景深、克制道具与详情页式构图。 ',
      '严格保留商品形状、比例、材质质感、颜色、标签位置、logo 与正面结构。',
      '不要改变商品角度，不要添加重复商品，不要扭曲边缘，不要生成多余部件，也不要出现伪文字。',
      '使用高端布光、真实阴影融合、85mm 商业镜头质感、清晰边缘与高级修图效果，整体保持写实。',
    ].join(' '),
    en: [
      'Professional ecommerce product photography based on the provided source image.',
      `Product description: ${description}.`,
      `Visual direction: ${style}.`,
      isMain
        ? 'Keep the original product centered, full silhouette visible, with a clean premium commercial composition, refined studio surface, controlled reflections, and a soft contact shadow.'
        : 'Keep the original product unchanged inside a believable lifestyle environment, using scene context only around the product, natural depth, subtle supporting props, and an editorial detail-page composition.',
      'Preserve the exact product shape, proportions, material finish, color, label placement, logos, and front-facing structure from the source image.',
      'Do not change the product angle, add duplicate products, deform edges, invent extra parts, or generate text artifacts.',
      'Use high-end lighting, realistic shadow integration, an 85mm commercial lens look, sharp product edges, premium retouching, and a photorealistic finish.',
    ].join(' '),
    ja: [
      '提供された商品元画像をもとに、プロ品質の EC 商品写真を生成してください。',
      `商品説明：${description}。`,
      `ビジュアル方針：${style}。`,
      isMain
        ? '元の商品を中央に配置し、輪郭を完全に見せたまま、クリーンで上質な商用スタジオ構図、洗練された台面、制御された反射、柔らかな接地影で構成します。'
        : '信頼できるライフスタイル環境の中で商品本体は変えず、周囲にだけ自然な文脈、奥行き、控えめな小物、詳細ページ向けの構図を加えてください。',
      '商品形状、比率、素材感、色、ラベル位置、ロゴ、正面構造は厳密に維持してください。',
      '商品角度を変えず、重複商品を追加せず、輪郭を歪めず、余分な部品や偽テキストを生成しないでください。',
      '高品質な照明、自然な影の統合、85mm 商用レンズらしい見え方、シャープな輪郭、上品なレタッチ、写実的な仕上がりを使用してください。',
    ].join(' '),
    ko: [
      '제공된 상품 원본 이미지를 기반으로 전문적인 이커머스 상품 사진을 생성하세요.',
      `상품 설명: ${description}.`,
      `비주얼 방향: ${style}.`,
      isMain
        ? '원본 상품을 중앙에 두고 전체 실루엣이 보이도록 유지하며, 깔끔하고 고급스러운 상업용 스튜디오 구도, 정제된 표면, 제어된 반사, 부드러운 접지 그림자를 사용하세요.'
        : '신뢰감 있는 라이프스타일 환경 안에서 상품은 그대로 유지하고, 상품 주변에만 자연스러운 맥락, 깊이감, 절제된 소품, 상세 페이지용 편집 구도를 더하세요.',
      '원본 이미지의 상품 형태, 비율, 재질, 색상, 라벨 위치, 로고, 정면 구조를 정확히 유지하세요.',
      '상품 각도를 바꾸지 말고, 중복 상품을 추가하지 말며, 가장자리를 왜곡하거나 불필요한 부품이나 가짜 텍스트를 만들지 마세요.',
      '고급 조명, 사실적인 그림자 통합, 85mm 상업 렌즈 느낌, 선명한 윤곽, 프리미엄 리터칭, 사실적인 마감으로 표현하세요.',
    ].join(' '),
    es: [
      'Genera una fotografía profesional de producto ecommerce basada en la imagen fuente proporcionada.',
      `Descripción del producto: ${description}.`,
      `Dirección visual: ${style}.`,
      isMain
        ? 'Mantén el producto original centrado y con la silueta completa visible, usando una composición comercial limpia y premium, superficie de estudio refinada, reflejos controlados y una sombra de contacto suave.'
        : 'Mantén el producto original sin cambios dentro de un entorno lifestyle creíble, usando contexto de escena solo alrededor del producto, profundidad natural, props sutiles y composición editorial de página de detalle.',
      'Conserva exactamente la forma, proporciones, acabado del material, color, ubicación de etiquetas, logos y estructura frontal del producto de la imagen fuente.',
      'No cambies el ángulo del producto, no añadas productos duplicados, no deformes bordes, no inventes piezas extra ni generes artefactos de texto.',
      'Usa iluminación de alto nivel, integración realista de sombras, apariencia de lente comercial de 85 mm, bordes nítidos, retoque premium y acabado fotorrealista.',
    ].join(' '),
  }[locale];
}

/**
 * Decode a base64 string into a Uint8Array. Mirrors the `arrayBufferToBase64`
 * helper above and works in the Workers runtime without Node `Buffer`.
 */
function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
