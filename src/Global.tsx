import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
} from "react";

interface GlobalState {
  [key: string]: any;
}

interface Action {
  type: string;
  payload?: any;
}

const globalReducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case "UPDATE_STATE":
      return { ...state, ...action.payload };
    case "RESET_STATE":
      return {};
    default:
      return state;
  }
};

interface GlobalContextType {
  state: GlobalState;
  dispatch: Dispatch<Action>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, {});

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext debe ser usado dentro de un GlobalProvider"
    );
  }
  return context;
};
