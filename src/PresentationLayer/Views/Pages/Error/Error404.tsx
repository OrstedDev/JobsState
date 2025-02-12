import { useNavigate } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Paper from "@mui/material/Paper";

export default function Error404() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          width: "100%",
          height: "400px",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: 4,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />

        <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold" }}>
          404 - Página no encontrada
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          Lo sentimos, la página que estás buscando no existe o no tienes
          acceso. Verifica con el administrador o regresa a la página de inicio.
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          size="large"
          onClick={() => {
            navigate("/");
          }}
          sx={{
            textTransform: "none",
            fontSize: "1rem",
            paddingX: 3,
          }}
        >
          Ir a Inicio
        </Button>
      </Paper>
    </Container>
  );
}
