import React, { useState, useEffect } from "react";
import Api from "../../Api";
import DragDropCSVUpload from "../DragDropFileUpload";

function AddSubjectTab({ faculty }) {
  const isHOD = faculty?.role?.toUpperCase() === "HOD";
  const [formData, setFormData] = useState({
    department:
      isHOD && faculty?.department && faculty.department !== "ALL"
        ? faculty.department
        : "DCS",
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

  // CSV Upload state
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
  }, [formData.department, formData.semester, formData]);

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
  }, [formData.subjectId, formData.subjectType, existingAssignments, formData]);

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

  const handleFileUpload = (file) => {
    setSelectedFile(file);
  };

  const handleCSVSubmit = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await Api.post("/subjects/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Subject CSV uploaded successfully!");
      setSelectedFile(null);
      setShowCSVUpload(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload subject CSV.");
    } finally {
      setUploading(false);
    }
  };

  const DownloadSampleCSV = () => {
    const link = document.createElement("a");
    link.href = "/csv files/subjectcsv.csv";
    link.download = "subjectcsv.csv";
    link.click();
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-2xl rounded-2xl border border-emerald-500/30 relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent classic-heading uppercase tracking-widest">
          Subject Management
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCSVUpload(false)}
            className={`px-4 py-2 rounded-lg text-base font-bold uppercase tracking-widest transition-all ${!showCSVUpload ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            Individual
          </button>
          <button
            onClick={() => setShowCSVUpload(true)}
            className={`px-4 py-2 rounded-lg text-base font-bold uppercase tracking-widest transition-all ${showCSVUpload ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            CSV Upload
          </button>
        </div>
      </div>

      {showCSVUpload ? (
        <div className="space-y-6">
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <p className="text-base font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Batch Subject Enrollment</p>
            <DragDropCSVUpload onChange={handleFileUpload} />

            {selectedFile && (
              <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-base">📄</span>
                  <div className="min-w-0">
                    <p className="text-base font-bold truncate">{selectedFile.name}</p>
                    <p className="text-base text-gray-500 uppercase">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-400">×</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={DownloadSampleCSV}
              className="flex items-center justify-center gap-2 py-4 px-6 bg-gray-800 hover:bg-gray-700 rounded-xl text-base font-black uppercase tracking-widest transition-all"
            >
              <span>📥</span> Sample Template
            </button>
            <button
              onClick={handleCSVSubmit}
              disabled={!selectedFile || uploading}
              className="flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl text-base font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20"
            >
              {uploading ? "Processing..." : "Deploy Database"}
            </button>
          </div>

          <p className="text-base text-center text-gray-500 italic">
            * Ensure the CSV follows the standard schema for subject inventory deployment.
          </p>
        </div>
      ) : (
        <>
          {/* Success message */}
          {message && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-base font-bold text-center">
              {message}
            </div>
          )}

          {/* ERROR block */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-base font-bold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1">
              <label className="text-base font-black text-emerald-500 uppercase tracking-widest ml-1">Stream</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={isHOD && faculty?.department && faculty.department !== "ALL"}
                className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-base font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all disabled:opacity-50"
              >
                <option value="">Select Stream</option>
                <option value="COMMON">COMMON SUBJECTS</option>
                <option value="DCS">Computer Science (DCS)</option>
                <option value="DEEE">Electrical (DEEE)</option>
                <option value="DME">Mechanical (DME)</option>
                <option value="DCE">Civil (DCE)</option>
                <option value="DMT">Metallurgy (DMT)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-base font-black text-emerald-500 uppercase tracking-widest ml-1">Term</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-base font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                >
                  <option value="">Semester</option>
                  {[1, 2, 3, 4, 5, 6].map((s) => (
                    <option key={s} value={s}>Sem {s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-base font-black text-emerald-500 uppercase tracking-widest ml-1">Modal</label>
                <select
                  name="subjectType"
                  value={formData.subjectType}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-base font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                >
                  <option value="">Type</option>
                  <option value="Theory">Theory</option>
                  <option value="Lab">Lab</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-base font-black text-emerald-500 uppercase tracking-widest ml-1">Subject Inventory</label>
              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-base font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              >
                <option value="">Search Portfolio...</option>
                {subjectOptions.map((subj) => (
                  <option key={subj.subjectId} value={subj.subjectId}>
                    {subj.subjectName} ({subj.subjectCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-base font-black text-emerald-500 uppercase tracking-widest ml-1">Academic Section</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-base font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  >
                    <option value="">Select Section</option>
                    {["A", "B", "C", "D"].map((sec) => {
                      const isDisabled = disabledSections.includes(sec);
                      return (
                        <option key={sec} value={sec} disabled={isDisabled}>
                          {sec} {isDisabled ? " (Assigned)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="relative group">
                  <button
                    type="button"
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-900 border border-gray-700 text-emerald-500 hover:bg-emerald-500/10 transition-all focus:outline-none"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </button>

                  <div className="pointer-events-none opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all absolute right-0 top-full mt-3 w-64 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 p-4 text-base">
                    <p className="font-black text-emerald-500 uppercase tracking-widest mb-2 pb-2 border-b border-gray-800">Section Lock Details</p>
                    {Object.keys(disabledDetails).length === 0 ? (
                      <p className="text-gray-500 italic text-center">All sections available</p>
                    ) : (
                      <ul className="space-y-2">
                        {Object.entries(disabledDetails).map(([sec, reason]) => (
                          <li key={sec} className="flex flex-col">
                            <span className="font-bold text-white">Section {sec}</span>
                            <span className="text-gray-400">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {formData.subjectType === "Lab" && (
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700 space-y-6">
                <div>
                  <label className="text-base font-black text-emerald-500 uppercase tracking-widest ml-1 mb-3 block">Laboratory Batches (Max 2)</label>
                  <div className="flex gap-6">
                    {["B1", "B2"].map((batch) => (
                      <label key={batch} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 transition-all"
                          checked={formData.batches.includes(batch)}
                          onChange={() => handleBatchToggle(batch)}
                        />
                        <span className="text-base font-bold text-gray-400 group-hover:text-white transition-colors">{batch}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.batches.map((batch) => (
                  <div key={batch} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-base font-black text-emerald-500 border border-emerald-500/20">{batch}</span>
                      <div className="h-px flex-1 bg-gray-800"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Start Range"
                        required
                        value={batchRanges[batch]?.start || ""}
                        onChange={(e) => handleRangeChange(batch, "start", e.target.value)}
                        className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-base font-mono tracking-widest focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-gray-600"
                      />
                      <input
                        type="text"
                        placeholder="End Range"
                        required
                        value={batchRanges[batch]?.end || ""}
                        onChange={(e) => handleRangeChange(batch, "end", e.target.value)}
                        className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-base font-mono tracking-widest focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 py-5 rounded-2xl text-base font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Processing Assignment..." : "Link Faculty Duty"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default AddSubjectTab;




