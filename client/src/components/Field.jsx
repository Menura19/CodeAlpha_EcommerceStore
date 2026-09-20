/** One labelled input. Keeps every form in the app consistent. */
export default function Field({ label, hint, id, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px]
                    placeholder:text-slate/50 focus:border-accent focus:outline-none
                    focus:ring-2 focus:ring-accent/20 ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-slate">{hint}</p>}
    </div>
  );
}
