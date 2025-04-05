import React, { useState } from 'react';
import Api from '../../Api';

function AddSubjectTab() {
  const [formData, setFormData] = useState({
    department: '',
    semester: '',
    subject: '',
    subjectType: '',
    section: '',
    batch: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (Object.values(formData).some((val) => val.trim() === '')) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await Api.post('/faculty/assign-subject', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setMessage('Subject assigned successfully!');
      console.log('Response:', response.data);

      // Reset form after successful submission
      setFormData({
        department: '',
        semester: '',
        subject: '',
        subjectType: '',
        section: '',
        batch: '',
      });
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('Failed to assign subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-gradient-to-tr from-gray-800 to-gray-700 text-white shadow-2xl rounded-2xl border border-emerald-500">
      <h2 className="text-2xl font-semibold text-center text-emerald-300 mb-6">
        Diploma Faculty Details
      </h2>

      {message && (
        <div
          className={`text-sm text-center mb-4 ${
            message.includes('successfully') ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Department */}
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="p-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select Department</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electronics and Communication">Electronics and Communication</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
          <option value="Electrical">Electrical</option>
        </select>

        {/* Semester */}
        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          className="p-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select Semester</option>
          {Array.from({ length: 6 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Semester {i + 1}
            </option>
          ))}
        </select>

        {/* Subject */}
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="p-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select Subject</option>
          <option value="Basic Electronics">Basic Electronics</option>
          <option value="Computer Fundamentals">Computer Fundamentals</option>
          <option value="Applied Mathematics">Applied Mathematics</option>
          <option value="Engineering Drawing">Engineering Drawing</option>
        </select>

        {/* Subject Type */}
        <select
          name="subjectType"
          value={formData.subjectType}
          onChange={handleChange}
          className="p-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select Subject Type</option>
          <option value="Theory">Theory</option>
          <option value="Lab">Lab</option>
        </select>

        {/* Section */}
        <select
          name="section"
          value={formData.section}
          onChange={handleChange}
          className="p-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>

        {/* Batch */}
        <select
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          className="p-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select Batch</option>
          <option value="2020-2023">2020-2023</option>
          <option value="2021-2024">2021-2024</option>
          <option value="2022-2025">2022-2025</option>
          <option value="2023-2026">2023-2026</option>
          <option value="2024-2027">2024-2027</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 py-3 rounded-md font-medium transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default AddSubjectTab;
