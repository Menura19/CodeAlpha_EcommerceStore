import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="max-w-sm text-center">
        <h1 className="text-[26px] font-semibold tracking-tight text-ink">
          This page does not exist
        </h1>
        <p className="mt-2 text-[15px] text-slate">
          The link may be mistyped, or the page has moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-accent px-4 py-2.5 text-[15px] font-medium text-white hover:bg-accent/90"
        >
          Back to the dashboard
        </Link>
      </div>
    </div>
  );
}
