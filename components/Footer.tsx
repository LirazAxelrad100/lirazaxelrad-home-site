import type { FooterContent } from "@/content/types";

interface FooterProps {
  nameLabel: string;
  footer: FooterContent;
  compact?: boolean;
}

export function Footer({ nameLabel, footer, compact = false }: FooterProps) {
  return (
    <footer className={`${compact ? "mt-4" : "mt-20"} border-t border-border font-heebo`}>
      <div
        className={`flex flex-wrap items-center justify-between gap-6 px-[6vw] ${compact ? "pb-6 pt-6" : "pb-10 pt-12"}`}
      >
        <div>
          <div className="font-rubik text-[16px] text-text-primary">{nameLabel}</div>
          <a href={`mailto:${footer.email}`} className="text-[14px] text-text-muted no-underline">
            {footer.email}
          </a>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="#"
            title="RSS"
            aria-label="RSS"
            className="flex items-center text-text-muted transition-colors hover:text-accent"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="19" r="2" fill="currentColor" />
              <path
                d="M4 11C10.0751 11 15 15.9249 15 22"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M4 4C13.3888 4 21 11.6112 21 21"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </a>
          {footer.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="text-[14px] text-text-muted no-underline transition-colors hover:text-accent"
            >
              {s.label}
            </a>
          ))}
          <a href={footer.mirrorHref} className="text-[13px] text-accent no-underline">
            {footer.mirrorLabel}
          </a>
        </div>
      </div>
      <div className={`${compact ? "pb-5" : "pb-7"} text-center text-[12px] text-text-faint`}>
        {footer.copyrightText}
      </div>
    </footer>
  );
}
