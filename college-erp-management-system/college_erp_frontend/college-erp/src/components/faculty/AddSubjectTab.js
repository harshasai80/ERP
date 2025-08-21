import React, { useState, useEffect } from "react";
import Api from "../../Api";

function AddSubjectTab({ faculty }) {
  const [formData, setFormData] = useState({
    department: "",
    semester: 0,
    subjectId: "",
    subjectType: "",
    section: "",
    batches: [],
  });

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [batchRanges, setBatchRanges] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch subject options
  useEffect(() => {
    const { department, semester } = formData;
    if (department && semester) {
      Api.get(`/subjects/department/${department}/semester/${semester}`)
        .then((res) => setSubjectOptions(res.data.data || []))
        .catch((err) => {
          console.error("Error fetching subjects:", err);
          setSubjectOptions([]);
        });
    }
  }, [formData.department, formData.semester]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "subjectType" && value === "Theory") {
      setFormData((prev) => ({ ...prev, [name]: value, batches: [] }));
      setBatchRanges({});
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBatchToggle = (batch) => {
    let updatedBatches = [...formData.batches];
    if (updatedBatches.includes(batch)) {
      updatedBatches = updatedBatches.filter((b) => b !== batch);
      const newRanges = { ...batchRanges };
      delete newRanges[batch];
      setBatchRanges(newRanges);
    } else {
      if (updatedBatches.length < 2) {
        updatedBatches.push(batch);
      }
    }
    setFormData((prev) => ({ ...prev, batches: updatedBatches }));
  };

  const handleRangeChange = (batch, field, value) => {
    setBatchRanges((prev) => ({
      ...prev,
      [batch]: {
        ...prev[batch],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.department ||
      !formData.semester ||
      !formData.subjectId ||
      !formData.subjectType ||
      !formData.section
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (formData.subjectType === "Lab") {
      const regNoPattern = /^[0-9]{3}[a-z]{2}[0-9]{5}$/i;

      const hasInvalidRanges = formData.batches.some((batch) => {
        const range = batchRanges[batch];
        return (
          !range ||
          !range.start?.trim() ||
          !range.end?.trim() ||
          !regNoPattern.test(range.start.trim()) ||
          !regNoPattern.test(range.end.trim())
        );
      });

      if (hasInvalidRanges) {
        alert(
          "Please enter valid register numbers (e.g., 459cs22027) for all selected batches."
        );
        return;
      }
    }

    setLoading(true);
    setMessage("");

    const selectedSubject = subjectOptions.find(
      (s) => String(s.subjectId) === formData.subjectId
    );

    const payload = {
      section: formData.section.toUpperCase(),
      subject: {
        subjectId: selectedSubject.subjectId,
        subjectName: selectedSubject.subjectName,
        subjectCode: selectedSubject.subjectCode,
        department: selectedSubject.department,
        value: selectedSubject.value,
        semester: selectedSubject.semester,
        maxMarks: selectedSubject.maxMarks,
      },
      faculty: faculty,
      subjectType: formData.subjectType.toUpperCase(),
      batches:
        formData.subjectType === "Lab"
          ? formData.batches.map((batch) => [
              batch,
              batchRanges[batch].start.trim(),
              batchRanges[batch].end.trim(),
            ])
          : [],
    };

    console.log("Submitting Payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await Api.post("/faculty/assign-subject", payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Response:", response.data);
      setMessage("Subject assigned successfully!");

      setFormData({
        department: "",
        semester: "",
        subjectId: "",
        subjectType: "",
        section: "",
        batches: [],
      });
      setBatchRanges({});
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("Failed to assign subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gradient-to-tr from-gray-800 to-gray-700 text-white shadow-2xl rounded-xl border border-emerald-500">
      <h2 className="text-2xl font-semibold text-center text-emerald-300 mb-6">
        Assign Subject to Faculty
      </h2>

      {message && (
        <div
          className={`text-center mb-4 ${
            message.includes("successfully")
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="p-3 bg-gray-900 border border-gray-600 rounded-md"
        >
          <option value="">Select Department</option>
          <option value="COMMON">COMMON SUBJECTS</option>
          <option value="DCS">Diploma in Computer Science Engineering</option>
          <option value="DEEE">
            Diploma in Electrical and Electronics Engineering
          </option>
          <option value="DME">Diploma in Mechanical Engineering</option>
          <option value="DCE">Diploma in Civil Engineering</option>
          <option value="DMT">Diploma in Metallurgy Engineering</option>
        </select>

        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          className="p-3 bg-gray-900 border border-gray-600 rounded-md"
        >
          <option value="">Select Semester</option>
          {[1, 2, 3, 4, 5].map((s) => (
            <option key={s} value={s}>
              Semester {s}
            </option>
          ))}
        </select>

        <select
          name="subjectId"
          value={formData.subjectId}
          onChange={handleChange}
          className="p-3 bg-gray-900 border border-gray-600 rounded-md"
        >
          <option value="">Select Subject</option>
          {subjectOptions.map((subj) => (
            <option key={subj.subjectId} value={subj.subjectId}>
              {subj.subjectName} ({subj.subjectCode})
            </option>
          ))}
        </select>

        <select
          name="subjectType"
          value={formData.subjectType}
          onChange={handleChange}
          className="p-3 bg-gray-900 border border-gray-600 rounded-md"
        >
          <option value="">Select Subject Type</option>
          <option value="Theory">Theory</option>
          <option value="Lab">Lab</option>
        </select>

        <select
          name="section"
          value={formData.section}
          onChange={handleChange}
          className="p-3 bg-gray-900 border border-gray-600 rounded-md"
        >
          <option value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        {formData.subjectType === "Lab" && (
          <>
            <div>
              <p className="mb-2 font-medium">Select Batch (max 2):</p>
              <div className="flex gap-4">
                {["B1", "B2"].map((batch) => (
                  <label key={batch} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.batches.includes(batch)}
                      onChange={() => handleBatchToggle(batch)}
                    />
                    {batch}
                  </label>
                ))}
              </div>
            </div>

            {formData.batches.map((batch) => (
              <div key={batch} className="flex items-center gap-3">
                <span className="w-10">{batch}</span>
                <input
                  type="text"
                  placeholder="Start Reg No."
                  required
                  value={batchRanges[batch]?.start || ""}
                  onChange={(e) =>
                    handleRangeChange(batch, "start", e.target.value)
                  }
                  className="p-2 w-full bg-gray-900 border border-gray-600 rounded-md"
                />
                <input
                  type="text"
                  placeholder="End Reg No."
                  required
                  value={batchRanges[batch]?.end || ""}
                  onChange={(e) =>
                    handleRangeChange(batch, "end", e.target.value)
                  }
                  className="p-2 w-full bg-gray-900 border border-gray-600 rounded-md"
                />
              </div>
            ))}
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700 py-3 rounded-md font-medium transition duration-300 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default AddSubjectTab;
