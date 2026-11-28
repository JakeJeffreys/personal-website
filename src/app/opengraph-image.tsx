import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jake Jeffreys — Senior Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// OG images render outside the page's CSS, so these mirror the dark theme tokens in globals.css.
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
          background: "#09090b",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: "78px", fontWeight: "bold", color: "#fafafa", lineHeight: "1.1" }}>
            Jake Jeffreys
          </div>
          <div style={{ fontSize: "32px", color: "#60a5fa" }}>
            Senior Software Engineer
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
            {["Backend", "AWS", "Denver, CO"].map((tag) => (
              <div
                key={tag}
                style={{
                  background: "#131316",
                  color: "#b4b4bd",
                  border: "1px solid #2e2e34",
                  fontSize: "22px",
                  padding: "8px 20px",
                  borderRadius: "6px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "80px",
            fontSize: "22px",
            color: "#9a9aa4",
          }}
        >
          jakejeffreys.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
