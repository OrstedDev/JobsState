import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export const ContentAppDashBoard = () => {
  const [Apps, setApps] = useState<Array<string>>([]);

  useEffect(() => {
    setApps(["INICIO", "MAPS", "SHOPPING"]);
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        {Apps.map((page) => (
          <Button key={page} sx={{ my: 2, color: "white", display: "block" }}>
            {page}
          </Button>
        ))}
      </Box>
    </>
  );
};
