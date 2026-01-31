import React from "react";
import useMain from "./useMain";
/****************************************************
 * ****************** Types *************************
 *****************************************************/
export type TContext = ReturnType<typeof useMain>;

/****************************************************
 * ****************** Context ************************
 * *****************************************************/
const Context = React.createContext<TContext | null>(null);

export default Context;

export const usePageContext = () => {
  const ctx = React.useContext(Context);
  if (!ctx) throw new Error("usePageContext must be used inside SignupPage");
  return ctx;
};
