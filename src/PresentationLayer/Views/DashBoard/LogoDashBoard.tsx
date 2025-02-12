import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import AdbIcon from "@mui/icons-material/Adb";

export const LogoDashBoard = () => {
  const navigate = useNavigate();
  return (
    <>
      <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
      <Typography
        onClick={(e) => {
          navigate("/");
        }}
        variant="h6"
        noWrap
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".3rem",
          color: "inherit",
          textDecoration: "none",
          userSelect: "none",
          cursor: "pointer",
        }}
      >
        ORSTED DEV
      </Typography>
    </>
  );
};
