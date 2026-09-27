import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hey Mursal",
    short_name: "Hey Mursal",
    description: "A soft blue-and-pink pocket, just for you.",
    start_url: "/",
    display: "standalone",
    background_color: "#eef5ff",
    theme_color: "#eef5ff",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
