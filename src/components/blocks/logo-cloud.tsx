export default function LogoCloudSection() {
  const logos = [
    { src: 'https://cdn.mksaas.com/svg/nvidia.svg', alt: 'Nvidia', h: 'h-5' },
    { src: 'https://cdn.mksaas.com/svg/column.svg', alt: 'Column', h: 'h-4' },
    { src: 'https://cdn.mksaas.com/svg/github.svg', alt: 'GitHub', h: 'h-4' },
    { src: 'https://cdn.mksaas.com/svg/nike.svg', alt: 'Nike', h: 'h-5' },
    { src: 'https://cdn.mksaas.com/svg/laravel.svg', alt: 'Laravel', h: 'h-4' },
    { src: 'https://cdn.mksaas.com/svg/openai.svg', alt: 'OpenAI', h: 'h-6' },
    { src: 'https://cdn.mksaas.com/svg/tailwindcss.svg', alt: 'Tailwind', h: 'h-4' },
    { src: 'https://cdn.mksaas.com/svg/vercel.svg', alt: 'Vercel', h: 'h-5' },
  ]

  return (
    <section id="logo-cloud" className="bg-muted/50 px-4 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-xl font-medium">
          Trusted by teams at
        </h2>
        <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className={`${logo.h} w-fit dark:invert`}
              height={24}
              width="auto"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
