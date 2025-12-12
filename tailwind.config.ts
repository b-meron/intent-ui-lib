import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./index.html", "./src/**/*.{ts,tsx}", "./DemoPage/**/*.{ts,tsx}"],
    theme: {
        extend: {}
    },
    plugins: []
};

export default config;

