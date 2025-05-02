import Store from "./store/store";
import React,{createContext} from "react";
import { createRoot } from "react-dom/client";
import App from "./main"


interface State{
    store: Store
};

const store = new Store();

export const Context = createContext<State>(
    {store}
);
const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");

const root = createRoot(container);

root.render(
  <Context.Provider value={{ store }}>
    <App />
  </Context.Provider>
);

