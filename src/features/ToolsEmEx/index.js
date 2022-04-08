import React from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import { Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home";
import Inventory from "./pages/Inventory/Inventory";

function ToolsEmEx(props) {
  return (
    <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
      <Routes>
        <Route
          index
          element={
            <Home />
          }
        />
        <Route path={`/ton-kho`} element={<Inventory />} />
      </Routes>
    </div>
  );
}

export default ToolsEmEx;
