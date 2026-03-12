import dynamic from "next/dynamic";

const GlobeScene = dynamic(() => import("./GlobeScene"), {
  ssr: false,
  loading: () => (
    <div
      className="w-[260px] h-[260px] rounded-full"
      style={{ background: "radial-gradient(circle at 38% 35%, #0f1f3d, #070c18)" }}
    />
  ),
});

export default function Globe() {
  return <GlobeScene />;
}
