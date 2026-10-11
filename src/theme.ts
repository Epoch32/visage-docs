import { createSignal, effect } from "@epoch32/visage";

export const [theme, setTheme] = createSignal<"light" | "dark">("light", {
  persist: "visage-theme"
});

export function toggleTheme() {
  const next = theme() === "dark" ? "light" : "dark";
  setTheme(next);
}

if (typeof document !== "undefined") {
  effect(() => {
    document.documentElement.setAttribute("data-theme", theme());
  });
}
