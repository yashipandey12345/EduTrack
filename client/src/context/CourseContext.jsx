import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import API from "@/services/api";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState([]);
  const [mycourse, setMyCourse] = useState([]);

  async function fetchCourses() {
    try {
      const { data } = await API.get(`/course/all`);
      setCourses(data.courses);
      
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCourse(id) {
    try {
     console.log("chla");
      const { data } = await API.get(`/course/${id}`);
      setCourse(data.course);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchMyCourse() {
    try {
      const { data } = await API.get(`/mycourse`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setMyCourse(data.courses);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchMyCourse();
  }, []);
  return (
    <CourseContext.Provider
      value={{
        courses,
        fetchCourses,
        fetchCourse,
        course,
        mycourse,
        fetchMyCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext);