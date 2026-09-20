export default function Button({ loading, children, variant = 'solid', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md px-4 py-2.5 text-[15px] font-medium ' +
    'transition-colors disabled:cursor-not-allowed disabled:opacity-55';

  const styles = {
    solid: 'bg-accent text-white hover:bg-accent/90',
    quiet: 'border border-line bg-white text-ink hover:bg-mist',
  };

  // className is merged last so callers can add layout classes without
  // wiping out the button's own styling.
  return (
    <button className={`${base} ${styles[variant]} ${className}`} disabled={loading} {...props}>
      {loading ? 'Just a moment…' : children}
    </button>
  );
}
