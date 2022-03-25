import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Calendar from '../features/Calendar';
import Curriculum from '../features/Curriculum';
import Lesson from "../features/Lesson";
import SchoolManage from '../features/SchoolManage';
import Teacher from '../features/Teacher';

export default function Page() {
    return (
      <Routes>
        <Route index element={<Lesson />} />
        <Route path="/bai-giang" element={<Lesson />} />
        <Route path="/bai-giang/:id" element={<Lesson />} />
        <Route path="/truong-lop" element={<SchoolManage />} />
        <Route path="/giao-vien" element={<Teacher />} />
        <Route path="/khung-chuong-trinh" element={<Curriculum />} />
        <Route path="/bang-lich" element={<Calendar />} />
      </Routes>
    );
}
