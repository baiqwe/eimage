export const KIE_MODELS = [
  {
    id: 'gpt-image-2-image-to-image',
    label: 'GPT Image 2',
    adapter: 'gpt-image-2',
    aspectRatios: ['auto', '1:1', '3:2', '2:3'] as const,
    resolutions: ['1K', '2K', '4K'] as const,
    resolutionLabel: 'resolution',
    docs: 'https://docs.kie.ai/gpt-image-2/image-to-image',
  },
  {
    id: 'bytedance/seedream-v4-edit',
    label: 'Seedream 4.0 Edit',
    adapter: 'seedream',
    aspectRatios: ['1:1', '4:5', '3:4', '16:9', '9:16'] as const,
    resolutions: ['1K', '2K'] as const,
    resolutionLabel: 'image_resolution',
    docs: 'https://docs.kie.ai/market/seedream/seedream-v4-edit',
  },
  {
    id: 'bytedance/seedream-4-5-edit',
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
    ] as const,
    resolutions: ['1K', '2K', '4K'] as const,
    resolutionLabel: 'quality',
    docs: 'https://docs.kie.ai/market/seedream/seedream-4.5-edit',
  },
] as const;

export type KieModelId = (typeof KIE_MODELS)[number]['id'];
