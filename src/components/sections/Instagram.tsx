"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "behold-widget": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "feed-id"?: string;
      };
    }
  }
}

function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  };
}

const WIDGET_ID = process.env.NEXT_PUBLIC_BEHOLD_WIDGET_ID;

export default function Instagram() {
  useEffect(() => {
    if (!WIDGET_ID) return;
    if (document.querySelector('script[src*="behold.so"]')) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = `https://w.behold.so/widget.js`;
    document.head.appendChild(script);
  }, []);

  if (!WIDGET_ID) return null;

  return (
    <section id="instagram" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-12" {...fadeUpProps(0)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-sky-400" />
            <span className="text-sky-400 text-sm font-mono tracking-widest uppercase">
              Instagram
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            On Instagram
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
            Life outside the terminal.
          </p>
        </motion.div>

        <motion.div {...fadeUpProps(0.1)}>
          <behold-widget feed-id={WIDGET_ID} />
        </motion.div>
      </div>
    </section>
  );
}
