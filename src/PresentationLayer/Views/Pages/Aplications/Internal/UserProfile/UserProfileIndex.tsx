import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";

import { useGlobalContext } from "../../../../../../Global";
import { GetGlobalCryptKeys } from "../../../../../../DataLayer/UseCases/Aplications/Internal/Initialize/InitData";
import { FragmentStorage } from "../../../../../../UtilitiesLayer/Library/FragmentStorage";
import { UserInfoBasic } from "../../../../../../DomainLayer/Models/Fragment/FragmentEntity";

import UserProfileHeader from "./UserProfileHeader";
import CardInformation from "./UserProfileCards/CardInformation";
import CardWallpapers from "./UserProfileCards/CardWallpapers";
import CardUsers from "./UserProfileCards/CardUsers";
import CardNewPublication from "./UserProfileCards/CardNewPublication";
import CardPublications from "./UserProfileCards/CardPublications";

export default function UserProfileIndex() {
  const { state } = useGlobalContext();
  const [userInfoBasic, setUserInfoBasic] = useState<UserInfoBasic>({
    Email: "",
    Doc: "",
    NickName: "",
    FirstName: "",
    LastName: "",
    Gender: "",
    PhoneNumber: "",
    Address: "",
    Profile: "",
    Verified: false,
  });

  useEffect(() => {
    setUserInfoBasic(
      new FragmentStorage().GetValueJSON(GetGlobalCryptKeys("UserInfoBasic"))
    );
  }, [state?.initDate]);

  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <UserProfileHeader
              Alias={userInfoBasic?.NickName ?? ""}
              Profile={userInfoBasic?.Profile ?? ""}
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{
            mt: 8,
          }}
        >
          <Grid
            size={{
              xs: 12,
              sm: 5,
              md: 4,
            }}
          >
            <CardInformation
              userInfoBasic={userInfoBasic}
              setUserInfoBasic={setUserInfoBasic}
            />
            <CardWallpapers />
            <CardUsers />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 7,
              md: 8,
            }}
          >
            <CardNewPublication />
            <CardPublications />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
