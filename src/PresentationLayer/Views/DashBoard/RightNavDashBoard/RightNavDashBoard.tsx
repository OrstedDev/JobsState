import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { FullscreenButton, setFullscreen } from "./FullPageButton";
import { DarkModeButton } from "./DarkModeButton";
import { useGlobalContext } from "../../../../Global";
import AlertComponent from "../../../GenericComponents/Alerts/AlertComponent";
import { AuthUseCase } from "../../../../DataLayer/UseCases/Aplications/Internal/Authorization/AuthUseCase";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ContactsIcon from "@mui/icons-material/Contacts";
import Avatar from "@mui/material/Avatar";
import ImageManager from "../../../GenericComponents/ImageManager/ImageManager";

export const RightNavDashBoard = () => {
  const imgManager = ImageManager.getInstance();
  const navigate = useNavigate();

  const { state } = useGlobalContext();
  const { dispatch } = useGlobalContext();

  const [imgLoaded, setImgLoaded] = useState(true);
  const [imgUser, setImgUser] = useState<any>();

  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState<null | HTMLElement>(
    null
  );
  const [isMenuOpen, setIsMenuOpen] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setImgUser(imgManager.getImageByKey("ProfilePicture")?.src);
  }, [state?.loadBaseImg]);

  //=====================================================================
  // HANDLERS
  //=====================================================================

  const OpenOptionsMenuUser = (event: any) => {
    setIsMenuOpen(event.currentTarget);
  };

  const OpenMenuMobil = (event: any) => {
    setIsMenuMobileOpen(event.currentTarget);
  };

  //=====================================================================
  // METHODS
  //=====================================================================

  const LogOut = async () => {
    try {
      const objData = await new AuthUseCase().OnLogoutAuth();
      if (objData.success) {
        navigate("/");
        dispatch({
          type: "UPDATE_STATE",
          payload: { loginDate: new Date().toISOString() },
        });

        setFullscreen(false);
        imgManager.clearMemory();
      }
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
  };

  //=====================================================================
  // RENDERS
  //=====================================================================

  const renderMenu = (
    <Menu
      anchorEl={isMenuOpen}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id="primary-search-account-menu"
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(isMenuOpen)}
      onClose={() => {
        setIsMenuMobileOpen(null);
        setIsMenuOpen(null);
      }}
    >
      <MenuItem
        onClick={() => {
          navigate("/user-profile");
          setIsMenuMobileOpen(null);
          setIsMenuOpen(null);
        }}
      >
        <InsertEmoticonIcon />
        <Typography>Profile</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          setIsMenuMobileOpen(null);
          setIsMenuOpen(null);
        }}
      >
        <ContactsIcon />
        <Typography>Contactos</Typography>
      </MenuItem>
      <MenuItem onClick={LogOut} sx={{ color: "red" }}>
        <ExitToAppIcon />
        <Typography>LogOut</Typography>
      </MenuItem>
    </Menu>
  );

  const renderMenuMobile = (
    <Menu
      anchorEl={isMenuMobileOpen}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id="primary-search-account-menu-mobile"
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(isMenuMobileOpen)}
      onClose={() => {
        setIsMenuMobileOpen(null);
      }}
    >
      <MenuItem
        sx={{
          display: "flex",
          justifyContent: "center", // Centra horizontalmente
          alignItems: "center", // Centra verticalmente
          gap: 2, // Espaciado uniforme entre los botones
          padding: 0, // Elimina el padding adicional de MenuItem
          "&.MuiMenuItem-root": {
            minHeight: "auto", // Asegura que la altura se adapte al contenido
          },
          "&:hover": {
            backgroundColor: "transparent", // Sin efecto hover
          },
          "&:focus": {
            backgroundColor: "transparent", // Sin efecto de foco
          },
        }}
      >
        <FullscreenButton setIsMenuMobileOpen={setIsMenuMobileOpen} />
        <DarkModeButton />
      </MenuItem>

      <Divider />

      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>

      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>

      <Divider />

      <MenuItem onClick={OpenOptionsMenuUser}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {imgLoaded ? (
            <Avatar
              sx={{ width: 25, height: 25 }}
              alt="Remy Sharp"
              src={imgUser}
              onLoad={() => {
                setImgLoaded(true);
              }}
            />
          ) : (
            <AccountCircle />
          )}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <FullscreenButton setIsMenuMobileOpen={setIsMenuMobileOpen} />
        <DarkModeButton />

        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="success">
            <MailIcon />
          </Badge>
        </IconButton>

        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          onClick={OpenOptionsMenuUser}
          color="inherit"
        >
          {imgLoaded ? (
            <Avatar
              sx={{ width: 25, height: 25 }}
              alt="Remy Sharp"
              src={imgUser}
              onLoad={() => {
                setImgLoaded(true);
              }}
            />
          ) : (
            <AccountCircle />
          )}
        </IconButton>
      </Box>

      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <IconButton
          size="large"
          aria-label="show more"
          aria-controls="primary-search-account-menu-mobile"
          aria-haspopup="true"
          onClick={OpenMenuMobil}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
      </Box>

      {Boolean(isMenuMobileOpen) && renderMenuMobile}
      {Boolean(isMenuOpen) && renderMenu}
    </>
  );
};
