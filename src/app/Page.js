import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Calendar from '../features/Calendar';
import Curriculum from '../features/Curriculum';
import Lesson from "../features/Lesson";
import ScheduleClass from '../features/ScheduleClass';
import ScheduleTeacher from '../features/ScheduleTeacher';
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
        <Route path="/xep-lich" element={<ScheduleClass />} />
        <Route path="/xep-lich-giao-vien" element={<ScheduleTeacher />} />

      </Routes>
    );
}
