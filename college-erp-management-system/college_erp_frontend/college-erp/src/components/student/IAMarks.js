import React, { useEffect, useState } from "react";
import Api from "../../Api";
import { useLocation } from "react-router-dom";

const IAMarks = () => {
  const [iaMarks, setIaMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();

  const registrationNumber =
    location.state?.student?.data?.registrationNumber ||
    location.state?.student?.registrationNumber;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await Api.get(
          `/iamarks/student/${registrationNumber}`
        );
        const data = response.data?.data;

        if (!data || data.length === 0) {
          setError("⚠️ No results found for this student.");
          setLoading(false);
          return;
        }

        const formattedMarks = data.map((entry) => ({
          subjectName: entry.subject.subjectName,
          subjectCode: entry.subject.subjectCode,
          iaMarks: JSON.parse(entry.iaMarks),
          theoryAttendance: "85%",
          labAttendance: "90%",
        }));

        setIaMarks(formattedMarks);
      } catch (error) {
        console.error("❌ Error fetching results:", error);
        setError("❌ Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [registrationNumber]);

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto rounded-2xl shadow-lg bg-gray-900 text-white">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-6 text-center">
        Internal Assessment & Attendance
      </h2>

      {loading && <p className="text-gray-300 text-center">Loading...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}

      {iaMarks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full bg-gray-800 border border-gray-700 rounded-xl shadow-md text-sm sm:text-base">
            <thead className="bg-emerald-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-center">IA1</th>
                <th className="px-4 py-3 text-center">IA2</th>
                <th className="px-4 py-3 text-center">IA3</th>
                <th className="px-4 py-3 text-center">Theory %</th>
                <th className="px-4 py-3 text-center">Lab %</th>
              </tr>
            </thead>
            <tbody>
              {iaMarks.map((subject, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                  } text-center border-t border-gray-700`}
                >
                  <td className="px-4 py-3 text-left text-emerald-300 font-medium">
                    {subject.subjectName}
                  </td>
                  <td className="px-4 py-3 text-left">{subject.subjectCode}</td>
                  <td className="px-4 py-3">{subject.iaMarks.ia1}</td>
                  <td className="px-4 py-3">{subject.iaMarks.ia2}</td>
                  <td className="px-4 py-3">{subject.iaMarks.ia3}</td>
                  <td className="px-4 py-3 text-green-400">{subject.theoryAttendance}</td>
                  <td className="px-4 py-3 text-green-400">{subject.labAttendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IAMarks;
