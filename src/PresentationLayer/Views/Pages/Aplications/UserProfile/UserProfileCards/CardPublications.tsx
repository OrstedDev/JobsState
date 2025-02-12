import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

export default function CardPublications() {
  return (
    <Card
      sx={{
        mt: 2,
      }}
    >
      <CardContent>
        <Typography variant="body2">
          <strong>Esc Alex</strong> actualizó su foto del perfil.
        </Typography>
        <CardMedia
          component="img"
          image="https://images6.alphacoders.com/120/1203184.jpg"
          alt="Nueva foto de perfil"
          sx={{
            mt: 2,
            borderRadius: "8px",
          }}
        />
      </CardContent>
    </Card>
  );
}
