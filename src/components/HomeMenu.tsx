import { useState } from "react";
import { marked } from "marked";
import type { Direction, MenuItem } from "../data/types";

interface HomeMenuProps {
  name: string;
  tagline: string;
  homeHref: string;
  dir: Direction;
  items: MenuItem[];
}

export function HomeMenu({ name, tagline, homeHref, dir, items }: HomeMenuProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const isActive = activeKey !== null;
  const active = items.find((m) => m.key === activeKey) ?? null;
  const arrow = dir === "rtl" ? "←" : "→";

  // 400px is what the longest English label needs to stay on one line; the
  // panel beside it still gets its full 680px at desktop widths.
  const navWidthClass = isActive ? "md:w-[400px]" : "md:w-full md:max-w-[640px]";

  return (
    <div className="flex flex-1 flex-col font-rubik">
      <div className="flex-shrink-0 px-[6vw] pt-10 md:pt-6">
        <div className="flex flex-col gap-0">
          <a
            href={homeHref}
            onClick={(e) => {
              e.preventDefault();
              setActiveKey(null);
            }}
            className="text-accent no-underline"
          >
            <h1 className="m-0 font-rubik text-[clamp(36px,6vw,64px)] font-extralight leading-none tracking-[0.5px]">
              {name}
            </h1>
          </a>
          <span className="text-[16px] leading-none text-text-muted-soft">{tagline}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-stretch gap-6 px-[6vw] pb-0 pt-4 md:flex-row">
        <nav
          className={`my-auto flex flex-shrink-0 flex-col justify-center transition-[width] duration-300 md:my-0 ${navWidthClass}`}
        >
          {items.map((item, i) => {
            const isHover = hoverKey === item.key;
            const circleSize = isHover ? 40 : 26;
            return (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => {
                  // Below md the panel would open below the fold, so the tap looks
                  // like nothing happened. There, let the link navigate to the
                  // item's own page instead of opening the teaser panel.
                  if (!window.matchMedia("(min-width: 768px)").matches) return;
                  e.preventDefault();
                  setActiveKey(item.key);
                }}
                onMouseEnter={() => setHoverKey(item.key)}
                onMouseLeave={() => setHoverKey(null)}
                className={`group flex items-baseline gap-3 text-inherit no-underline transition-[padding] duration-300 ${
                  isActive ? "px-4 py-2.5" : "px-6 py-4"
                }`}
              >
                <span
                  className="flex flex-shrink-0 items-center justify-center rounded-full border border-transparent font-rubik transition-all duration-300"
                  style={{
                    width: circleSize,
                    height: circleSize,
                    fontWeight: isHover ? 500 : 300,
                    fontSize: isHover ? 15 : 11,
                    background: isHover ? "var(--color-accent)" : "transparent",
                    color: isHover ? "#fff" : "var(--color-text-muted)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`flex-1 font-rubik font-extralight transition-[font-weight] duration-150 group-hover:font-medium ${
                    isActive ? "text-[16px]" : "text-[22px]"
                  }`}
                >
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        {isActive && active && (
          <div className="flex-1 self-center rounded-md bg-panel p-9 md:max-w-[680px]">
            <div className="mb-3.5 text-[13px] tracking-[0.5px] text-accent">{active.eyebrow}</div>
            <h2 className="m-0 mb-4 font-rubik text-[22px] font-medium">{active.title}</h2>
            <p
              className="m-0 mb-6 text-[16px] leading-[1.7] text-text-body [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-80 [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: marked.parseInline(active.body) as string }}
            />
            <a href={active.href} className="text-[15px] font-semibold text-accent no-underline">
              {active.ctaLabel} {arrow}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
