import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import { Crypt0 } from "./UtilitiesLayer/Library/C1p70";
import { OneValue } from "./DomainLayer/Models/Fragment/FragmentEntity";
import { FragmentStorage } from "./UtilitiesLayer/Library/FragmentStorage";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import { darkTheme, lightTheme } from "./UITheme";
import { useGlobalContext } from "./Global";
import { AuthUseCase } from "./DataLayer/UseCases/Authorization/AuthUseCase";

import AlertComponent from "./PresentationLayer/GenericComponents/Alerts/AlertComponent";
import Main from "./PresentationLayer/Main";
import InitUseCase from "./DataLayer/UseCases/Initialize/InitUseCase";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  //===============================================================
  // MATERIAL UI THEME
  //===============================================================

  const { dispatch } = useGlobalContext();
  const { state } = useGlobalContext();
  const [mode, setMode] = useState(
    state?.mode === "dark" ? darkTheme : lightTheme
  );

  useEffect(() => {
    setMode(state?.mode === "dark" ? darkTheme : lightTheme);
  }, [state?.mode]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("lSt") || "false")) {
      const storageTheme: OneValue = new FragmentStorage().GetValueJSON(
        Crypt0.C1pt0ToHex("Theme")
      );

      if (storageTheme.Value) {
        setMode(darkTheme);
      } else {
        setMode(lightTheme);
      }

      dispatch({
        type: "UPDATE_STATE",
        payload: { mode: storageTheme.Value ? "dark" : "light" },
      });
    }
  }, []);

  //===============================================================
  // VALIDAR SESION
  //===============================================================

  const [validSession, setValidSession] = useState(
    new AuthUseCase().ValidateLocalStorage()
  );

  useEffect(() => {
    const ValidateAuth = async () => {
      try {
        if ((await new AuthUseCase().OnStateAuth()).success) {
          setValidSession(true);

          if ((await new InitUseCase().Inicializate()).success) {
            dispatch({
              type: "UPDATE_STATE",
              payload: { initDate: new Date().toISOString() },
            });
          } else {
            dispatch({
              type: "RESET_STATE",
            });
          }
        } else {
          setValidSession(false);

          dispatch({
            type: "RESET_STATE",
          });
        }
      } catch (e: any) {
        AlertComponent("error", e.message);
        setValidSession(false);
      }
    };

    ValidateAuth();
  }, [state?.loginDate]);

  return (
    <>
      <ThemeProvider theme={mode}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <BrowserRouter>
            <Main validSession={validSession} />
          </BrowserRouter>
          <ToastContainer />
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;
