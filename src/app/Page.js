import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Calendar from '../features/Calendar';
import CalendarSchool from '../features/CalendarSchool';
import CalendarTeacher from '../features/CalendarTeacher';
import Curriculum from '../features/Curriculum';
import Lesson from "../features/Lesson";
import ScheduleClass from '../features/ScheduleClass';
import ScheduleTeacher from '../features/ScheduleTeacher';
import SchoolManage from '../features/SchoolManage';
import Teacher from '../features/Teacher';
import TeacherResigns from '../features/TeacherResigns';
import ToolsEmEx from '../features/ToolsEmEx';
import ToolsTeacher from "../features/ToolsTeacher";

export default function Page() {
    return (
      <Routes>
        <Route index element={<Lesson />} />
        <Route path="/bai-giang" element={<Lesson />} />
        <Route path="/bai-giang/:id" element={<Lesson />} />
        <Route path="/truong-lop" element={<SchoolManage />} />
        <Route path="/giao-vien" element={<Teacher />} />
        <Route path="/giao-vien-xin-nghi" element={<TeacherResigns />} />
        <Route path="/khung-chuong-trinh" element={<Curriculum />} />
        <Route path="/bang-lich" element={<Calendar />} />
        <Route path="/bang-lich-truong" element={<CalendarSchool />} />
        <Route path="/bang-lich-giao-vien" element={<CalendarTeacher />} />
        <Route path="/xep-lich" element={<ScheduleClass />} />
        <Route path="/xep-lich-giao-vien" element={<ScheduleTeacher />} />
        <Route path="/giao-cu" element={<ToolsTeacher />} />
        <Route path="/giao-cu/:id" element={<ToolsTeacher />} />
        <Route path="/nhap-xuat-giao-cu" element={<ToolsEmEx />} />
        <Route path="/nhap-xuat-giao-cu/*" element={<ToolsEmEx />} />
      </Routes>
    );
}
