import { useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import particlesOptions from "./ParticlesOptions.json";
const ParticlesOp: any = particlesOptions;

export default function ParticlesContent({ children }: any) {
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: any) => {
    await container;
  }, []);

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={ParticlesOp}
      />
      {children}
    </>
  );
}
