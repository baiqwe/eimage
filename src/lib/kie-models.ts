export type KieModelAdapter = 'gpt-image-2' | 'seedream' | 'seedream-4-5';

export type KieModelParam = {
  apiName: 'resolution' | 'image_resolution' | 'quality';
  label: string;
  options: string[];
};

export type KieModelConfig = {
  id: string;
  label: string;
  adapter: KieModelAdapter;
  aspectRatios: string[];
  outputParam?: KieModelParam;
  docs: string;
};

export const KIE_MODELS: KieModelConfig[] = [
  {
    id: 'gpt-image-2-image-to-image',
    label: 'GPT Image 2',
    adapter: 'gpt-image-2',
    aspectRatios: ['auto', '1:1', '3:2', '2:3'],
    docs: 'https://docs.kie.ai/market/gpt/gpt-image-2-image-to-image',
  },
  {
    id: 'bytedance/seedream-v4-edit',
    label: 'Seedream 4.0 Edit',
    adapter: 'seedream',
    aspectRatios: ['1:1', '4:5', '3:4', '16:9', '9:16'],
    outputParam: {
      apiName: 'image_resolution',
      label: 'image_resolution',
      options: ['1K', '2K'],
    },
    docs: 'https://docs.kie.ai/market/seedream/seedream-v4-edit',
  },
  {
    id: 'seedream/4.5-edit',
    label: 'Seedream 4.5 Edit',
    adapter: 'seedream-4-5',
    aspectRatios: [
      'match_input_image',
      '1:1',
      '2:3',
      '3:2',
      '3:4',
      '4:3',
      '4:5',
      '5:4',
      '9:16',
      '16:9',
      '21:9',
    ],
    outputParam: {
      apiName: 'quality',
      label: 'quality',
      options: ['basic'],
    },
    docs: 'https://docs.kie.ai/market/seedream/4-5-edit',
  },
];

export type KieModelId = (typeof KIE_MODELS)[number]['id'];

export function getKieModelConfig(model?: string) {
  return KIE_MODELS.find((item) => item.id === model) ?? KIE_MODELS[0];
}

export function getDefaultKieAspectRatio(model?: string) {
  return getKieModelConfig(model).aspectRatios[0] ?? 'auto';
}

export function getDefaultKieOutputValue(model?: string) {
  return getKieModelConfig(model).outputParam?.options[0] ?? '';
}

export function getKieOutputOptions(model?: string) {
  return getKieModelConfig(model).outputParam?.options ?? [];
}

export function supportsKieOutputParam(model?: string) {
  return getKieOutputOptions(model).length > 0;
}
