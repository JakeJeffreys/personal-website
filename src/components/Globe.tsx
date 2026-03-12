import dynamic from "next/dynamic";

const GlobeScene = dynamic(() => import("./GlobeScene"), {
  ssr: false,
  loading: () => (
    <div
      className="w-[220px] h-[220px] rounded-full"
      style={{ background: "radial-gradient(circle at 38% 35%, #0f1f3d, #070c18)" }}
    />
  ),
});

export default function Globe() {
  return <GlobeScene />;
}
