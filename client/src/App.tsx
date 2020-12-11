import React from "react";
import "./App.scss";
import Overview from "./components/Overview";
import {
  Header,
  HeaderName
} from "carbon-components-react/lib/components/UIShell";

function App() {
  return (
    <div className="App" style={{ height: "100%" }}>
      <Header aria-label="CHIpotle">
      <HeaderName href="#" prefix="">
        CHIPotle
      </HeaderName>
    </Header>
      <Overview />
    </div>
  );
}

export default App;
