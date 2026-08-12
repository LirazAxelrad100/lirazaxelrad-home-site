import { Rubik, David_Libre, Heebo } from "next/font/google";

// Rubik's static files only start at weight 300, but the design uses 200
// for the homepage name/menu — load the variable axis so 200 is available.
export const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  weight: "variable",
  variable: "--font-rubik",
  display: "swap",
});

export const davidLibre = David_Libre({
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "700"],
  variable: "--font-david-libre",
  display: "swap",
});

export const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heebo",
  display: "swap",
});
