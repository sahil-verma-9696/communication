import Context from "./_context";
import Page from "./page";
import useMain from "./useMain";

export default function Provider() {
  return (
    <Context.Provider value={useMain()}>
      <Page />;
    </Context.Provider>
  );
}
