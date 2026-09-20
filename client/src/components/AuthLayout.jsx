/**
 * Split screen: a dark panel that states what this codebase is, and the form.
 * Under md the panel drops away and only a small wordmark remains.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden w-[42%] max-w-lg flex-col justify-between bg-ink p-10 text-white md:flex">
        <p className="text-[15px] font-semibold tracking-tight">CodeAlpha Starter</p>

        <div className="space-y-5">
          <h2 className="max-w-sm text-[28px] font-semibold leading-[1.2] tracking-tight">
            One authentication layer, three projects.
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-white/60">
            Registration, sign in, hashed passwords and protected routes are already wired
            up. Copy this folder, add your own models, and the plumbing keeps working.
          </p>

          <ul className="space-y-2.5 pt-2 text-sm text-white/50">
            <li>E-commerce store</li>
            <li>Social media platform</li>
            <li>Project management tool</li>
          </ul>
        </div>

        <p className="text-xs text-white/35">Full Stack Development internship</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-[26rem]">
          <p className="mb-10 text-[15px] font-semibold tracking-tight text-ink md:hidden">
            CodeAlpha Starter
          </p>

          <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-ink">
            {title}
          </h1>
          <p className="mt-2 text-[15px] text-slate">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-sm text-slate">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
