import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface CriteriaSaveContextType {
  onSave: (() => void) | null;
  registerSaveFunction: (fn: () => void) => void;
  unregisterSaveFunction: () => void;
}

const CriteriaSaveContext = createContext<CriteriaSaveContextType>({
  onSave: null,
  registerSaveFunction: () => {},
  unregisterSaveFunction: () => {},
});

export const useCriteriaSave = () => useContext(CriteriaSaveContext);

interface CriteriaSaveProviderProps {
  children: ReactNode;
}

export const CriteriaSaveProvider = ({
  children,
}: CriteriaSaveProviderProps) => {
  const [saveFunction, setSaveFunction] = useState<(() => void) | null>(null);

  const registerSaveFunction = useCallback((fn: () => void) => {
    console.log("🔧 [CriteriaSaveProvider] Registering save function");
    setSaveFunction(() => fn);
  }, []);

  const unregisterSaveFunction = useCallback(() => {
    console.log("🧹 [CriteriaSaveProvider] Unregistering save function");
    setSaveFunction(null);
  }, []);

  return (
    <CriteriaSaveContext.Provider
      value={{
        onSave: saveFunction,
        registerSaveFunction,
        unregisterSaveFunction,
      }}
    >
      {children}
    </CriteriaSaveContext.Provider>
  );
};
