// src/components/your-path/AddSubjectTab.js
import React, { useState, useEffect } from "react";
import Api from "../../Api";

function AddSubjectTab({ faculty }) {
  const [formData, setFormData] = useState({
    department: "",
    semester: "",
    subjectId: "",
    subjectType: "",
    section: "",
    batches: [],
  });

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [batchRanges, setBatchRanges] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [existingAssignments, setExistingAssignments] = useState([]);
  const [disabledSections, setDisabledSections] = useState([]);
  const [disabledDetails, setDisabledDetails] = useState({}); // { A: "Theory — Sem 2 (DCS)" }

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
    } else {
      setSubjectOptions([]);
    }
  }, [formData.department, formData.semester]);

  // Fetch existing assignments for this faculty (used to disable options)
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (!faculty?.id) {
          setExistingAssignments([]);
          return;
        }
        const res = await Api.get(`/subjects/all?facultyId=${faculty.id}`);
        const data = res.data?.data || [];
        setExistingAssignments(data);
      } catch (err) {
        console.error("Error fetching existing assignments:", err);
        setExistingAssignments([]);
      }
    };

    fetchAssignments();
  }, [faculty?.id]);

  // Compute disabled sections + details whenever subjectId, subjectType or existingAssignments changes
  useEffect(() => {
    const { subjectId, subjectType } = formData;

    if (!subjectId || !subjectType) {
      setDisabledSections([]);
      setDisabledDetails({});
      return;
    }

    const sid = parseInt(subjectId);
    const selectedType = String(subjectType).toUpperCase();

    // Filter assignments that match selected subject & type (those cause disabling)
    const matchingAssignments = existingAssignments
      .filter((a) => a.subject?.subjectId === sid)
      .filter((a) => String(a.subjectType).toUpperCase() === selectedType);

    const assignedSections = matchingAssignments
      .map((a) => String(a.section).toUpperCase())
      .filter(Boolean);

    const uniqueSections = Array.from(new Set(assignedSections));
    setDisabledSections(uniqueSections);

    // Build human readable details for tooltip
    const details = {};
    matchingAssignments.forEach((a) => {
      const sec = String(a.section).toUpperCase();
      const type = String(a.subjectType);
      const dept = a.subject?.department || "";
      const sem = a.subject?.semester || "";
      details[sec] = `${type} — Sem ${sem}${dept ? ` (${dept})` : ""}`;
    });

    setDisabledDetails(details);
  }, [formData.subjectId, formData.subjectType, existingAssignments]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear previous error when user edits any field
    if (errorMsg) setErrorMsg("");

    // If changing subjectType, clear section to avoid holding now-invalid selection
    if (name === "subjectType") {
      if (value === "Theory") {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          batches: [],
          section: "",
        }));
        setBatchRanges({});
      } else {
        setFormData((prev) => ({ ...prev, [name]: value, section: "" }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // if user changed subjectId, clear selected section to avoid conflicts
    if (name === "subjectId") {
      setFormData((prev) => ({ ...prev, section: "" }));
    }
  };

  const handleBatchToggle = (batch) => {
    if (errorMsg) setErrorMsg("");
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
    if (errorMsg) setErrorMsg("");
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
    setMessage("");
    setErrorMsg("");

    if (
      !formData.department ||
      !formData.semester ||
      !formData.subjectId ||
      !formData.subjectType ||
      !formData.section
    ) {
      setErrorMsg("Please fill all required fields.");
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
        setErrorMsg(
          "Please enter valid register numbers (e.g., 459cs22027) for all selected batches."
        );
        return;
      }
    }

    setLoading(true);

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
              (batchRanges[batch]?.start || "").trim(),
              (batchRanges[batch]?.end || "").trim(),
            ])
          : [],
    };

    try {
      // final safety: check duplicates again using assignments already fetched
      const isDuplicate = existingAssignments.some((assignment) => {
        return (
          assignment.faculty?.id === faculty.id &&
          assignment.subject?.subjectId === parseInt(formData.subjectId) &&
          String(assignment.section).toUpperCase() ===
            formData.section.toUpperCase() &&
          String(assignment.subjectType).toUpperCase() ===
            formData.subjectType.toUpperCase() &&
          String(assignment.subject?.department) === formData.department &&
          parseInt(assignment.subject?.semester) === parseInt(formData.semester)
        );
      });

      if (isDuplicate) {
        setErrorMsg(
          "This subject is already assigned to this faculty with same details."
        );
        setLoading(false);
        return;
      }

      const response = await Api.post("/faculty/assign-subject", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response:", response.data);
      setMessage("Subject assigned successfully!");
      setErrorMsg("");

      // refresh assignments so UI disables things immediately for future selections
      const refreshed = await Api.get(`/subjects/all?facultyId=${faculty?.id}`);
      setExistingAssignments(refreshed.data?.data || []);

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
      setErrorMsg("Failed to assign subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gradient-to-tr from-gray-800 to-gray-700 text-white shadow-2xl rounded-xl border border-emerald-500">
      <h2 className="text-2xl font-semibold text-center text-emerald-300 mb-6">
        Assign Subject to Faculty
      </h2>

      {/* Success message */}
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

      {/* ERROR block */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded bg-red-900 text-red-100 text-sm">
          {errorMsg}
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

        {/* Section select with fancy tooltip */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="p-3 bg-gray-900 border border-gray-600 rounded-md w-full"
              >
                <option value="">Select Section</option>
                {["A", "B", "C", "D"].map((sec) => {
                  const isDisabled = disabledSections.includes(sec);
                  return (
                    <option key={sec} value={sec} disabled={isDisabled}>
                      {sec} {isDisabled ? " (assigned)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Fancy tooltip: shows reasons for disabled sections */}
            <div className="relative">
              <div className="group inline-flex items-center">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none"
                  aria-label="Disabled sections info"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </button>

                {/* Tooltip box */}
                <div
                  className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transform scale-95 group-hover:scale-100 group-focus:scale-100 transition-all duration-150 ease-out absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 p-3 text-xs text-gray-100"
                  role="tooltip"
                >
                  <div className="font-medium mb-1">Disabled sections</div>
                  {Object.keys(disabledDetails).length === 0 ? (
                    <div className="text-gray-400">No disabled sections</div>
                  ) : (
                    <ul className="space-y-1">
                      {Object.entries(disabledDetails).map(([sec, reason]) => (
                        <li key={sec} className="flex items-start gap-2">
                          <span className="font-semibold">{sec}:</span>
                          <span className="text-gray-300">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-2 text-xs text-gray-400">
                    Tip: change subject type to enable other options.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Small inline fallback help for touch users */}
          {Object.keys(disabledDetails).length > 0 &&
            formData.subjectId &&
            formData.subjectType && (
              <p className="mt-2 text-xs text-yellow-300">
                Some sections are disabled — tap the info icon to see details.
              </p>
            )}
        </div>

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
