import { createSignal, effect } from "@epoch32/visage/signals";

export const [theme, setTheme] = createSignal<"light" | "dark">("light", {
  persist: "visage-theme"
});

export function toggleTheme() {
  setTheme((curr) => (curr === "dark" ? "light" : "dark"));
}

if (typeof document !== "undefined") {
  effect(() => {
    document.documentElement.setAttribute("data-theme", theme());
  });
}
