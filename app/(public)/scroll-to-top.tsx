"use client";

import { type ReactNode } from "react";

// Komponen wrapper: scroll ke atas saat diklik
interface ScrollToTopProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollToTop({ children, className }: ScrollToTopProps) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={className}
    >
      {children}
    </button>
  );
}
