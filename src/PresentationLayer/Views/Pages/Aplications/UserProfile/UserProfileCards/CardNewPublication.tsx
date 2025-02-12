import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function CardNewPublication() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          ¿Qué estás pensando?
        </Typography>
        <Box
          sx={{
            display: "flex",
            mt: 2,
          }}
        >
          <Avatar
            src="/path/to/profile-image.jpg"
            sx={{
              width: 40,
              height: 40,
              mr: 2,
            }}
          />
          <Paper
            variant="outlined"
            sx={{
              flex: 1,
              padding: "8px 16px",
              borderRadius: "20px",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Escribe algo aquí...
            </Typography>
          </Paper>
        </Box>
        <Box
          sx={{
            display: "flex",
            mt: 2,
            justifyContent: "space-around",
          }}
        >
          <Button variant="text" color="primary">
            📹 Video en vivo
          </Button>
          <Button variant="text" color="primary">
            📷 Foto/Video
          </Button>
          <Button variant="text" color="primary">
            📌 Evento importante
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
