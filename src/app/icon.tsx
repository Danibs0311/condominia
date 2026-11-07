import { ImageResponse } from "next/og";

export const size = {
  width: 192,
  height: 192,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 42,
          fontWeight: "bold",
        }}
      >
        🏢
      </div>
    ),
    {
      ...size,
    }
  );
}
