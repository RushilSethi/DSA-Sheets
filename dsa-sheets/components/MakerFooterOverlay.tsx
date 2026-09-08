import Link from 'next/link';

const GITHUB_URL = 'https://github.com/RushilSethi';

// Personal presence palette (matches portfolio / YT Jukebox footer)
const PRESENCE = {
  bar: 'rgba(15, 18, 28, 0.82)',
  madeBy: '#b8b4f8',
  name: '#ffffff',
  muted: 'rgba(255, 255, 255, 0.55)',
  iconHover: '#b8b4f8',
} as const;

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.515.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.635.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function MakerFooterOverlay() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center border-t border-white/[0.06] py-2 backdrop-blur-md"
      style={{ backgroundColor: PRESENCE.bar }}
    >
      <div className="flex items-center gap-2 text-[13px] font-medium tracking-wide">
        <span style={{ color: PRESENCE.madeBy }}>Made by</span>
        <span style={{ color: PRESENCE.name }}>Rushil Sethi</span>
        <span className="select-none" style={{ color: PRESENCE.muted }} aria-hidden="true">
          |
        </span>
        <Link
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rushil Sethi on GitHub"
          className="inline-flex text-white transition-all duration-200 ease-out hover:scale-110 hover:text-[#b8b4f8]"
        >
          <GitHubIcon className="h-[15px] w-[15px]" />
        </Link>
      </div>
    </div>
  );
}
