import type { ProductTool } from '@/lib/product-tools';

type ProductToolVisualProps = {
  visual: ProductTool['visual'];
  label: string;
};

export function ProductToolVisual({ visual, label }: ProductToolVisualProps) {
  if (visual === 'jewelry') {
    return (
      <div
        role="img"
        aria-label={label}
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#11140f]"
      >
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#262b23]" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-[#c9822f]/75" />
        <div className="absolute top-8 left-8 h-20 w-20 rounded-full border border-white/10 bg-white/5 blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="-bottom-5 absolute inset-x-2 h-8 rounded-full bg-black/45 blur-xl" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-[#e8dcc4] bg-[#b88f4a] shadow-2xl">
              <div className="h-16 w-16 rounded-full border-10 border-[#f7f0dc] bg-[#11140f]" />
              <div className="absolute top-3 right-7 h-5 w-5 rounded-full bg-white shadow-[0_0_28px_rgba(255,255,255,0.9)]" />
            </div>
          </div>
        </div>
        <div className="absolute right-5 bottom-5 left-5 rounded-lg border border-white/10 bg-white/10 p-3 text-white backdrop-blur">
          <p className="font-medium text-sm">Premium reflections</p>
          <p className="mt-1 text-white/70 text-xs">
            Metal, gem, and close-up detail scenes
          </p>
        </div>
      </div>
    );
  }

  if (visual === 'shoe') {
    return (
      <div
        role="img"
        aria-label={label}
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#e2d4b8]"
      >
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[#fbfcf7]" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-[#2f5f4f]" />
        <div className="absolute top-7 left-7 h-16 w-32 rounded-full bg-white/30 blur-xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative -rotate-6">
            <div className="-bottom-6 absolute left-6 h-9 w-44 rounded-full bg-black/25 blur-lg" />
            <div className="relative h-20 w-52 rounded-[32px_56px_36px_28px] border-8 border-white bg-[#d9ded1] shadow-2xl">
              <div className="absolute right-5 bottom-4 left-8 h-3 rounded-full bg-[#798470]" />
              <div className="absolute top-4 left-12 h-5 w-20 rounded-full border-4 border-[#9aa48d]" />
              <div className="absolute right-3 bottom-2 h-8 w-10 rounded-r-full bg-white" />
            </div>
          </div>
        </div>
        <div className="absolute right-5 bottom-5 left-5 grid grid-cols-3 gap-2">
          <div className="rounded-md bg-white/80 px-2 py-1 text-[#20231e] text-xs">
            Hero
          </div>
          <div className="rounded-md bg-white/80 px-2 py-1 text-[#20231e] text-xs">
            Lifestyle
          </div>
          <div className="rounded-md bg-white/80 px-2 py-1 text-[#20231e] text-xs">
            Ads
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f8faf2]"
    >
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#d9ded1]" />
      <div className="absolute top-0 right-0 h-full w-1/3 bg-[#2f5f4f]/85" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="-bottom-5 absolute inset-x-4 h-8 rounded-full bg-black/25 blur-lg" />
          <div className="relative h-32 w-24 rounded-[26px] border-8 border-white bg-[#d9ded1] shadow-2xl">
            <div className="mx-auto mt-5 h-10 w-12 rounded-full border-4 border-[#9aa48d]" />
            <div className="mx-auto mt-4 h-7 w-14 rounded-full bg-white/60" />
          </div>
        </div>
      </div>
      <div className="absolute top-5 left-5 rounded-lg bg-white/90 px-3 py-2 text-[#20231e] shadow-sm">
        <p className="font-medium text-sm">Clean background set</p>
        <p className="mt-1 text-[#74796d] text-xs">
          White, studio, marketplace
        </p>
      </div>
    </div>
  );
}
