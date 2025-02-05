import { create } from "zustand";

export const useThemeStore = create((set) => ({
  // Get the theme from localStorage or default to 'light'
  theme: localStorage.getItem("chat-time") || "dark",

  // Function to set the theme
  setTheme: (theme) => {

    // Save the theme to localStorage
    localStorage.setItem("chat-time", theme);

    // Update the state
    set(() => ({ theme }));
  },
}));
