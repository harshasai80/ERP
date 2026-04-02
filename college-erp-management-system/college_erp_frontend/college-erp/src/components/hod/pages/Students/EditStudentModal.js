import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Api from "../../../../Api";

const EditStudentModal = ({ show, student, onClose, onUpdate }) => {
  const [name, setName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [sem, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [errors, setErrors] = useState({});

  const sectionOptions = useMemo(() => {
    const twoSectionDepts = ["DCS", "DMT", "DCE"];
    return twoSectionDepts.includes(department.toUpperCase())
      ? ["A", "B"]
      : ["A", "B", "C", "D"];
  }, [department]);

  useEffect(() => {
    if (student) {
      setName(student.name || "");
      setRegistrationNumber(student.registrationNumber || "");
      setDepartment(student.department.toUpperCase() || "");
      setSemester(student?.sem ? student.sem?.toString() : "");
      setSection(student.section || "");
      setParentEmail(student.parentEmail || "");
      setParentPhone(student.parentPhone || "");
      setErrors({});
    }
  }, [student]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!registrationNumber.trim())
      newErrors.registrationNumber = "Registration number is required.";
    if (!department.trim()) newErrors.department = "Department is required.";
    if (!sem.trim() || isNaN(sem) || +sem < 1 || +sem > 8)
      newErrors.sem = "Semester must be a number between 1 and 8.";
    if (!section.trim()) newErrors.section = "Section is required.";
    if (!parentPhone.trim()) newErrors.parentPhone = "Parent phone is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("❌ Please fix validation errors.");
      return;
    }

    try {
      const response = await Api.put(
        `/student/update?registrationNumber=${student.registrationNumber}`,
        {
          name,
          registrationNumber,
          department,
          sem: parseInt(sem, 10),
          section,
          parentPhone,
          parentEmail
        }
      );

      if (response.status === 200) {
        toast.success("✅ Student updated successfully!");
        onUpdate();
        onClose();
      } else {
        toast.error("❌ Failed to update student.");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("❌ Error updating student.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <h2 className="text-emerald-400 text-base font-bold">Edit Student</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-base font-bold"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-base text-emerald-200 mb-1">Name</label>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 ${
                errors.name
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-emerald-500"
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-base text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-base text-emerald-200 mb-1">
              Registration Number
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 ${
                errors.registrationNumber
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-emerald-500"
              }`}
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
            {errors.registrationNumber && (
              <p className="text-base text-red-500 mt-1">
                {errors.registrationNumber}
              </p>
            )}
          </div>

          {/* Department Dropdown */}
          <div>
            <label className="block text-base text-emerald-200 mb-1">
              Department
            </label>
            <select
              className={`w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring-2 ${
                errors.department
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-emerald-500"
              }`}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              <option value="DCS">DCS</option>
              <option value="DME">DME</option>
              <option value="DEEE">DEEE</option>
              <option value="DMT">DMT</option>
              <option value="DCE">DCE</option>
            </select>
            {errors.department && (
              <p className="text-base text-red-500 mt-1">{errors.department}</p>
            )}
          </div>

          {/* Semester Dropdown */}
          <div>
            <label className="block text-base text-emerald-200 mb-1">
              Semester
            </label>
            <select
              className={`w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring-2 ${
                errors.sem
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-emerald-500"
              }`}
              value={sem}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">Select Semester</option>
              {[...Array(5)].map((_, i) => {
                const sem = (i + 1).toString();
                return (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                );
              })}
            </select>
            {errors.sem && (
              <p className="text-base text-red-500 mt-1">{errors.sem}</p>
            )}
          </div>

          {/* Section Dropdown */}
          <div>
            <label className="block text-base text-emerald-200 mb-1">
              Section
            </label>
            <select
              className={`w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring-2 ${
                errors.section
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-emerald-500"
              }`}
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="">Select Section</option>
              {sectionOptions.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
            {errors.section && (
              <p className="text-base text-red-500 mt-1">{errors.section}</p>
            )}
          </div>

          {/* Parent Phone */}
          <div>
            <label className="block text-base text-emerald-200 mb-1">Parent Mobile Number</label>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 ${
                errors.parentPhone
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-emerald-500"
              }`}
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
            />
            {errors.parentPhone && (
              <p className="text-base text-red-500 mt-1">{errors.parentPhone}</p>
            )}
          </div>

          {/* Parent Email */}
          <div>
            <label className="block text-base text-emerald-200 mb-1">Parent Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-emerald-500"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t border-gray-700 pt-4">
          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md text-white font-semibold"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-red-700 px-4 py-2 rounded-md text-white font-medium transition duration-500 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;




