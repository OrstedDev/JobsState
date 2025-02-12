import { GlobalProvider } from "./Global";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import TestUseCase from "./TestLayer/TestUseCase";
TestUseCase();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </StrictMode>
);
