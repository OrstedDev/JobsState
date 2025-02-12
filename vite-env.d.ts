// /// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_REACT_APP_FIREBASE: string;
    // VITE_REACT_APP_BASE: string;
    // VITE_REACT_APP_CPRT: string;
    // VITE_REACT_APP_KPRT: string;
    // VITE_REACT_APP_KIVT: string;

    VITE_REACT_APP_CONFIG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
