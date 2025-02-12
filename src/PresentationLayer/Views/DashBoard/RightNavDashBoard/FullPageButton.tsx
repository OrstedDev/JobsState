import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

export const FullscreenButton = ({
  setIsMenuMobileOpen,
}: {
  setIsMenuMobileOpen: any;
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullScreen = () => {
    setIsMenuMobileOpen(null);

    const elem = document.documentElement;

    if (!document.fullscreenElement) {
      elem.classList.add("hide-content");
      const requestFullScreen = elem.requestFullscreen;

      if (requestFullScreen) {
        requestFullScreen.call(elem);
        setIsFullscreen(true);
      }
    } else {
      elem.classList.remove("hide-content");
      const exitFullScreen = document.exitFullscreen;

      if (exitFullScreen) {
        exitFullScreen.call(document);
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <>
      <IconButton
        size="large"
        aria-label="show 17 new notifications"
        color="inherit"
        onClick={toggleFullScreen}
      >
        <Badge badgeContent={null}>
          {isFullscreen == true ? (
            <>
              <FullscreenExitIcon />
            </>
          ) : (
            <>
              <FullscreenIcon />
            </>
          )}
        </Badge>
      </IconButton>
    </>
  );
};

export const setFullscreen = (enable: boolean) => {
  const elem = document.documentElement;
  
  if (enable) {
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error("Error al entrar en pantalla completa:", err);
      });
    }
  } else {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Error al salir de pantalla completa:", err);
      });
    }
  }
};
