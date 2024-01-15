import TailwindForms from "@tailwindcss/forms";
import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  plugins: [
    TailwindForms,
  ],
} satisfies Config;
