import localFont from "next/font/local";

export const neuePlakExtended = localFont({
  src: [
    {
      path: "./fonts/Neue-Plak-Extended-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Neue-Plak-Extended-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/Neue-Plak-Extended-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Neue-Plak-Extended-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Neue-Plak-Extended-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Neue-Plak-Extended-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Neue-Plak-Extended-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/Neue-Plak-Extended-ExtraBlack.woff2",
      weight: "950",
      style: "normal",
    },
  ],
  variable: "--font-neue-plak-extended",
  display: "swap",
});
