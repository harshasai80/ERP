import React, { useState, useEffect, useCallback } from "react";
import Alert from "./Alert";
import Api from "../../Api";
import HourDropdown from "./HourDropDown";

function AttendanceTab({ faculty }) {
  const isHOD = faculty?.role?.toUpperCase() === "HOD" || faculty?.role?.toUpperCase() === "PRINCIPAL" || faculty?.role?.toUpperCase() === "ADMIN";
  const facultyDept = faculty?.department?.toUpperCase() || "";

  const [department, setDepartment] = useState(isHOD ? (facultyDept === "ALL" ? "DCS" : facultyDept) : (facultyDept || "DCS"));
  const [semester, setSemester] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [section, setSection] = useState("");
  const [batch, setBatch] = useState("");
  const [subjectType, setSubjectType] = useState("");
  const [availableBatches, setAvailableBatches] = useState([]);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [students, setStudents] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const fetchSubjects = useCallback(async () => {
    try {
      const isHOD = faculty?.role?.toUpperCase() === "HOD" || faculty?.role?.toUpperCase() === "PRINCIPAL" || faculty?.role?.toUpperCase() === "ADMIN";
      
      // If we have department and semester, we can fetch the full subject list for that selection
      if (department && semester) {
        let allSubjectsData = [];
        try {
          // Fetch main department subjects
          const mainResp = await Api.get(`/subjects/department/${department}/semester/${semester}`);
          allSubjectsData = mainResp.data?.data || [];

          // Also fetch COMMON subjects for that semester if current dept isn't COMMON
          if (department?.toUpperCase() !== "COMMON") {
            try {
              const commonResp = await Api.get(`/subjects/department/COMMON/semester/${semester}`);
              const commonData = commonResp.data?.data || [];
              commonData.forEach(s => {
                if (!allSubjectsData.some(existing => existing.subjectId === s.subjectId)) {
                  allSubjectsData.push(s);
                }
              });
            } catch (e) {
              console.log("No COMMON subjects found");
            }
          }
        } catch (error) {
          console.error("Error fetching departmental subjects:", error);
        }

        // Format these as subjects matching the application structure
        const subjectsFormatted = allSubjectsData.map(s => ({
          id: s.subjectId,
          subject: s,
          section: section || "A",
          subjectType: "THEORY",
          batches: []
        }));

        // For Faculty, we also want to fetch their SPECIFIC assignments if they exist
        // to possibly override or add to the list with correct section/type info
        if (!isHOD && faculty?.id) {
          try {
            const facultyResp = await Api.get(`/subjects/all?facultyId=${faculty.id}`);
            const assignedData = facultyResp.data?.data || [];
            
            // Filter assigned data by current sem/dept
            const filteredAssignments = assignedData.filter(item => {
              const sub = item.subject || item;
              if (!sub) return false;
              const semMatch = semester ? String(sub.semester) === String(semester) : true;
              const deptMatch = department ? (sub.department?.toUpperCase() === department.toUpperCase() || sub.department?.toUpperCase() === "COMMON") : true;
              return semMatch && deptMatch;
            });

            // Merge assigned subjects into the list, or just use assigned if preferred.
            // For now, let's merge them so they see EVERYTHING in the dept, but their assignments are included.
            const merged = [...subjectsFormatted];
            filteredAssignments.forEach(assignment => {
              // If an assignment exists for a subject already in the list, replace it with the assignment (which has section/type info)
              const existingIdx = merged.findIndex(m => m.subject.subjectId === (assignment.subject?.subjectId || assignment.subjectId));
              if (existingIdx !== -1) {
                // If it's the same subject, prefer the assignment record as it has section info
                // However, we want to allow multiple sections, so maybe don't replace if sections differ
                if (merged[existingIdx].section === assignment.section) {
                   merged[existingIdx] = assignment;
                } else {
                   merged.push(assignment);
                }
              } else {
                merged.push(assignment);
              }
            });
            setSubjects(merged);
          } catch (e) {
            console.error("Error fetching faculty assignments:", e);
            setSubjects(subjectsFormatted);
          }
        } else {
          setSubjects(subjectsFormatted);
        }
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setSubjects([]);

      // Don't show scary alert for "not found" which might just mean empty list
      if (error.response?.status === 404) {
        console.log("No subjects found for current selection (404)");
      } else {
        showAlert(`Failed to load subjects: ${error.response?.data?.message || error.message}`, "error");
      }
    }
  }, [faculty?.id, faculty?.role, semester, department, section]);

  useEffect(() => {
    if (isHOD) {
      if (department && semester) {
        fetchSubjects();
      } else {
        setSubjects([]);
      }
    } else {
      // For faculty, we fetch on mount or when filters change (filters are optional)
      fetchSubjects();
    }
  }, [department, semester, section, isHOD, fetchSubjects]);

  const fetchStudents = useCallback(async (selectedBatch = null) => {
    try {
      const selectedSubject = subjects.find(
        (s) => s.id.toString() === subjectId
      );
      if (!selectedSubject) return;

      // Use values from state as the primary source of truth
      const targetDept = department || (selectedSubject.subject?.department === "COMMON" ? (faculty?.department || "DCS") : selectedSubject.subject?.department);
      const targetSem = semester || selectedSubject.subject?.semester;
      const targetSection = section || selectedSubject.section;

      let url = `/student/all?department=${targetDept}&semester=${targetSem}&section=${targetSection || ""}`;
      if (selectedBatch) {
        const [startRegNo, endRegNo] = selectedBatch.split(",");
        if (startRegNo && endRegNo) {
          url += `&startRegNo=${startRegNo}&endRegNo=${endRegNo}`;
        }
      }

      const response = await Api.get(url);
      const data = response.data?.data || [];
      setStudents(data);
      setAbsentStudents([]);
    } catch (error) {
      console.error("Fetch students failed", error);
      setStudents([]);
      showAlert("Failed to load students", "error");
    }
  }, [subjectId, subjects, department, semester, section, faculty?.department]);

  useEffect(() => {
    if (subjectId) {
      const selected = subjects.find((s) => s.id.toString() === subjectId);
      if (selected) {
        setSubjectType(selected.subjectType);
        setAvailableBatches(selected.batches || []);

        // Auto-update filters for Faculty to match the subject ONLY if they are not already set/differ
        if (!isHOD) {
          if (selected.subject?.semester && String(semester) !== String(selected.subject.semester)) {
            setSemester(selected.subject.semester.toString());
          }
          if (selected.section && section !== selected.section && !section) {
            setSection(selected.section);
          }
          if (!department && selected.subject?.department) {
            const subDept = selected.subject.department?.toUpperCase();
            setDepartment(subDept === "COMMON" ? (faculty?.department?.toUpperCase() || "DCS") : subDept);
          }
        }

        if (selected.subjectType === "LAB" && selected.batches?.length === 0) {
          showAlert("No batches assigned for selected lab subject", "error");
        } else if (selected.subjectType !== "LAB") {
          // Auto-load students for THEORY subjects immediately when subject or section changes
          fetchStudents();
        }
      }
    }
  }, [subjectId, subjects, isHOD, faculty?.department, section, fetchStudents]);

  const handleAttendanceChange = (e, rollNo) => {
    if (e.target.checked) {
      setAbsentStudents((prev) => [...prev, rollNo]);
    } else {
      setAbsentStudents((prev) => prev.filter((id) => id !== rollNo));
    }
  };

  const predefinedSessions = [
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "12:00" },
    { start: "12:00", end: "13:00" },
    { start: "13:00", end: "14:00" },
    { start: "14:00", end: "15:00" },
    { start: "15:00", end: "16:00" },
    { start: "16:00", end: "17:00" },
  ];

  const collegeEndTimes = {
    1: "16:00",
    2: "17:00",
    3: "17:00",
    4: "17:00",
    5: "17:00",
    6: "17:00",
  };

  const loadAttendance = async () => {
    if (!date || !startTime || !endTime || !subjectId || students.length === 0) {
      showAlert("Please load students and select date/time first", "error");
      return;
    }

    const selectedSubject = subjects.find((s) => s.id.toString() === subjectId);
    if (!selectedSubject) return;

    const selectedStartTime = new Date(`${date}T${startTime}`);
    const selectedEndTime = new Date(`${date}T${endTime}`);
    const collegeEndTime = collegeEndTimes[semester];

    let selectedSessionNums = [];
    predefinedSessions.forEach((session, index) => {
      const sessionStart = new Date(`${date}T${session.start}`);
      const sessionEnd = new Date(`${date}T${session.end}`);
      if (collegeEndTime && sessionEnd > new Date(`${date}T${collegeEndTime}`)) return;
      if (sessionStart >= selectedStartTime && sessionEnd <= selectedEndTime) {
        selectedSessionNums.push(index + 1);
      }
    });

    try {
      const regNos = students.map(s => s.registrationNumber);
      const response = await Api.post(`/students/bulk-date-attendance?date=${date}`, regNos);
      const attendanceRecords = response.data?.data || [];

      const newAbsentStudents = [];
      attendanceRecords.forEach(record => {
        try {
          const sessions = JSON.parse(record.sessions || "[]");
          const isAbsent = sessions.some(s =>
            selectedSessionNums.includes(s.session) &&
            s.subjectId === selectedSubject.subject.subjectId &&
            s.status === "absent"
          );
          if (isAbsent) {
            newAbsentStudents.push(record.student.registrationNumber);
          }
        } catch (e) {
          console.error("Error parsing sessions for record", record);
        }
      });

      setAbsentStudents(newAbsentStudents);
      showAlert(`Loaded existing attendance. ${newAbsentStudents.length} students were absent.`, "success");
    } catch (error) {
      console.error("Load attendance failed", error);
      if (error.response?.status === 404) {
        showAlert("No attendance records found for this date", "info");
      } else {
        showAlert("Failed to load attendance records", "error");
      }
    }
  };

  const saveAttendance = async () => {
    if (!date || !startTime || !endTime || !semester || !subjectId) {
      showAlert("Please fill all fields", "error");
      return;
    }

    const selectedSubject = subjects.find((s) => s.id.toString() === subjectId);
    if (!selectedSubject) {
      showAlert("Invalid subject selected", "error");
      return;
    }

    const selectedStartTime = new Date(`${date}T${startTime}`);
    const selectedEndTime = new Date(`${date}T${endTime}`);
    const collegeEndTime = collegeEndTimes[semester];

    let selectedSessions = [];

    predefinedSessions.forEach((session, index) => {
      const sessionStart = new Date(`${date}T${session.start}`);
      const sessionEnd = new Date(`${date}T${session.end}`);

      if (collegeEndTime && sessionEnd > new Date(`${date}T${collegeEndTime}`))
        return;

      if (sessionStart >= selectedStartTime && sessionEnd <= selectedEndTime) {
        selectedSessions.push({
          session: index + 1,
          start: session.start,
          end: session.end,
        });
      }
    });

    const attendanceData = students.map((student) => {
      const sessions = selectedSessions.map((session) => ({
        session: session.session,
        status: absentStudents.includes(student.registrationNumber)
          ? "absent"
          : "present",
      }));

      return {
        registrationNumber: student.registrationNumber,
        date,
        semester: semester,
        subjectId: selectedSubject.subject.subjectId,
        section: faculty?.role?.toUpperCase() === "HOD" ? section : selectedSubject.section,
        batch: selectedSubject.subjectType === "LAB" ? batch : null,
        sessions,
      };
    });

    try {
      await Api.post("/students/add-attendance", attendanceData);
      showAlert("Attendance saved successfully!", "success");
    } catch (error) {
      let message;
      if (error.response?.status === 403) {
        message = "Duplicate entry found. Failed to save attendance";
      } else {
        message = "Failed to save attendance";
      }
      showAlert(message, "error");
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  // Toggle all students present/absent
  const toggleAllStudents = () => {
    if (absentStudents.length === students.length) {
      setAbsentStudents([]);
    } else {
      setAbsentStudents(students.map(s => s.registrationNumber));
    }
  };

  return (
    <div className="bg-gray-800 p-3 sm:p-6 rounded-md shadow-md mt-5 text-white max-w-full">
      {/* Header */}
      <h2 className="text-base sm:text-base md:text-2xl font-bold mb-4 text-emerald-400 text-center sm:text-left">
        Mark Student Attendance
      </h2>

      {/* Filters Section */}
      <div className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Department */}
          <div className="w-full">
            <label className="block text-base font-black text-gray-300 mb-1 uppercase tracking-widest">
              Department:
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={faculty?.department && faculty?.department !== "ALL" && (isHOD || faculty?.role?.toUpperCase() === "FACULTY")}
              className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-base sm:text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="">Select Department</option>
              <option value="DCS">DCS</option>
              <option value="DEEE">DEEE</option>
              <option value="DME">DME</option>
              <option value="DMT">DMT</option>
              <option value="DCE">DCE</option>
            </select>
          </div>

          {/* Semester */}
          <div className="w-full">
            <label className="block text-base font-black text-gray-300 mb-1 uppercase tracking-widest">
              Semester:
            </label>
            <select
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
              }}
              className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-base sm:text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option value="">Select Semester</option>
              {[...Array(6)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{`${i + 1}`}</option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div className="w-full">
            <label className="block text-base font-black text-gray-300 mb-1 uppercase tracking-widest">
              Section:
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-base sm:text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option value="">Select Section</option>
              {["A", "B", "C", "D"].map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="w-full sm:col-span-2 lg:col-span-1">
            <label className="block text-base font-black text-gray-300 mb-1 uppercase tracking-widest">
              Subject:
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-base sm:text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option value="">Select Subject</option>
              {subjects.map((s) => {
                const sub = s.subject || s;
                const name = sub?.subjectName || "Unknown Subject";
                const code = sub?.subjectCode || "N/A";
                const sec = s.section || "N/A";
                return (
                  <option key={s.id || sub?.subjectId} value={s.id || sub?.subjectId}>
                    {name} ({code}) - Sec {sec}
                    {s.subjectType === "LAB" && s.batches?.length > 0
                      ? ` - Batches ${s.batches.length}`
                      : ""}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Batch (only for LAB subjects) */}
          {subjectType === "LAB" && (
            <div className="w-full sm:col-span-2 lg:col-span-3">
              <label className="block text-base sm:text-base text-gray-300 mb-1">
                Batch:
              </label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-base sm:text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option value="">Select Batch</option>
                {availableBatches.map((b) => (
                  <option key={b} value={b}>
                    {b[0]} ({b[1]} - {b[2]})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Date and Time Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Date */}
          <div className="w-full">
            <label className="block mb-1 text-base sm:text-base text-white">
              Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full p-2 sm:p-2.5 border border-emerald-500 rounded bg-gray-700 text-white text-base sm:text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Start Time */}
          <div className="w-full">
            <HourDropdown
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              startTime={null}
              isEndTime={false}
              semester={semester}
            />
          </div>

          {/* End Time */}
          <div className="w-full sm:col-span-2 lg:col-span-1">
            <HourDropdown
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              startTime={startTime}
              isEndTime={true}
              semester={semester}
            />
          </div>
        </div>
      </div>

      {/* Students Section */}
      {students.length > 0 && (
        <div className="mb-6">
          {/* Header with bulk actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h3 className="text-base font-semibold text-emerald-400">
              Students ({students.length})
            </h3>
            <div className="flex gap-3 items-center">
              <button
                onClick={toggleAllStudents}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white transition-colors text-base">
                {absentStudents.length === students.length ? "Mark All Present" : "Mark All Absent"}
              </button>
              <div className="text-base text-gray-300 font-bold">
                Present: <span className="text-emerald-400 font-black">{students.length - absentStudents.length}</span> |
                Absent: <span className="text-red-400 font-black">{absentStudents.length}</span>
              </div>
            </div>
          </div>

          {/* Professional Student Attendance Table */}
          <div className="overflow-x-auto border border-gray-700 shadow-2xl">
            <table className="w-full text-left border-collapse bg-gray-900/50 backdrop-blur-sm">
              <thead>
                <tr className="bg-academic text-white border-b-2 border-gold">
                  <th className="px-6 py-4 text-base font-black uppercase tracking-widest text-center w-20">S.No</th>
                  <th className="px-6 py-4 text-base font-black uppercase tracking-widest">Registration ID</th>
                  <th className="px-6 py-4 text-base font-black uppercase tracking-widest">Student Name</th>
                  <th className="px-6 py-4 text-base font-black uppercase tracking-widest text-center w-40">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {students.map((student, index) => {
                  const isAbsent = absentStudents.includes(student.registrationNumber);
                  return (
                    <tr
                      key={student.registrationNumber}
                      onClick={() => handleAttendanceChange({ target: { checked: !isAbsent } }, student.registrationNumber)}
                      className={`group transition-all duration-200 cursor-pointer ${isAbsent
                        ? "bg-red-950/40 hover:bg-red-900/60"
                        : "bg-transparent hover:bg-emerald-950/20"
                        }`}
                    >
                      <td className="px-6 py-5 text-center text-base font-bold text-gray-400 group-hover:text-white">
                        {index + 1}
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-base font-black font-mono tracking-wider text-emerald-400 group-hover:text-emerald-300">
                          {student.registrationNumber}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-base font-black uppercase tracking-tight text-white/90 group-hover:text-white">
                          {student.name}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className={`mx-auto inline-flex items-center px-4 py-1.5 rounded-full text-base font-black uppercase tracking-[0.15em] transition-all border ${isAbsent
                          ? "bg-red-600/20 border-red-500 text-red-400 group-hover:bg-red-600 group-hover:text-white"
                          : "bg-emerald-600/20 border-emerald-500 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white"
                          }`}>
                          {isAbsent ? (
                            <span className="flex items-center gap-2">
                              <span className="text-lg">✖</span> Absent
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <span className="text-lg">✔</span> Present
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {
            fetchStudents(subjectType === "LAB" ? batch : null);
            setAbsentStudents([]); // Clear current absent state when loading a fresh student list
          }}
          disabled={!department || !semester || !subjectId}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl transition-all text-base font-black uppercase tracking-widest shadow-lg active:scale-95">
          Load Students
        </button>

        <button
          onClick={loadAttendance}
          disabled={students.length === 0 || !date || !startTime || !endTime}
          className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl transition-all text-base font-black uppercase tracking-widest shadow-lg active:scale-95">
          Edit Attendance
        </button>

        <button
          onClick={saveAttendance}
          disabled={students.length === 0}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl transition-all text-base font-black uppercase tracking-widest shadow-lg active:scale-95">
          Save Attendance
        </button>
      </div>

      {/* Alert */}
      {alert.show && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default AttendanceTab;




