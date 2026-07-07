"use client";

import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import { Logomark } from "./logomark";
import { MenuIcon, MoonIcon, SunIcon } from "./icons";

type NavItem = { label: string; href: string };

const gradient = "linear-gradient(120deg,var(--purple),var(--purple2))";

// Hydration-safe "are we on the client yet" flag — avoids setState-in-effect.
const noopSubscribe = () => () => {};

export function Header({
  nav,
  membershipUrl,
}: {
  nav: NavItem[];
  membershipUrl: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "color-mix(in srgb, var(--bg) 78%, transparent)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        className="mx-auto flex max-w-[1443px] items-center justify-between gap-5 px-6 py-[14px]"
      >
        <a
          href="#home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            color: "var(--fg)",
          }}
        >
          <Logomark width={46} height={23} />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: ".02em",
            }}
          >
            BICOL&#8202;IT
          </span>
        </a>

        <nav className="hidden min-[860px]:flex" style={{ alignItems: "center", gap: 6 }}>
          {nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="site-navlink"
              style={{
                padding: "9px 14px",
                borderRadius: 999,
                textDecoration: "none",
                color: "var(--fg2)",
                fontSize: 14,
                letterSpacing: ".01em",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title="Toggle theme"
            aria-label="Toggle color theme"
            suppressHydrationWarning
            style={{
              width: 40,
              height: 40,
              display: "grid",
              placeItems: "center",
              border: "1px solid var(--line2)",
              background: "transparent",
              color: "var(--fg)",
              borderRadius: 999,
              cursor: "pointer",
            }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          <a
            href={membershipUrl}
            target="_blank"
            rel="noopener"
            className="hidden min-[860px]:inline-block"
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: ".02em",
              color: "#fff",
              background: gradient,
              boxShadow: "0 8px 24px -10px var(--purple)",
            }}
          >
            Join Us
          </a>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="grid min-[860px]:hidden"
            style={{
              width: 40,
              height: 40,
              placeItems: "center",
              border: "1px solid var(--line2)",
              background: "transparent",
              color: "var(--fg)",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="min-[860px]:hidden"
          style={{
            borderTop: "1px solid var(--line)",
            padding: "12px 24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "12px 8px",
                textDecoration: "none",
                color: "var(--fg)",
                fontSize: 16,
                borderBottom: "1px solid var(--line)",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={membershipUrl}
            target="_blank"
            rel="noopener"
            style={{
              marginTop: 10,
              textAlign: "center",
              padding: 13,
              borderRadius: 999,
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              color: "#fff",
              background: gradient,
            }}
          >
            Join Us Now
          </a>
        </div>
      )}
    </header>
  );
}
