import { Crypt0 } from "../../UtilitiesLayer/Library/C1p70";
import ListObject from "../../UtilitiesLayer/Structures/ListObject";

//================================================================================================
// ROUTES
//================================================================================================

import Error404 from "./Pages/Error/Error404";
import ConfigurationIndex from "./Pages/Aplications/Configuration/ConfigurationIndex";
import RestoreConfig from "./Pages/Aplications/Configuration/RestoreConfig";
import JobParserComponent from "./Pages/Aplications/ResumeBuilder/ExperienceIndex";

import UserProfileIndex from "./Pages/Aplications/UserProfile/UserProfileIndex";

//================================================================================================
// ICONS
//================================================================================================

import SettingsIcon from "@mui/icons-material/Settings";

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
    Value: <JobParserComponent />,
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
    Key: Crypt0.C1pt0("/resume-builder/experience"),
    Value: <JobParserComponent />,
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
