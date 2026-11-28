import { Github, Linkedin, Mail } from "lucide-react";

const links = [
  { label: "Email", href: "mailto:njjeffreys@gmail.com", Icon: Mail },
  { label: "GitHub", href: "https://github.com/jakejeffreys", Icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/jake-jeffreys", Icon: Linkedin },
];

export default function SiteFooter() {
  return (
    <footer
      className="mt-12 border-t"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div
        className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-center text-sm sm:flex-row sm:justify-between sm:text-left"
        style={{ color: "var(--color-text-muted)" }}
      >
        <p className="font-mono text-xs">© Jake Jeffreys</p>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1">
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
      </div>
    </footer>
  );
}
