import { Logomark } from "./logomark";
import { SocialIcon } from "./icons";

type NavItem = { label: string; href: string };
type Contact = { key: string; value: string };
type Social = { name: string; url: string };

export function Footer({
  description,
  nav,
  contacts,
  social,
  facebookGroup,
  footerLegal,
  copyrightYear,
}: {
  description: string;
  nav: NavItem[];
  contacts: Contact[];
  social: Social[];
  facebookGroup: string;
  footerLegal: string;
  copyrightYear: number;
}) {
  return (
    <footer id="partners" style={{ position: "relative", overflow: "hidden", background: "var(--deep)", color: "#F4EFFB" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px)",
            backgroundSize: "54px 54px",
            WebkitMaskImage: "radial-gradient(130% 120% at 20% 0%,#000,transparent 74%)",
            maskImage: "radial-gradient(130% 120% at 20% 0%,#000,transparent 74%)",
          }}
        />
        <div
          className="animate-floaty"
          style={{
            position: "absolute",
            top: -200,
            left: "10%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(139,92,246,.24),transparent 70%)",
            filter: "blur(40px)",
            animationDuration: "21s",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "clamp(64px,8vw,110px) 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "44px 32px" }}>
          <div style={{ gridColumn: "1/-1", maxWidth: 520 }}>
            <Logomark width={88} height={44} fill="#fff" style={{ display: "block", marginBottom: 22 }} />
            <p style={{ margin: "0 0 22px", fontSize: 15, lineHeight: 1.6, color: "#C8BAE4" }}>{description}</p>
            <div style={{ display: "flex", gap: 12 }}>
              {social.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.name}
                  className="social-dot"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid rgba(255,255,255,.18)",
                    color: "#fff",
                  }}
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <ColumnTitle>Contact</ColumnTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {contacts.map((c) => (
                <div key={c.key}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: ".08em",
                      color: "var(--purple)",
                      textTransform: "uppercase",
                      marginBottom: 5,
                    }}
                  >
                    {c.key}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: "#D9CFEC" }}>{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <ColumnTitle>Explore</ColumnTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {nav.map((link) => (
                <a key={link.href} href={link.href} className="footer-link" style={{ textDecoration: "none", color: "#D9CFEC", fontSize: 14 }}>
                  {link.label}
                </a>
              ))}
              <a href={facebookGroup} target="_blank" rel="noopener" className="footer-link" style={{ textDecoration: "none", color: "#D9CFEC", fontSize: 14 }}>
                Facebook Group
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,.12)",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#9C8CBE" }}>{footerLegal}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#9C8CBE" }}>© {copyrightYear} Bicol IT</span>
        </div>
      </div>
    </footer>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        letterSpacing: ".14em",
        textTransform: "uppercase",
        color: "var(--cyan)",
        marginBottom: 18,
      }}
    >
      {children}
    </div>
  );
}
