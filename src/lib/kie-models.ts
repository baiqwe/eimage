export const KIE_MODELS = [
  {
    id: 'gpt-image-2-image-to-image',
    label: 'GPT Image 2',
    adapter: 'gpt-image-2',
  },
  {
    id: 'bytedance/seedream-v4-edit',
    label: 'Seedream 4.0 Edit',
    adapter: 'seedream',
  },
  {
    id: 'bytedance/seedream-4-5-edit',
    label: 'Seedream 4.5 Edit',
    adapter: 'seedream',
  },
] as const;

export type KieModelId = (typeof KIE_MODELS)[number]['id'];
