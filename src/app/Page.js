import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Lesson from "../features/Lesson";

export default function Page() {
    return (
      <Routes>
        <Route index element={<Lesson />} />
        <Route path="/bai-giang" element={<Lesson />} />
        <Route path="/bai-giang/:id" element={<Lesson />} />
      </Routes>
    );
}
