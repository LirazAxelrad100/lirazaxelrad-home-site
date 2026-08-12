"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

interface HeaderProps {
  name: string;
  tagline: string;
  homeHref: string;
  compact?: boolean;
  onNameClick?: () => void;
}

export function Header({ name, tagline, homeHref, compact = false, onNameClick }: HeaderProps) {
  const handleClick = onNameClick
    ? (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onNameClick();
      }
    : undefined;

  return (
    <div className={`px-[6vw] ${compact ? "pt-6" : "pt-10"}`}>
      <div className="flex flex-col gap-0">
        <Link href={homeHref} onClick={handleClick} className="text-inherit no-underline">
          <h1 className="m-0 font-rubik text-[clamp(36px,6vw,64px)] font-extralight leading-none tracking-[0.5px]">
            {name}
          </h1>
        </Link>
        <span className="text-[16px] leading-none text-text-muted-soft">{tagline}</span>
      </div>
    </div>
  );
}
