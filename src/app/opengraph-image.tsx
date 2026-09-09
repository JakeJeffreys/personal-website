import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jake Jeffreys — Senior Platform Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#efe8db",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow blob top-right */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "340px",
            height: "340px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,85,43,0.16) 0%, transparent 70%)",
          }}
        />
        {/* Glow blob bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "120px",
            width: "440px",
            height: "220px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,85,43,0.09) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: "78px", fontWeight: "bold", color: "#2a2622", lineHeight: "1.1" }}>
            Jake Jeffreys
          </div>
          <div style={{ fontSize: "32px", color: "#c2431f" }}>
            Senior Platform Engineer
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
            {["Platform", "Cloud", "Denver, CO"].map((tag) => (
              <div
                key={tag}
                style={{
                  background: "#fbf7ef",
                  color: "#554c43",
                  border: "1px solid #c3b7a4",
                  fontSize: "22px",
                  padding: "8px 20px",
                  borderRadius: "9999px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "80px",
            fontSize: "22px",
            color: "#6b6157",
          }}
        >
          jakejeffreys.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
