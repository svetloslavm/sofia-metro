import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MetroMap } from "components";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MetroMap />
  </StrictMode>
);
