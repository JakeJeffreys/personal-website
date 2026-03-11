import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import GitHubActivity from "@/components/sections/GitHubActivity";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <GitHubActivity />
        <Contact />
      </main>
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>
          Designed & built by{" "}
          <span className="font-mono text-sky-400">Jake Jeffreys</span>
          {" · "}
          <a
            href="https://github.com/jakejeffreys/personal-website"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-colors"
          >
            View source
          </a>
        </p>
      </footer>
    </>
  );
}
