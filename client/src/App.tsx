import React from "react";
import "./App.scss";
import Overview from "./components/Overview";
import {
  Header,
  HeaderName,
} from "carbon-components-react/lib/components/UIShell";

function App() {
  return (
    <div className="App" style={{ height: "100%" }}>
      <Header aria-label="Papers101">
        <HeaderName href="#" prefix="">
          Papers101
        </HeaderName>
      </Header>
      <div style={{ height: "calc(100% - 48px)", marginTop: "48px" }}>
        <Overview />
      </div>
    </div>
  );
}

export default App;
