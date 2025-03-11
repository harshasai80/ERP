import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Api from "../../Api";

const IAMarks = () => {
  const [iaMarks, setIaMarks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const registerNo = useLocation().state?.student?.data?.registrationNumber;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await Api.get(`/iamarks/student/${registerNo}`);
        console.log("Full API Response:", response.data);

        const data = response.data?.data;
        if (!data || data.length === 0) {
          setError("⚠️ No results found for this student.");
          setLoading(false);
          return;
        }

        const rawIaMarks = data[0]?.iaMarks;
        if (!rawIaMarks) {
          setError("⚠️ IA Marks data is missing!");
          setLoading(false);
          return;
        }

        // Parse JSON from the "iaMarks" field
        const parsedIaMarks = JSON.parse(rawIaMarks);
        console.log("✅ Parsed IA Marks:", parsedIaMarks);
        setIaMarks(parsedIaMarks);
      } catch (error) {
        console.error("❌ Error fetching results:", error);
        setError("❌ Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [registerNo]);

  return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Internal Assessment Marks
      </h2>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {iaMarks && (
        <div className="bg-gray-100 p-3 rounded-md">
          <p>
            <strong>IA1 Marks:</strong> {iaMarks.ia1}
          </p>
          <p>
            <strong>IA2 Marks:</strong> {iaMarks.ia2}
          </p>
          <p>
            <strong>IA3 Marks:</strong> {iaMarks.ia3}
          </p>
        </div>
      )}
    </div>
  );
};

export default IAMarks;
