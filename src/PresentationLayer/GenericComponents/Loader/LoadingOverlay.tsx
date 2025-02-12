import { DotLoader } from "react-spinners";

const LoadingOverlay = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <DotLoader color="#008db7" loading size={60} speedMultiplier={1} />
    </div>
  );
};

export default LoadingOverlay;
