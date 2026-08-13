"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { SiteContent } from "@/content/types";

interface HomeMenuProps {
  content: SiteContent;
}

export function HomeMenu({ content }: HomeMenuProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const isActive = activeKey !== null;
  const active = content.menu.find((m) => m.key === activeKey) ?? null;
  const hovered = content.menu.find((m) => m.key === hoverKey) ?? null;
  const arrow = content.dir === "rtl" ? "←" : "→";

  const navWidthClass = isActive
    ? "md:w-[260px]"
    : hoverKey
      ? "md:w-[340px]"
      : "md:w-full md:max-w-[640px]";

  return (
    <div className="flex min-h-screen flex-col font-rubik">
      <Header
        name={content.name}
        tagline={content.tagline}
        homeHref={content.homeHref}
        compact
        onNameClick={() => setActiveKey(null)}
      />

      <div className="flex flex-col items-stretch gap-6 px-[6vw] pb-0 pt-4 md:flex-row md:min-h-[456px]">
        <nav className={`flex flex-shrink-0 flex-col justify-center transition-[width] duration-300 ${navWidthClass}`}>
          {content.menu.map((item, i) => {
            const isHover = hoverKey === item.key;
            const circleSize = isHover ? 40 : 26;
            return (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => {
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

        {!isActive && (
          <div className="flex flex-1 items-center justify-center md:max-w-[440px]">
            <div className="aspect-square w-full overflow-hidden">
              <AnimatePresence mode="wait">
                {hovered && (
                  <motion.div
                    key={hovered.key}
                    className="h-full w-full bg-cover bg-top"
                    style={{ backgroundImage: `url(${hovered.image})` }}
                    initial={{ opacity: 0, scale: 0.6, rotate: -16, filter: "grayscale(1)" }}
                    animate={{ opacity: 1, scale: 1, rotate: 0, filter: "grayscale(0)" }}
                    exit={{ opacity: 0, scale: 0.6, rotate: -16, filter: "grayscale(1)" }}
                    transition={{
                      opacity: { duration: 0.3, ease: "easeOut" },
                      filter: { duration: 1.2, ease: "easeOut" },
                      default: { duration: 0.75, ease: [0.34, 2.2, 0.4, 1] },
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {isActive && active && (
          <div className="flex-1 rounded-md bg-panel p-9 md:max-w-[560px]">
            <div className="mb-3.5 text-[13px] tracking-[0.5px] text-accent">{active.eyebrow}</div>
            <h2 className="m-0 mb-4 font-rubik text-[22px] font-medium">{active.title}</h2>
            <p className="m-0 mb-6 text-[16px] leading-[1.7] text-text-body">{active.body}</p>
            <Link href={active.href} className="text-[15px] font-semibold text-accent no-underline">
              {active.ctaLabel} {arrow}
            </Link>
          </div>
        )}
      </div>

      <div className="font-heebo">
        <Footer nameLabel={content.name} footer={content.footer} compact />
      </div>
    </div>
  );
}
