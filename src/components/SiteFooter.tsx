import { Github, Linkedin, Mail } from "lucide-react";

const links = [
  { label: "Email", href: "mailto:njjeffreys@gmail.com", Icon: Mail },
  { label: "GitHub", href: "https://github.com/jakejeffreys", Icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/jake-jeffreys", Icon: Linkedin },
];

export default function SiteFooter() {
  return (
    <footer className="relative mt-12 pt-10">
      {/* Torn top edge, as if the page were pulled from a pad */}
      <svg
        className="absolute left-0 top-0 block w-full"
        height="10"
        viewBox="0 0 400 10"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 6 Q 10 2, 20 5 T 40 5 T 60 3 T 80 7 T 100 5 T 120 2 T 140 6 T 160 7 T 180 3 T 200 5 T 220 6 T 240 2 T 260 7 T 280 5 T 300 3 T 320 6 T 340 4 T 360 6 T 380 3 T 400 5 L 400 10 L 0 10 Z"
          fill="var(--color-surface-2)"
        />
        <path
          d="M0 6 Q 10 2, 20 5 T 40 5 T 60 3 T 80 7 T 100 5 T 120 2 T 140 6 T 160 7 T 180 3 T 200 5 T 220 6 T 240 2 T 260 7 T 280 5 T 300 3 T 320 6 T 340 4 T 360 6 T 380 3 T 400 5"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
      </svg>

      <div
        className="flex flex-col items-center gap-5 px-6 py-10 text-center text-sm"
        style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}
      >
        <p style={{ fontFamily: "var(--font-hand)", fontSize: "1.6rem", color: "var(--color-text)" }}>
          say hi
        </p>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {links.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                className="inline-flex min-h-11 items-center gap-2 underline-offset-4 hover:underline"
                style={{ color: "var(--color-text)" }}
              >
                <Icon className="h-4 w-4" style={{ color: "var(--color-accent-ink)" }} aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p style={{ color: "var(--color-text-muted)" }}>
          Drawn &amp; built by{" "}
          <span
            style={{
              fontFamily: "var(--font-hand)",
              color: "var(--color-accent-ink)",
              fontSize: "1.3rem",
            }}
          >
            Jake Jeffreys
          </span>
        </p>
      </div>
    </footer>
  );
}
