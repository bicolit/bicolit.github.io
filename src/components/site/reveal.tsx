"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/* Fades + lifts its children into view once, on scroll. Reimplements the
   prototype's setupReveal() with an IntersectionObserver. Falls back to
   visible when IO is unavailable; reduced-motion is handled in globals.css. */
export function Reveal({
  children,
  className,
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-reveal className={className} style={style}>
      {children}
    </Tag>
  );
}
