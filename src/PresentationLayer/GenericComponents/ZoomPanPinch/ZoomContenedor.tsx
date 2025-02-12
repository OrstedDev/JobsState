import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ClearIcon from "@mui/icons-material/Clear";

export default function ZoomContenedor({
  children,
  initScale,
  initPositionX,
  initPositionY,
}: any) {
  return (
    <TransformWrapper
      initialScale={initScale}
      initialPositionX={initPositionX}
      initialPositionY={initPositionY}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <div
          style={{
            minWidth: "100vw",
            minHeight: "100vh",
          }}
        >
          <Stack direction="row" spacing={1}>
            <IconButton
              color="primary"
              aria-label="menos"
              onClick={() => zoomOut()}
            >
              <RemoveIcon />
            </IconButton>
            <IconButton
              color="primary"
              aria-label="mas"
              onClick={() => zoomIn()}
            >
              <AddIcon />
            </IconButton>

            <IconButton
              color="primary"
              aria-label="default"
              onClick={() => resetTransform()}
            >
              <ClearIcon />
            </IconButton>
          </Stack>
          <TransformComponent>
            <div
              style={{
                minWidth: "100vw",
                minHeight: "100vh",
              }}
            >
              {children}
            </div>
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
}
