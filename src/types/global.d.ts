declare module "*.css";


// This file adds TypeScript declarations for non-TS imports (like CSS).
// Without this, VS Code/TS would throw errors such as:
// "Cannot find module './globals.css' or its corresponding type declarations."
// Next.js itself can handle CSS imports at runtime, but TypeScript needs
// this declaration so it knows `.css` files are valid modules.
