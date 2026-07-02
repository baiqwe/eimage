import {
  createGenerationBatch,
  getGenerationTaskStatuses,
} from '@/api/generation';
import { authClient } from '@/auth/client';
import { GeneratorWorkbenchHeader } from '@/components/generator/generator-workbench-header';
import {
  getLocalizedPublicPath,
  type ProductLocale,
  useProductLocale,
} from '@/components/product/product-locale';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGenerationCredits } from '@/hooks/use-generation-history';
import { downloadFile } from '@/lib/download';
import {
  clearGeneratorSession,
  loadGeneratorSession,
  saveGeneratorSession,
} from '@/lib/generator-session';
import {
  KIE_MODELS,
  type KieModelId,
  getDefaultKieAspectRatio,
  getDefaultKieOutputValue,
  supportsKieOutputParam,
} from '@/lib/kie-models';
import { estimateTaskCreditCost } from '@/lib/product-generation';
import {
  IconCloudUpload,
  IconDownload,
  IconEye,
  IconLoader2,
  IconPlayerPlay,
  IconPhotoScan,
  IconWand,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';

type Locale = ProductLocale;
type Status = 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
type KieAspectRatio = string;
type KieResolution = string;

const DEFAULT_MODEL = KIE_MODELS[0]?.id ?? 'gpt-image-2-image-to-image';
const DEFAULT_MODEL_CONFIG = KIE_MODELS[0];

const COPY: Record<
  Locale,
  {
    title: string;
    eyebrow: string;
    description: string;
    upload: string;
    uploadHint: string;
    productDescription: string;
    productPlaceholder: string;
    platform: string;
    shadow: string;
    margin: string;
    model: string;
    ratio: string;
    resolution: string;
    generate: string;
    source: string;
    result: string;
    emptySource: string;
    emptyResult: string;
    preview: string;
    download: string;
    credits: string;
    authRequired: string;
    insufficientCredits: (required: number, available: number) => string;
    submitting: string;
    polling: string;
    failed: string;
    status: Record<Status, string>;
  }
> = {
  zh: {
    title: '白底商品图生成器',
    eyebrow: '平台主图工具',
    description:
      '上传一张商品图，生成干净白底、自然接触阴影和平台可用留白的商品主图。',
    upload: '上传商品图',
    uploadHint: 'JPG、PNG、WebP；单张不超过 12MB。',
    productDescription: '商品描述',
    productPlaceholder: '例如：白色陶瓷咖啡杯，带原木底座，哑光质感',
    platform: '平台用途',
    shadow: '阴影强度',
    margin: '主体留白',
    model: '生图模型',
    ratio: '尺寸比例',
    resolution: '分辨率',
    generate: '生成白底图',
    source: '原图',
    result: '生成结果',
    emptySource: '先上传商品图',
    emptyResult: '生成后会在这里展示白底图。',
    preview: '预览',
    download: '下载',
    credits: '预计点数',
    authRequired: '请先登录后再生成。',
    insufficientCredits: (required, available) =>
      `点数不足：需要 ${required} 点，当前 ${available} 点。`,
    submitting: '正在提交白底图任务...',
    polling: '任务已提交，正在生成白底图。',
    failed: '生成失败，请稍后重试。',
    status: {
      idle: '待生成',
      queued: '排队中',
      processing: '处理中',
      completed: '已完成',
      failed: '失败',
    },
  },
  en: {
    title: 'White Background Product Photo Generator',
    eyebrow: 'Marketplace main image tool',
    description:
      'Upload one product image and create a clean white-background listing photo with natural contact shadow and platform-safe spacing.',
    upload: 'Upload product image',
    uploadHint: 'JPG, PNG, or WebP. Up to 12MB.',
    productDescription: 'Product description',
    productPlaceholder: 'Example: white ceramic coffee mug with wood base',
    platform: 'Platform',
    shadow: 'Shadow strength',
    margin: 'Product margin',
    model: 'Generation model',
    ratio: 'Aspect ratio',
    resolution: 'Resolution',
    generate: 'Generate white image',
    source: 'Source image',
    result: 'Result',
    emptySource: 'Upload a product image first',
    emptyResult: 'The white-background result will appear here.',
    preview: 'Preview',
    download: 'Download',
    credits: 'Estimated credits',
    authRequired: 'Please log in before generating.',
    insufficientCredits: (required, available) =>
      `Insufficient credits: ${required} required, ${available} available.`,
    submitting: 'Submitting white-background task...',
    polling: 'Task submitted. Generating white-background image.',
    failed: 'Generation failed. Please try again.',
    status: {
      idle: 'Idle',
      queued: 'Queued',
      processing: 'Processing',
      completed: 'Completed',
      failed: 'Failed',
    },
  },
  ja: {
    title: '白背景の商品画像生成',
    eyebrow: 'マーケットプレイス主画像',
    description:
      '商品画像から、白背景・自然な接地影・使いやすい余白の主画像を生成します。',
    upload: '商品画像をアップロード',
    uploadHint: 'JPG、PNG、WebP。最大 12MB。',
    productDescription: '商品説明',
    productPlaceholder: '例：木製台座付きの白い陶器マグ',
    platform: '用途',
    shadow: '影の強さ',
    margin: '余白',
    model: '生成モデル',
    ratio: '比率',
    resolution: '解像度',
    generate: '白背景を生成',
    source: '元画像',
    result: '生成結果',
    emptySource: 'まず商品画像をアップロード',
    emptyResult: '白背景の結果がここに表示されます。',
    preview: 'プレビュー',
    download: '保存',
    credits: '推定クレジット',
    authRequired: '生成前にログインしてください。',
    insufficientCredits: (required, available) =>
      `クレジット不足：必要 ${required}、現在 ${available}。`,
    submitting: '白背景タスクを送信中...',
    polling: 'タスクを送信しました。生成中です。',
    failed: '生成に失敗しました。再試行してください。',
    status: {
      idle: '待機',
      queued: '待機中',
      processing: '処理中',
      completed: '完了',
      failed: '失敗',
    },
  },
  ko: {
    title: '흰 배경 상품 이미지 생성기',
    eyebrow: '마켓플레이스 대표 이미지',
    description:
      '상품 이미지를 업로드해 흰 배경, 자연스러운 접지 그림자, 플랫폼용 여백을 갖춘 이미지를 생성합니다.',
    upload: '상품 이미지 업로드',
    uploadHint: 'JPG, PNG, WebP. 최대 12MB.',
    productDescription: '상품 설명',
    productPlaceholder: '예: 원목 받침이 있는 흰색 세라믹 머그',
    platform: '플랫폼',
    shadow: '그림자 강도',
    margin: '여백',
    model: '생성 모델',
    ratio: '비율',
    resolution: '해상도',
    generate: '흰 배경 생성',
    source: '원본',
    result: '결과',
    emptySource: '먼저 상품 이미지를 업로드',
    emptyResult: '흰 배경 결과가 여기에 표시됩니다.',
    preview: '미리보기',
    download: '다운로드',
    credits: '예상 크레딧',
    authRequired: '생성 전에 로그인해 주세요.',
    insufficientCredits: (required, available) =>
      `크레딧 부족: ${required} 필요, 현재 ${available}.`,
    submitting: '흰 배경 작업 제출 중...',
    polling: '작업을 제출했습니다. 생성 중입니다.',
    failed: '생성에 실패했습니다. 다시 시도해 주세요.',
    status: {
      idle: '대기',
      queued: '대기 중',
      processing: '처리 중',
      completed: '완료',
      failed: '실패',
    },
  },
  es: {
    title: 'Generador de foto con fondo blanco',
    eyebrow: 'Imagen principal para marketplace',
    description:
      'Sube una foto de producto y crea una imagen limpia con fondo blanco, sombra natural y margen listo para plataforma.',
    upload: 'Subir producto',
    uploadHint: 'JPG, PNG o WebP. Hasta 12MB.',
    productDescription: 'Descripcion del producto',
    productPlaceholder: 'Ejemplo: taza ceramica blanca con base de madera',
    platform: 'Plataforma',
    shadow: 'Sombra',
    margin: 'Margen',
    model: 'Modelo',
    ratio: 'Proporcion',
    resolution: 'Resolucion',
    generate: 'Generar fondo blanco',
    source: 'Imagen original',
    result: 'Resultado',
    emptySource: 'Primero sube una imagen',
    emptyResult: 'El resultado con fondo blanco aparecera aqui.',
    preview: 'Vista previa',
    download: 'Descargar',
    credits: 'Creditos estimados',
    authRequired: 'Inicia sesion antes de generar.',
    insufficientCredits: (required, available) =>
      `Creditos insuficientes: requiere ${required}, tienes ${available}.`,
    submitting: 'Enviando tarea de fondo blanco...',
    polling: 'Tarea enviada. Generando imagen.',
    failed: 'No se pudo generar. Intentalo de nuevo.',
    status: {
      idle: 'En espera',
      queued: 'En cola',
      processing: 'Procesando',
      completed: 'Completado',
      failed: 'Fallido',
    },
  },
};

const PLATFORM_OPTIONS = ['Amazon', 'Shopify', 'Etsy', 'Independent store'];
const SHADOW_OPTIONS = ['soft contact shadow', 'natural shadow', 'no shadow'];
const MARGIN_OPTIONS = [
  'tight crop',
  'balanced margin',
  'large marketplace margin',
];

export function WhiteBackgroundWorkbench({
  locale = 'en',
}: {
  locale?: Locale;
}) {
  const { locale: currentLocale, setLocale } = useProductLocale(locale);
  const copy = COPY[currentLocale];
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: session } = authClient.useSession();
  const signedIn = !!session?.user;
  const creditQuery = useGenerationCredits();
  const inputRef = useRef<HTMLInputElement>(null);
  const restoredSessionRef = useRef(false);
  const [sourceImage, setSourceImage] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState(PLATFORM_OPTIONS[0]);
  const [shadow, setShadow] = useState(SHADOW_OPTIONS[0]);
  const [margin, setMargin] = useState(MARGIN_OPTIONS[1]);
  const [model, setModel] = useState<KieModelId>(DEFAULT_MODEL as KieModelId);
  const modelConfig =
    KIE_MODELS.find((item) => item.id === model) ?? DEFAULT_MODEL_CONFIG;
  const [aspectRatio, setAspectRatio] = useState<KieAspectRatio>(
    modelConfig.aspectRatios.includes('1:1')
      ? '1:1'
      : getDefaultKieAspectRatio(DEFAULT_MODEL)
  );
  const [resolution, setResolution] = useState<KieResolution>(
    getDefaultKieOutputValue(DEFAULT_MODEL)
  );
  const [credits, setCredits] = useState(creditQuery.data?.balance ?? 0);
  const [status, setStatus] = useState<Status>('idle');
  const [notice, setNotice] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const requiredCredits = useMemo(
    () => estimateTaskCreditCost({ resolution }),
    [resolution]
  );

  useEffect(() => {
    if (creditQuery.data) setCredits(creditQuery.data.balance);
  }, [creditQuery.data]);

  useEffect(() => {
    if (
      !(modelConfig.aspectRatios as readonly string[]).includes(aspectRatio)
    ) {
      setAspectRatio(modelConfig.aspectRatios[0]);
    }
    if (
      supportsKieOutputParam(modelConfig.id) &&
      !modelConfig.outputParam?.options.includes(resolution)
    ) {
      setResolution(getDefaultKieOutputValue(modelConfig.id));
    }
    if (!supportsKieOutputParam(modelConfig.id) && resolution) {
      setResolution('');
    }
  }, [aspectRatio, modelConfig, resolution]);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId || restoredSessionRef.current || resultUrl || sourceImage) {
      return;
    }
    const saved = loadGeneratorSession('white-background', userId);
    const task = saved?.tasks[0];
    if (!saved || !task) return;

    restoredSessionRef.current = true;
    setSourceName(task.name);
    setStatus('processing');
    setNotice(copy.polling);
    void pollTask(task.serverTaskId, saved.batchId);
  }, [copy.polling, resultUrl, session?.user?.id, sourceImage]);

  function handleLocaleChange(next: ProductLocale) {
    setLocale(next);
    const nextPath = getLocalizedPublicPath(pathname, next);
    if (nextPath !== pathname) navigate({ to: nextPath });
  }

  async function handleFile(file?: File) {
    if (!file || !file.type.startsWith('image/')) return;
    const dataUrl = await readFileAsDataUrl(file);
    setSourceImage(dataUrl);
    setSourceName(file.name);
    setResultUrl('');
    setStatus('idle');
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    void handleFile(event.target.files?.[0]);
    event.target.value = '';
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
    void handleFile(event.dataTransfer.files[0]);
  }

  async function generate() {
    if (!sourceImage) return;
    if (!signedIn) {
      setNotice(copy.authRequired);
      return;
    }
    if (credits < requiredCredits) {
      setNotice(copy.insufficientCredits(requiredCredits, credits));
      return;
    }
    setStatus('queued');
    setResultUrl('');
    setNotice(copy.submitting);
    const prompt = buildPrompt({
      description,
      platform,
      shadow,
      margin,
      aspectRatio,
      resolution: supportsKieOutputParam(model) ? resolution : '',
    });
    try {
      const batch = await createGenerationBatch({
        data: {
          locale: currentLocale,
          productDescription:
            description.trim() || 'White background product photo',
          sourceImageDataUrl: sourceImage,
          sourceName: sourceName || 'product.png',
          tasks: [
            {
              id: 'white-background-output',
              kind: 'main',
              style: 'White background product photo',
              aspectRatio,
              resolution: supportsKieOutputParam(model) ? resolution : '',
              model,
              prompt,
              referenceName: sourceName,
            },
          ],
        },
      });

      if (!batch.ok) {
        setCredits(batch.availableCredits);
        setNotice(
          copy.insufficientCredits(
            batch.requiredCredits,
            batch.availableCredits
          )
        );
        setStatus('idle');
        return;
      }

      setCredits(batch.balance);
      setStatus('processing');
      setNotice(copy.polling);
      const taskId = batch.tasks[0]?.taskId;
      if (taskId && session?.user?.id) {
        saveGeneratorSession({
          mode: 'white-background',
          userId: session.user.id,
          batchId: batch.batchId,
          createdAt: Date.now(),
          tasks: [
            {
              clientId: 'white-background-output',
              serverTaskId: taskId,
              name: sourceName || 'white-background.png',
            },
          ],
        });
      }
      if (taskId) await pollTask(taskId, batch.batchId);
      void creditQuery.refetch();
    } catch {
      setNotice(copy.failed);
      setStatus('failed');
      void creditQuery.refetch();
    }
  }

  async function pollTask(taskId: string, batchId?: string) {
    for (let attempt = 0; attempt < 90; attempt += 1) {
      await wait(attempt === 0 ? 1200 : 2500);
      const result = await getGenerationTaskStatuses({
        data: { taskIds: [taskId] },
      });
      setCredits(result.balance);
      const item = result.statuses[0];
      if (!item) continue;
      if (item.status === 'completed' && item.imageUrl) {
        setResultUrl(item.imageUrl);
        setStatus('completed');
        setNotice('');
        if (session?.user?.id) {
          clearGeneratorSession('white-background', session.user.id);
        }
        return;
      }
      if (item.status === 'failed') {
        setStatus('failed');
        setNotice(item.errorMessage || copy.failed);
        if (session?.user?.id) {
          clearGeneratorSession('white-background', session.user.id);
        }
        return;
      }
      setStatus('processing');
    }
    if (batchId && session?.user?.id) {
      saveGeneratorSession({
        mode: 'white-background',
        userId: session.user.id,
        batchId,
        createdAt: Date.now(),
        tasks: [
          {
            clientId: 'white-background-output',
            serverTaskId: taskId,
            name: sourceName || 'white-background.png',
          },
        ],
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#20231e]">
      <GeneratorWorkbenchHeader
        locale={currentLocale}
        active="white-background"
        credits={credits}
        refreshDisabled={!signedIn || creditQuery.isFetching}
        refreshing={creditQuery.isFetching}
        onRefresh={() => void creditQuery.refetch()}
        onLocaleChange={handleLocaleChange}
      />

      <section className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)_420px]">
        <aside className="border-[#dfe3d8] border-b bg-[#fbfcf7] p-4 lg:border-r lg:border-b-0">
          <p className="font-semibold text-[#2f5f4f] text-sm">{copy.eyebrow}</p>
          <h1 className="mt-2 font-bold text-2xl tracking-tight">
            {copy.title}
          </h1>
          <p className="mt-3 text-[#5f665b] text-sm leading-6">
            {copy.description}
          </p>

          <button
            type="button"
            className={`mt-5 flex min-h-36 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed p-4 text-left transition ${
              isDragging
                ? 'border-[#d83b01] bg-[#fff4ec]'
                : 'border-[#cbd2c3] bg-white'
            }`}
            onClick={() => inputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-lg bg-[#eef1e8] text-[#6e7d67]">
                <IconPhotoScan className="size-6" />
              </div>
              <div>
                <p className="font-semibold">{copy.upload}</p>
                <p className="mt-1 text-[#8a9282] text-xs">
                  {sourceName || copy.uploadHint}
                </p>
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={onInputChange}
            />
          </button>

          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <label className="font-medium text-sm" htmlFor="white-desc">
                {copy.productDescription}
              </label>
              <Textarea
                id="white-desc"
                value={description}
                placeholder={copy.productPlaceholder}
                className="min-h-28 resize-none bg-white"
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <FieldSelect
              label={copy.platform}
              value={platform}
              options={PLATFORM_OPTIONS}
              onChange={setPlatform}
            />
            <div className="grid grid-cols-2 gap-3">
              <FieldSelect
                label={copy.shadow}
                value={shadow}
                options={SHADOW_OPTIONS}
                onChange={setShadow}
              />
              <FieldSelect
                label={copy.margin}
                value={margin}
                options={MARGIN_OPTIONS}
                onChange={setMargin}
              />
            </div>
            <FieldSelect
              label={copy.model}
              value={model}
              options={KIE_MODELS.map((item) => item.id)}
              renderOption={(value) =>
                KIE_MODELS.find((item) => item.id === value)?.label ?? value
              }
              onChange={(value) => setModel(value as KieModelId)}
            />
            <div className="grid grid-cols-2 gap-3">
              <FieldSelect
                label={copy.ratio}
                value={aspectRatio}
                options={modelConfig.aspectRatios}
                onChange={(value) => setAspectRatio(value as KieAspectRatio)}
              />
              {modelConfig.outputParam ? (
                <FieldSelect
                  label={copy.resolution}
                  value={resolution}
                  options={modelConfig.outputParam.options}
                  renderOption={(value) =>
                    `${value} · ${modelConfig.outputParam?.label}`
                  }
                  onChange={(value) => setResolution(value as KieResolution)}
                />
              ) : null}
            </div>
          </div>
        </aside>

        <section className="min-w-0 p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-2xl">{copy.source}</h2>
              <p className="mt-1 text-[#74796d] text-sm">{sourceName}</p>
            </div>
            <div className="rounded-md border border-[#dfe3d8] bg-white px-3 py-2 text-sm">
              {copy.credits}: <strong>{requiredCredits}</strong>
            </div>
          </div>
          <div className="flex min-h-[560px] items-center justify-center rounded-lg border border-[#dfe3d8] bg-white">
            {sourceImage ? (
              <img
                src={sourceImage}
                alt={copy.source}
                className="max-h-[520px] max-w-full rounded-md object-contain p-4"
              />
            ) : (
              <div className="text-center text-[#8a9282]">
                <IconCloudUpload className="mx-auto size-10" />
                <p className="mt-3">{copy.emptySource}</p>
              </div>
            )}
          </div>
          {notice ? (
            <p className="mt-4 rounded-md border border-[#eadfca] bg-[#fff8ea] px-3 py-2 text-[#8a5a16] text-sm">
              {notice}
            </p>
          ) : null}
          <Button
            type="button"
            className="mt-4 h-11 w-full bg-[#20231e]"
            disabled={!sourceImage || ['queued', 'processing'].includes(status)}
            onClick={() => void generate()}
          >
            {['queued', 'processing'].includes(status) ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : (
              <IconPlayerPlay className="size-4" />
            )}
            {status === 'queued'
              ? copy.submitting
              : status === 'processing'
                ? copy.status.processing
                : copy.generate}
          </Button>
        </section>

        <aside className="border-[#dfe3d8] border-t bg-[#fbfcf7] p-4 lg:border-t-0 lg:border-l">
          <div className="rounded-lg border border-[#dfe3d8] bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-xl">{copy.result}</h2>
                <p className="mt-1 text-[#74796d] text-sm">
                  {copy.status[status]}
                </p>
              </div>
              <IconWand className="size-5 text-[#d83b01]" />
            </div>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#dfe3d8] bg-[#fbfcf7]">
              {resultUrl ? (
                <button
                  type="button"
                  className="h-full w-full"
                  onClick={() => setPreviewUrl(resultUrl)}
                >
                  <img
                    src={resultUrl}
                    alt={copy.result}
                    className="h-full w-full object-contain p-3"
                  />
                </button>
              ) : ['queued', 'processing'].includes(status) ? (
                <div className="px-8 text-center text-[#8a9282] text-sm">
                  <IconLoader2 className="mx-auto mb-3 size-7 animate-spin text-[#d83b01]" />
                  <p>{copy.status[status]}</p>
                </div>
              ) : (
                <p className="px-8 text-center text-[#8a9282] text-sm">
                  {copy.emptyResult}
                </p>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!resultUrl}
                onClick={() => resultUrl && setPreviewUrl(resultUrl)}
              >
                <IconEye className="size-4" />
                {copy.preview}
              </Button>
              <Button
                type="button"
                className="bg-[#d83b01]"
                disabled={!resultUrl}
                onClick={() =>
                  resultUrl &&
                  void downloadFile(
                    resultUrl,
                    `prodlist-white-${Date.now()}.png`
                  )
                }
              >
                <IconDownload className="size-4" />
                {copy.download}
              </Button>
            </div>
          </div>
        </aside>
      </section>

      {previewUrl ? (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setPreviewUrl('')}
          aria-label={copy.preview}
        >
          <img
            src={previewUrl}
            alt={copy.preview}
            className="max-h-[92vh] max-w-[92vw] rounded-lg bg-white object-contain shadow-2xl"
          />
        </button>
      ) : null}
    </main>
  );
}

function FieldSelect({
  label,
  value,
  options,
  renderOption,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  renderOption?: (value: string) => string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <span className="font-medium text-sm">{label}</span>
      <Select value={value} onValueChange={(next) => next && onChange(next)}>
        <SelectTrigger className="w-full bg-white">
          <span className="truncate">
            {renderOption ? renderOption(value) : value}
          </span>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {renderOption ? renderOption(option) : option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function buildPrompt({
  description,
  platform,
  shadow,
  margin,
  aspectRatio,
  resolution,
}: {
  description: string;
  platform: string;
  shadow: string;
  margin: string;
  aspectRatio: string;
  resolution: string;
}) {
  return [
    'Use the uploaded product image as the immutable source.',
    'Create a clean white-background ecommerce product photo.',
    `Product description: ${description.trim() || 'uploaded product'}.`,
    `Platform target: ${platform}.`,
    `Shadow treatment: ${shadow}. Product framing: ${margin}.`,
    `Aspect ratio: ${aspectRatio}.`,
    resolution ? `Output quality: ${resolution}.` : '',
    'Keep exact product identity, geometry, material, labels, logos, color, and silhouette.',
    'Do not invent extra products, do not change the product category, do not add props, text, hands, watermarks, or decorative backgrounds.',
    'Only clean background, exposure, edge cleanup, centered composition, natural contact shadow, and subtle retouching are allowed.',
  ]
    .filter(Boolean)
    .join(' ');
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
