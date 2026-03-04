import { useState } from "react";
import Api from "../../../../Api";

const AddStudentsTab = ({ onClose }) => {
  const [student, setStudent] = useState({
    name: "",
    registrationNumber: "",
    section: "",
    department: "",
    sem: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: name === "sem" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirm = window.confirm(
      `Are you sure you want to add:\nName: ${student.name},\nRegister Number: ${student.registrationNumber},\nDepartment: ${student.department},\nSemester: ${student.sem}\n?`
    );
    try {
      if (confirm) {
        const response = await Api.post("/student/add", student);
        alert("Student added successfully!");
        console.log(JSON.stringify(response.data));
        onClose?.(); // optional chaining in case onClose is not provided
      }
    } catch (error) {
      if (error.response) {
        alert(`Error ${error.response.status}: ${error.response.data.message}`);
      } else {
        alert("Network error or server not responding.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-mesh p-4 text-gray-900 font-sans">
      <div className="lux-card glass-gold w-full max-w-md p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

        <div className="flex justify-between items-center mb-10">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-emerald-600 uppercase tracking-[0.4em]">Manual Record Creation</h4>
            <h2 className="text-3xl font-bold classic-heading bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent uppercase">
              Add <span className="font-light italic text-gray-400">Student</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full shadow-sm border border-gray-50 active:scale-95"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-base font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              placeholder="Enter student's full name"
              required
              className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all text-base font-medium shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-base font-bold text-gray-400 uppercase tracking-widest ml-1">Register Number</label>
            <input
              type="text"
              name="registrationNumber"
              value={student.registrationNumber}
              onChange={handleChange}
              placeholder="Ex: 22DC001"
              required
              className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all text-base font-medium shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-base font-bold text-gray-400 uppercase tracking-widest ml-1">Section</label>
              <select
                name="section"
                value={student.section}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all text-base font-bold uppercase tracking-widest shadow-sm cursor-pointer appearance-none"
              >
                <option value="">Select</option>
                {["A", "B", "C", "D"].map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-base font-bold text-gray-400 uppercase tracking-widest ml-1">Semester</label>
              <select
                name="sem"
                value={student.sem}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all text-base font-bold uppercase tracking-widest shadow-sm cursor-pointer appearance-none"
              >
                <option value="">Select</option>
                {[...Array(6).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    Sem {num + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-base font-bold text-gray-400 uppercase tracking-widest ml-1">Department</label>
            <select
              name="department"
              value={student.department}
              onChange={handleChange}
              required
              className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all text-base font-bold uppercase tracking-widest shadow-sm cursor-pointer appearance-none"
            >
              <option value="">Assign Department</option>
              <option value="DCS">Computer Science</option>
              <option value="DCE">Civil Engineering</option>
              <option value="DEEE">Electrical Engineering</option>
              <option value="DME">Mechanical Engineering</option>
              <option value="DMT">Metallurgy</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl mt-6 transition-all duration-300 shadow-xl shadow-gray-900/10 active:scale-95 text-base font-bold uppercase tracking-[0.2em] group relative overflow-hidden"
          >
            <span className="relative z-10">Authorize Enrollment</span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-emerald-500/10 text-center">
          <p className="text-base font-bold text-gray-400 uppercase tracking-[0.3em]">
            Protected by SGP ERP Institutional Security
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddStudentsTab;




