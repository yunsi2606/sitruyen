
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "#141414",
                surface: "#1f1f1f",
                foreground: "#ffffff",
                muted: "#9aa4ad",
                border: "#2C2C2C",
                primary: "#FF6F61", // accent
                secondary: "#355C7D", // accent-2
                accent: "#FF6F61",
                "accent-2": "#355C7D",
                card: "#1f1f1f",
                "card-foreground": "#ffffff",
            },
            spacing: {
                18: "4.5rem", // 72px
            },
            maxWidth: {
                container: "1280px",
            }
        },
    },
    plugins: [],
};
export default config;
