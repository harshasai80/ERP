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
    <div className="p-6 max-w-4xl mx-auto rounded-xl shadow-lg bg-[#2d2f36] text-white">
      <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
        Internal Assessment & Attendance
      </h2>

      {loading && <p className="text-gray-300 text-center">Loading...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}

      {iaMarks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#3a3b42] border border-gray-600 rounded-lg shadow-md">
            <thead>
              <tr className="text-gray-300 text-sm">
                <th className="px-4 py-2 border border-gray-500">Subject</th>
                <th className="px-4 py-2 border border-gray-500">Code</th>
                <th className="px-4 py-2 border border-gray-500">IA1</th>
                <th className="px-4 py-2 border border-gray-500">IA2</th>
                <th className="px-4 py-2 border border-gray-500">IA3</th>
                <th className="px-4 py-2 border border-gray-500">Theory %</th>
                <th className="px-4 py-2 border border-gray-500">Lab %</th>
              </tr>
            </thead>
            <tbody>
              {iaMarks.map((subject, index) => (
                <tr
                  key={index}
                  className="text-gray-200 text-center border-t border-gray-600"
                >
                  <td className="px-4 py-2">{subject.subjectName}</td>
                  <td className="px-4 py-2">{subject.subjectCode}</td>
                  <td className="px-4 py-2">{subject.iaMarks.ia1}</td>
                  <td className="px-4 py-2">{subject.iaMarks.ia2}</td>
                  <td className="px-4 py-2">{subject.iaMarks.ia3}</td>
                  <td className="px-4 py-2">{subject.theoryAttendance}</td>
                  <td className="px-4 py-2">{subject.labAttendance}</td>
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
