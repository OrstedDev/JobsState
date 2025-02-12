interface EnvConfig {
  BASE: string;
  CPRT: string;
  KPRT: string;
  KIVT: string;

  //VARIABLES
  VAR_USERS: string;
  VAR_PROFILE: string;
}

const LoadEnv = (): EnvConfig | null => {
  try {
    const env = JSON.parse(import.meta.env.VITE_REACT_APP_CONFIG) as EnvConfig;

    return env;
  } catch (error) {
    console.error("Error al parsear la configuración del entorno:", error);
    return null;
  }
};

export const ENV: EnvConfig | null = LoadEnv();
