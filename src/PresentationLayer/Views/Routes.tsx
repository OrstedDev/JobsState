import { Crypt0 } from "../../UtilitiesLayer/Library/C1p70";
import ListObject from "../../UtilitiesLayer/Structures/ListObject";

//================================================================================================
// ROUTES
//================================================================================================

import Error404 from "./Pages/Error/Error404";
import ConfigurationIndex from "./Pages/Aplications/Internal/Configuration/ConfigurationIndex";
import RestoreConfig from "./Pages/Aplications/Internal/Configuration/RestoreConfig";
import JobsIndex from "./Pages/Aplications/Example/Jobs/JobsIndex";

import UserProfileIndex from "./Pages/Aplications/Internal/UserProfile/UserProfileIndex";

//================================================================================================
// ICONS
//================================================================================================

import SettingsIcon from "@mui/icons-material/Settings";
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

const styles = {
  icon: {
    fontSize: "20px",
    paddingTop: "4px",
  },
};

//================================================================================================
// LIST
//================================================================================================

const Routers = new ListObject<{
  Key: string;
  Value: React.ReactNode;
  Icon?: React.ReactNode;
}>([
  {
    Key: Crypt0.C1pt0("/"),
    Value: <Error404 />,
  },
  {
    Key: Crypt0.C1pt0("/user-profile"),
    Value: <UserProfileIndex />,
  },
  {
    Key: Crypt0.C1pt0("/app-configuration/plataform"),
    Value: <ConfigurationIndex />,
    Icon: <SettingsIcon style={styles.icon} />,
  },
  {
    Key: Crypt0.C1pt0("/restore"),
    Value: <RestoreConfig />,
  },
  {
    Key: Crypt0.C1pt0("/example/my-jobs"),
    Value: <JobsIndex />,
    Icon: <WorkHistoryIcon style={styles.icon} />,
  },

  //================================================================================
  // INEXISTENTE
  //================================================================================

  {
    Key: Crypt0.C1pt0("*"),
    Value: <Error404 />,
  },
]);

export default Routers;
