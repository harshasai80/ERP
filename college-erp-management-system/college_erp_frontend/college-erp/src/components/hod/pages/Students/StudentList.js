import React, { useState } from 'react';
import Api from '../../../../Api';
import DataTable from '../../components/tables/DataTable';
import AddStudentsTab from '../../components/tabs/AddStudentsTab';

const StudentList = () => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const columns = ['ID', 'Name', 'Class', 'Section', 'Guardian', 'Contact', 'Actions'];
  
  const studentData = [
    { id: 'S001', name: 'Alex Johnson', class: 'XI', section: 'A', guardian: 'Mark Johnson', contact: 'mark.j@mail.com' },
    { id: 'S002', name: 'Emma Williams', class: 'X', section: 'B', guardian: 'Lisa Williams', contact: 'lisa.w@mail.com' },
    { id: 'S003', name: 'James Brown', class: 'XII', section: 'A', guardian: 'Robert Brown', contact: 'robert.b@mail.com' },
    { id: 'S004', name: 'Sophia Davis', class: 'IX', section: 'C', guardian: 'Michael Davis', contact: 'michael.d@mail.com' },
    { id: 'S005', name: 'William Miller', class: 'XI', section: 'B', guardian: 'Jennifer Miller', contact: 'jennifer.m@mail.com' },
  ];

  const handleFileUpload = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!csvFile) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await Api.post('/student/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload success:', response.data);
      alert('CSV file uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload CSV file.');
    } finally {
      setUploading(false);
      setCsvFile(null);
    }
  };
  
  return (
    <div className="p-5 max-w-5xl mx-auto">
      {showAddStudent ? (
        <AddStudentsTab onClose={() => setShowAddStudent(false)} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold text-gray-800">Student List</h1>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" 
              onClick={() => setShowOptions(true)}
            >
              Add New Student
            </button>
          </div>
          
          {showOptions && (
            <div className="mb-5 p-5 bg-white shadow-lg rounded-lg flex flex-col items-center gap-3 w-96 mx-auto">
              <p className="text-lg font-semibold">Choose an option:</p>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full" 
                onClick={() => { setShowAddStudent(true); setShowOptions(false); }}
              >
                Add Individually
              </button>
              <div className="w-full text-center">
                <label className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer w-full block">
                  Upload CSV File
                  <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                </label>
                {csvFile && (
                  <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded text-gray-700 flex justify-between items-center">
                    <span>{csvFile.name}</span>
                    <button className="ml-2 text-red-500 hover:text-red-700" onClick={() => setCsvFile(null)}>×</button>
                  </div>
                )}
                {csvFile && (
                  <button 
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full" 
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </button>
                )}
              </div>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full" 
                onClick={() => setShowOptions(false)}
              >
                Cancel
              </button>
            </div>
          )}
          
          <div className="flex gap-3 mb-5">
            <input type="text" placeholder="Search students..." className="flex-1 p-2 border border-gray-300 rounded" />
            <select className="p-2 border border-gray-300 rounded">
              <option value="">All Classes</option>
              <option value="IX">Class IX</option>
              <option value="X">Class X</option>
              <option value="XI">Class XI</option>
              <option value="XII">Class XII</option>
            </select>
            <select className="p-2 border border-gray-300 rounded">
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
          
          <DataTable columns={columns} data={studentData} />
        </>
      )}
    </div>
  );
};

export default StudentList;