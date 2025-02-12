import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { AssideDashBoard } from "./AssideDashBoard";
import { LogoDashBoard } from "./LogoDashBoard";
import { SearchDashBoard } from "./SearchDashBoard";
import { ContentAppDashBoard } from "./ContentAppDashBoard";
import { RightNavDashBoard } from "./RightNavDashBoard/RightNavDashBoard";
import { BodyBaseDashBoard } from "./BodyBaseDashBoard";

export default function DashBoardIndex({ children }: any) {
  return (
    <>
      <AppBar position="absolute">
        <Toolbar sx={{ my: 0.5 }}>
          <AssideDashBoard />
          <LogoDashBoard />
          <SearchDashBoard />
          {/* <ContentAppDashBoard /> */}
          <Box sx={{ flexGrow: 1 }} />
          <RightNavDashBoard />
        </Toolbar>
      </AppBar>
      <BodyBaseDashBoard>{children}</BodyBaseDashBoard>
    </>
  );
}
