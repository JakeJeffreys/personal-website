import Hero from "@/components/sections/Hero";
import FeaturedLab from "@/components/sections/FeaturedLab";
import Explore from "@/components/sections/Explore";

export default function Home() {
  return (
    <main className="site-page">
      <Hero />
      <FeaturedLab />
      <Explore />
    </main>
  );
}
