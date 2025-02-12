import React, { useState } from "react";
import ParticlesContent from "../../../GenericComponents/Particles/Particles";

import { Card, Grid } from "@mui/material";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";

export default function InicioLoginIndex() {
  const [currentPage, setCurrentPage] = useState(0);

  const handleSwitch = (index: any) => {
    setCurrentPage(index);
  };

  const pages = [
    <LoginPage handleSwitch={handleSwitch} />,
    <RegisterPage handleSwitch={handleSwitch} />,
  ];

  return (
    <>
      <ParticlesContent>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{ zIndex: 1, height: "80vh" }}
        >
          <Card sx={{ maxWidth: 350, margin: "30px" }}>
            {pages[currentPage]}
          </Card>
        </Grid>
      </ParticlesContent>
    </>
  );
}
