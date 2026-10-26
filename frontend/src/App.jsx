import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Departments from "./pages/admin/Departments";
import Teachers from "./pages/admin/Teachers";
import Student from "./pages/admin/Student";
import Parents from "./pages/admin/Parents";
import Subjects from "./pages/admin/Subjects";
import Class from "./pages/admin/Class";
import Room from "./pages/admin/Room";
import TimeSlot from "./pages/admin/TimeSlot";
import AcademicCalendar from "./pages/admin/AcademicCalendar";
import Schedule from "./pages/admin/Schedule";
import Timetable from "./pages/admin/Timetable";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherLayout from "./pages/teacher/TeacherLayout";
import TeacherTimetable from "./pages/teacher/TeacherTimetable";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";
import TeacherAcademicCalendar from "./pages/teacher/TeacherAcademicCalendar";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentLayout from "./pages/student/StudentLayout";
import StudentTimetable from "./pages/student/StudentTimetable";
import StudentSubjects from "./pages/student/StudentSubjects";
import StudentCalendar from "./pages/student/StudentCalendar";
import StudentProfile from "./pages/student/StudentProfile";

import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentLayout from "./pages/parent/ParentLayout";
import ParentChild from "./pages/parent/ParentChild";
import ChildTimetable from "./pages/parent/ChildTimetable";
import ChildSubjects from "./pages/parent/ChildSubjects";
import ParentCalendar from "./pages/parent/ParentCalendar";
import ParentProfile from "./pages/parent/ParentProfile";

const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};


const getRole = () => {
  return localStorage.getItem("role");
};


const ProtectedRoute = ({ children, role }) => {

  const token = isLoggedIn();
  const userRole = getRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {

    if (userRole === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (userRole === "TEACHER") {
      return <Navigate to="/teacher/dashboard" replace />;
    }

    if (userRole === "STUDENT") {
      return <Navigate to="/student/dashboard" replace />;
    }

    if (userRole === "PARENT") {
      return <Navigate to="/parent/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout>
                <Departments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout>
                <Teachers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout>
                <Student />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/parents"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout>
                <Parents />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout>
                <Subjects />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/classes"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout>
                <Class />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout>
                <Room />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/timeslots"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout>
                <TimeSlot />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/calendar"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout>
                <AcademicCalendar />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/timetable"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout>
                <Timetable />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="TEACHER">
              <TeacherLayout>
                <TeacherDashboard />
              </TeacherLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/timetable"
          element={
            <ProtectedRoute role="TEACHER">
              <TeacherLayout>
                <TeacherTimetable />
              </TeacherLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/schedule"
          element={
            <ProtectedRoute role="TEACHER">
              <TeacherLayout>
                <TeacherSchedule />
              </TeacherLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/calendar"
          element={
            <ProtectedRoute role="TEACHER">
              <TeacherLayout>
                <TeacherAcademicCalendar />
              </TeacherLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/timetable"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentLayout>
                <StudentTimetable />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/subjects"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentLayout>
                <StudentSubjects />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/calendar"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentLayout>
                <StudentCalendar />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentLayout>
                <StudentProfile />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent/dashboard"
          element={
            <ProtectedRoute role="PARENT">
              <ParentLayout>
                <ParentDashboard />
              </ParentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent/child"
          element={
            <ProtectedRoute role="PARENT">
              <ParentLayout>
                <ParentChild />
              </ParentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent/timetable"
          element={
            <ProtectedRoute role="PARENT">
              <ParentLayout>
                <ChildTimetable />
              </ParentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent/subjects"
          element={
            <ProtectedRoute role="PARENT">
              <ParentLayout>
                <ChildSubjects />
              </ParentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent/calendar"
          element={
            <ProtectedRoute role="PARENT">
              <ParentLayout>
                <ParentCalendar />
              </ParentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent/profile"
          element={
            <ProtectedRoute role="PARENT">
              <ParentLayout>
                <ParentProfile />
              </ParentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            isLoggedIn() ? (
              getRole() === "ADMIN" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : getRole() === "TEACHER" ? (
                <Navigate to="/teacher/dashboard" replace />
              ) : getRole() === "STUDENT" ? (
                <Navigate to="/student/dashboard" replace />
              ) : getRole() === "PARENT" ? (
                <Navigate to="/parent/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;