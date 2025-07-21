import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// A gimmick tp make the styles work on buttons 🤦🏾
<div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"></div>;
<div className="bg-primary text-primary-foreground shadow hover:bg-primary/90"></div>;
<div className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"></div>;
<div className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"></div>;
<div className="bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"></div>;
<div className="hover:bg-accent hover:text-accent-foreground"></div>;
<div className="text-primary underline-offset-4 hover:underline"></div>;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
