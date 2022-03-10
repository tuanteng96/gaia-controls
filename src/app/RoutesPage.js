import React from "react";
import { Routes, Route } from "react-router-dom";
import Page from "./Page";

export default function RoutesPage() {
  return (
    <Routes>
      <Route path="*" element={<Page />} />
    </Routes>
  );
}
