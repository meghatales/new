// src/components/theme/ThemeToggle.tsx
`use client`;

import * as React from "react";
import { Moon, Sun } from "lucide-react"; // Assuming lucide-react is installed or will be
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button"; // Assuming a Button component exists, or use a standard button

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full p-2"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// A basic Button component if shadcn/ui is not fully set up or desired
// If you have a ui/button.tsx from shadcn, this is not needed.
// const Button = React.forwardRef<
//   HTMLButtonElement,
//   React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }
// >(({ className, variant, size, ...props }, ref) => {
//   return (
//     <button
//       className={className} // Apply passed className for specific styling
//       ref={ref}
//       {...props}
//     />
//   );
// });
// Button.displayName = "Button";


