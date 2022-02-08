import React from "react";
import { Routes, Route } from "react-router-dom";
import Lesson from "../features/Lesson";

export default function RoutesPage() {
  return (
    <Routes>
      <Route index element={<Lesson />} />
      <Route path="/admin/r/bai-giang" element={<Lesson />} />
    </Routes>
  );
}
