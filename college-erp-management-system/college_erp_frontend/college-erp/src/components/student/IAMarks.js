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
        console.log("Full API Response:", response.data);

        const data = response.data?.data;
        if (!data || data.length === 0) {
          setError("⚠️ No results found for this student.");
          setLoading(false);
          return;
        }

        // Extracting relevant IA Marks data
        const formattedMarks = data.map((entry) => ({
          subjectName: entry.subject.subjectName,
          subjectCode: entry.subject.subjectCode,
          iaMarks: JSON.parse(entry.iaMarks),
          theoryAttendance: "85%", // Hardcoded for now
          labAttendance: "90%", // Hardcoded for now
        }));

        console.log("✅ Parsed IA Marks:", formattedMarks);
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
    <div className="p-6 max-w-3xl mx-auto border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        Internal Assessment & Attendance
      </h2>

      {loading && <p className="text-blue-500 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {iaMarks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
            <thead className="bg-gray-100">
              <tr className="text-gray-700 text-sm">
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">Code</th>
                <th className="px-4 py-2 border">IA1</th>
                <th className="px-4 py-2 border">IA2</th>
                <th className="px-4 py-2 border">IA3</th>
                <th className="px-4 py-2 border">Theory %</th>
                <th className="px-4 py-2 border">Lab %</th>
              </tr>
            </thead>
            <tbody>
              {iaMarks.map((subject, index) => (
                <tr key={index} className="text-gray-600 text-center border-b">
                  <td className="px-4 py-2 border">{subject.subjectName}</td>
                  <td className="px-4 py-2 border">{subject.subjectCode}</td>
                  <td className="px-4 py-2 border">{subject.iaMarks.ia1}</td>
                  <td className="px-4 py-2 border">{subject.iaMarks.ia2}</td>
                  <td className="px-4 py-2 border">{subject.iaMarks.ia3}</td>
                  <td className="px-4 py-2 border">
                    {subject.theoryAttendance}
                  </td>
                  <td className="px-4 py-2 border">{subject.labAttendance}</td>
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
