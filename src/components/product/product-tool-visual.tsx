import type { ProductTool } from '@/lib/product-tools';

type ProductToolVisualProps = {
  visual: ProductTool['visual'];
  label: string;
};

export function ProductToolVisual({ visual, label }: ProductToolVisualProps) {
  if (visual === 'set') {
    return (
      <div
        role="img"
        aria-label={label}
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f5f0e6]"
      >
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[#d9ded1]" />
        <div className="absolute top-6 left-6 grid w-[58%] grid-cols-2 gap-3">
          {['Hero', 'Detail', 'Scene', 'Ad'].map((item, index) => (
            <div
              className="rounded-lg border border-white/70 bg-white/80 p-3 shadow-sm"
              key={item}
            >
              <div className="mb-3 h-16 rounded-md bg-[#2f5f4f]/15" />
              <div className="h-2 w-12 rounded-full bg-[#20231e]/20" />
              <div className="mt-2 h-2 w-20 rounded-full bg-[#20231e]/10" />
              <span className="mt-3 block font-medium text-[#20231e] text-xs">
                {index + 1}. {item}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute right-8 bottom-8 flex h-36 w-28 items-center justify-center rounded-[28px] border-8 border-white bg-[#c7d7c8] shadow-2xl">
          <div className="h-14 w-14 rounded-full border-4 border-[#7b8d77]" />
        </div>
      </div>
    );
  }

  if (visual === 'white') {
    return (
      <div
        role="img"
        aria-label={label}
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(32,35,30,0.05)_1px,transparent_1px),linear-gradient(rgba(32,35,30,0.05)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="-bottom-5 absolute inset-x-2 h-9 rounded-full bg-black/15 blur-xl" />
            <div className="relative h-36 w-28 rounded-[30px] border-8 border-[#f2f3ed] bg-[#d9ded1] shadow-xl">
              <div className="mx-auto mt-6 h-11 w-14 rounded-full border-4 border-[#9aa48d]" />
              <div className="mx-auto mt-5 h-8 w-16 rounded-full bg-white/70" />
            </div>
          </div>
        </div>
        <div className="absolute right-5 bottom-5 rounded-lg border bg-white/90 px-3 py-2 text-[#20231e] shadow-sm">
          <p className="font-medium text-sm">Pure white listing</p>
          <p className="mt-1 text-[#74796d] text-xs">
            Centered with soft shadow
          </p>
        </div>
      </div>
    );
  }

  if (visual === 'marketplace') {
    return (
      <div
        role="img"
        aria-label={label}
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#eef2e8]"
      >
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-white" />
        <div className="absolute top-5 right-5 grid w-36 gap-2">
          <div className="rounded-md bg-white/85 p-2 shadow-sm">
            <div className="h-2 w-20 rounded-full bg-[#20231e]/25" />
            <div className="mt-2 h-2 w-28 rounded-full bg-[#20231e]/10" />
          </div>
          <div className="rounded-md bg-[#2f5f4f] p-2 text-white text-xs">
            Listing ready
          </div>
          <div className="rounded-md bg-[#c9822f]/90 p-2 text-white text-xs">
            A+ scene
          </div>
        </div>
        <div className="absolute bottom-14 left-12 h-34 w-28 rounded-[30px] border-8 border-white bg-[#d9ded1] shadow-2xl">
          <div className="mx-auto mt-6 h-11 w-14 rounded-full border-4 border-[#7b8d77]" />
          <div className="mx-auto mt-5 h-8 w-16 rounded-full bg-white/70" />
        </div>
        <div className="absolute bottom-8 left-24 h-8 w-44 rounded-full bg-black/15 blur-xl" />
      </div>
    );
  }

  if (visual === 'cosmetic') {
    return (
      <div
        role="img"
        aria-label={label}
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f8e6e1]"
      >
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[#dfeee9]" />
        <div className="absolute top-8 left-8 h-24 w-24 rounded-full bg-white/45 blur-xl" />
        <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-[#c9822f]/25 blur-2xl" />
        <div className="absolute inset-0 flex items-center justify-center gap-5">
          <div className="relative mt-10 h-32 w-20 rounded-[24px] border-6 border-white bg-[#f4c7be] shadow-2xl">
            <div className="mx-auto mt-5 h-10 w-12 rounded-full bg-white/55" />
            <div className="mx-auto mt-5 h-3 w-12 rounded-full bg-[#20231e]/20" />
          </div>
          <div className="relative h-40 w-16 rounded-[18px] border-6 border-white bg-[#eef7f2] shadow-2xl">
            <div className="mx-auto mt-7 h-16 w-8 rounded-full bg-white/70" />
          </div>
        </div>
        <div className="absolute right-5 bottom-5 left-5 rounded-lg border border-white/50 bg-white/60 p-3 text-[#20231e] backdrop-blur">
          <p className="font-medium text-sm">Beauty campaign scene</p>
          <p className="mt-1 text-[#74796d] text-xs">
            Water, glass, glow, and soft gradients
          </p>
        </div>
      </div>
    );
  }

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
