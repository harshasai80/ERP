import React, { useEffect, useState, useCallback } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import Api from "../../../Api";

const MAX_VISIBLE_STUDENTS = 100;
const MAX_VISIBLE_FACULTY = 30;
const STUDENT_SIZE = 24;
const FACULTY_SIZE = 40;
const FRAME_INTERVAL = 80;

const Dashboard = ({ department }) => {
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [displayedStudentCount, setDisplayedStudentCount] = useState(0);
  const [displayedFacultyCount, setDisplayedFacultyCount] = useState(0);
  const [entities, setEntities] = useState([]);
  const [containerWidth, setContainerWidth] = useState(1024);

  const classroomWidth = 720;
  const classroomHeight = 480;

  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) setContainerWidth(screenWidth - 40);
      else if (screenWidth < 1024) setContainerWidth(768);
      else setContainerWidth(1024);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const getRandomPosition = (width, height) => ({
    x: 30 + Math.random() * (width - 60),
    y: 30 + Math.random() * (height - 60),
  });

  const createEntity = useCallback(
    (type, data, index) => {
      const pos = getRandomPosition(
        classroomWidth,
        classroomHeight,
        type === "student" ? STUDENT_SIZE : FACULTY_SIZE
      );

      return {
        id: data.id || `${type}_${index}`,
        type,
        data,
        x: pos.x,
        y: pos.y,
        targetX: pos.x,
        targetY: pos.y,
        speed: 0.5 + Math.random() * 5,
        angle: Math.random() * Math.PI * 2,
        pauseTimer: Math.random() * 60,
        moveTimer: 0,
        size: type === "student" ? STUDENT_SIZE : FACULTY_SIZE,
      };
    },
    [classroomWidth, classroomHeight]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, facultyRes] = await Promise.all([
          Api.get("/student/department", { params: { department } }),
          Api.get("/faculty/all", { params: { department } }),
        ]);

        const studentsData = studentsRes.data.data || [];
        const facultyData =
          facultyRes.data.data.filter((f) => f.role !== "HOD") || [];

        setStudentCount(studentsData.length);
        setFacultyCount(facultyData.length);

        const visibleStudents = studentsData.slice(0, MAX_VISIBLE_STUDENTS);
        const visibleFaculty = facultyData.slice(0, MAX_VISIBLE_FACULTY);

        setStudents(visibleStudents);
        setFaculty(visibleFaculty);

        const allEntities = [
          ...visibleStudents.map((s, i) => createEntity("student", s, i)),
          ...visibleFaculty.map((f, i) => createEntity("faculty", f, i)),
        ];

        setEntities(allEntities);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [department, createEntity, setFaculty, setStudents]);

  // Inside the useEffect for counts
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedStudentCount((prev) => {
        const increment = Math.ceil(studentCount / 50); // Divide total count into ~50 steps
        return prev + increment >= studentCount
          ? studentCount
          : prev + increment;
      });

      setDisplayedFacultyCount((prev) => {
        const increment = Math.ceil(facultyCount / 50);
        return prev + increment >= facultyCount
          ? facultyCount
          : prev + increment;
      });

      setEntities((prev) =>
        prev.map((e, i) => {
          if (!e.visible) {
            if (e.type === "student" && i < displayedStudentCount)
              e.visible = true;
            if (
              e.type === "faculty" &&
              i - MAX_VISIBLE_STUDENTS < displayedFacultyCount
            )
              e.visible = true;
          }
          return { ...e };
        })
      );
    }, 30); // smaller interval for smoother animation

    return () => clearInterval(interval);
  }, [
    studentCount,
    facultyCount,
    displayedStudentCount,
    displayedFacultyCount,
  ]);

  // Movement system
  useEffect(() => {
    const moveLoop = setInterval(() => {
      setEntities((prev) =>
        prev.map((entity) => {
          if (!entity.visible) return entity;

          if (entity.pauseTimer > 0) {
            entity.pauseTimer--;
            return { ...entity };
          }

          if (entity.moveTimer <= 0) {
            entity.targetX = 30 + Math.random() * (classroomWidth - 60);
            entity.targetY = 30 + Math.random() * (classroomHeight - 60);
            entity.moveTimer = 120 + Math.random() * 180;

            if (Math.random() < 0.1) {
              entity.pauseTimer = 60 + Math.random() * 120;
            }
          }

          entity.moveTimer--;

          const dx = entity.targetX - entity.x;
          const dy = entity.targetY - entity.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 2) {
            entity.x += (dx / distance) * entity.speed;
            entity.y += (dy / distance) * entity.speed;
          }

          const margin = 15;
          entity.x = Math.max(
            margin,
            Math.min(classroomWidth - entity.size - margin, entity.x)
          );
          entity.y = Math.max(
            margin,
            Math.min(classroomHeight - entity.size - margin, entity.y)
          );

          return { ...entity };
        })
      );
    }, FRAME_INTERVAL);

    return () => clearInterval(moveLoop);
  }, []);

  const studentEntities = entities.filter(
    (e) => e.type === "student" && e.visible
  );
  const facultyEntities = entities.filter(
    (e) => e.type === "faculty" && e.visible
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center p-4 sm:p-6 lg:p-10">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 lg:mb-10 text-center">
        HOD Dashboard
      </h1>

      {/* Animated Counts */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-16 mb-6 text-center w-full max-w-lg sm:max-w-none justify-center">
        <div className="bg-gray-800 bg-opacity-60 rounded-2xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700 flex-1 sm:flex-initial shadow-lg transform hover:scale-105 transition-transform duration-200">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-400">
            {displayedStudentCount}
          </p>
          <p className="text-lg sm:text-xl mt-1 text-gray-200">Students</p>
        </div>
        <div className="bg-gray-800 bg-opacity-60 rounded-2xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700 flex-1 sm:flex-initial shadow-lg transform hover:scale-105 transition-transform duration-200">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-yellow-400">
            {displayedFacultyCount}
          </p>
          <p className="text-lg sm:text-xl mt-1 text-gray-200">Faculty</p>
        </div>
      </div>

      {/* Classroom */}
      <div
        className="relative w-full max-w-xs sm:max-w-2xl lg:max-w-5xl h-48 sm:h-64 lg:h-96 bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-700"
        style={{ width: containerWidth }}>
        {/* Students */}
        {studentEntities.map((entity) => (
          <div
            key={entity.id}
            className="absolute w-6 h-6 bg-emerald-400 rounded-full group cursor-pointer transition-all duration-200 hover:scale-110 hover:bg-emerald-300 hover:shadow-lg"
            style={{
              left: `${entity.x}px`,
              top: `${entity.y}px`,
              zIndex: 10,
            }}>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800 text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 border border-gray-600">
              {entity.data.name}
              {entity.data.registrationNumber
                ? ` (${entity.data.registrationNumber})`
                : ""}
            </div>
          </div>
        ))}

        {/* Faculty */}
        {facultyEntities.map((entity) => (
          <div
            key={entity.id}
            className="absolute w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold group cursor-pointer transition-all duration-200 hover:scale-110 hover:bg-yellow-400 hover:shadow-lg"
            style={{
              left: `${entity.x}px`,
              top: `${entity.y}px`,
              zIndex: 10,
            }}>
            <FaChalkboardTeacher />
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800 text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 border border-gray-600 text-white">
              {entity.data.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
