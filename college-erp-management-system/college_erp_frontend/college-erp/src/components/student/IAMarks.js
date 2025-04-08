import React from "react";
// import React, { useEffect, useState } from "react";
// import Api from "../../Api";
// import { useLocation } from "react-router-dom";

const IAMarks = () => {
  // const [iaMarks, setIaMarks] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

  // const location = useLocation();

  // const registrationNumber =
  //   location.state?.student?.data?.registrationNumber ||
  //   location.state?.student?.registrationNumber;

  // useEffect(() => {
  //   const fetchResults = async () => {
  //     try {
  //       const response = await Api.get(
  //         `/iamarks/student/${registrationNumber}`
  //       );
  //       const data = response.data?.data;

  //       if (!data || data.length === 0) {
  //         setError("⚠️ No results found for this student.");
  //         setLoading(false);
  //         return;
  //       }

  //       const formattedMarks = data.map((entry) => ({
  //         subjectName: entry.subject.subjectName,
  //         subjectCode: entry.subject.subjectCode,
  //         iaMarks: JSON.parse(entry.iaMarks),
  //         theoryAttendance: "85%",
  //         labAttendance: "90%",
  //       }));

  //       setIaMarks(formattedMarks);
  //     } catch (error) {
  //       console.error("❌ Error fetching results:", error);
  //       setError("❌ Failed to fetch data. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchResults();
  // }, [registrationNumber]);

  // Dummy data
  const subjects = [
    { name: "FSD", ia1: 28, ia2: 27, ia3: 26, skill1: 18, skill2: 17 },
    { name: "OS", ia1: 25, ia2: 29, ia3: 24, skill1: 19, skill2: 18 },
    { name: "DS", ia1: 30, ia2: 28, ia3: 27, skill1: 20, skill2: 20 },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto rounded-2xl shadow-lg bg-gray-900 text-white">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 text-emerald-400">
        Internal Assessment & Skill Tests
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-[650px] w-full text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-xl shadow-md">
          <thead className="bg-emerald-700 text-white">
            <tr>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left">Subject</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-center">
                IA1 / 30
              </th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-center">
                IA2 / 30
              </th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-center">
                IA3 / 30
              </th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-center">
                Skill Test 1 / 20
              </th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-center">
                Skill Test 2 / 20
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subj, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                } text-center border-t border-gray-700`}
              >
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-left text-emerald-300 font-medium">
                  {subj.name}
                </td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">{subj.ia1}</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">{subj.ia2}</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">{subj.ia3}</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-yellow-300">
                  {subj.skill1}
                </td>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-yellow-300">
                  {subj.skill2}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IAMarks;
