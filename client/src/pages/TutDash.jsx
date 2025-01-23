import React, { useState } from "react";
import { UserData } from "../context/UserContext"
import TutSideBar from "../components/TutSideBar";
import Calendar from "../components/Calendar";
import PomodoroTimer from "../components/PomodoroTimer";
import Schedule from "../pages/Schedule";
import Todo from "../components/Todo";
import Stats from "../components/Stats"
import Profile from "../pages/Profile";
import AdminDashboard from "../components/Admin/AdminDashboard";
import Dictionary from "../components/Dictionary"
import Courses from "@/components/Courses/Courses";
import AdminCourses from "@/components/Admin/AdminCourses";
import AddQuiz from "./AddQuiz";
import Lecture from "../components/Courses/Lecture"
import StatusBar from "@/components/StatusBar";

const TutDashboard = () => {
  const [tabContent, setTabContent] = useState('TutDashboard');
  const { user } = UserData();

  return (
    <div className="flex h-screen bg-gray-100">
      <TutSideBar setTabContent={setTabContent} />

      <div className="flex-1 overflow-auto">
        {tabContent === "TutDashboard" && (
          <div className="p-6 grid grid-cols-2 gap-6">
            {/* Top Row */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 h-[400px]">
                <Calendar />
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 h-[400px]">
                <StatusBar />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <AdminDashboard />
              </div>
            </div>


            {/* Middle Row */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <Todo />
              </div>
            </div>

            {/* <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <div className="bg-white rounded-lg shadow-md p-4 h-[300px]">
                <Dictionary />
              </div>
            </div> */}

          </div>
        )}

        {tabContent === "timer" && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <PomodoroTimer />
            </div>
          </div>
        )}

        {tabContent === "schedule" && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <Schedule />
            </div>
          </div>
        )}

        {tabContent === "Courses" && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <Courses setTabContent={setTabContent} />
            </div>
          </div>
        )}

        {tabContent === "Profile" && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <Profile />
            </div>
          </div>
        )}

        {tabContent === "UploadNew" && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <AdminCourses />
            </div>
          </div>
        )}

        {tabContent === "AddQuiz" && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <AddQuiz />
            </div>
          </div>
        )}

        {tabContent === "Lecture" && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <Lecture user={user} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutDashboard;
