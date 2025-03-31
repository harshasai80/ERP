import React, { useState } from 'react';
import Api from "../../../../Api";
import DataTable from '../../components/tables/DataTable';

const FacultyList = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleView = (facultyId) => {
    alert(`View details for faculty ID: ${facultyId}`);
  };

  const handleEdit = (facultyId) => {
    alert(`Edit faculty with ID: ${facultyId}`);
  };

  const handleDelete = (facultyId) => {
    alert(`Delete faculty with ID: ${facultyId}`);
  };

  const columns = ['ID', 'Name', 'Department', 'Position', 'Contact', 'Actions'];
  
  const facultyData = [
    { id: 'F001', name: 'Dr. John Smith', department: 'Mathematics', position: 'Senior Professor', contact: 'john.smith@school.edu',
      actions: (
        <div className="flex gap-2 justify-center">
          <button className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600" onClick={() => handleView('F001')}>View</button>
          <button className="px-2 py-1 text-black bg-yellow-400 rounded hover:bg-yellow-500" onClick={() => handleEdit('F001')}>Edit</button>
          <button className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600" onClick={() => handleDelete('F001')}>Delete</button>
        </div>
      )
    },
    { id: 'F002', name: 'Prof. Sarah Johnson', department: 'Science', position: 'HOD', contact: 'sarah.j@school.edu',
      actions: (
        <div className="flex gap-2 justify-center">
          <button className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600" onClick={() => handleView('F002')}>View</button>
          <button className="px-2 py-1 text-black bg-yellow-400 rounded hover:bg-yellow-500" onClick={() => handleEdit('F002')}>Edit</button>
          <button className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600" onClick={() => handleDelete('F002')}>Delete</button>
        </div>
      )
    }
  ];
  
  const handleAddFaculty = () => {
    setShowUpload(true);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await Api.post('/faculty/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        alert(`File uploaded successfully: ${response.data.message}`);
      } catch (error) {
        alert(`Upload failed: ${error.response?.data?.message || error.message}`);
      }
    }
  };
  
  return (
    <div className="p-5 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Faculty List</h1>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleAddFaculty}>Add New Faculty</button>
      </div>
      
      {showUpload && (
        <div className="mb-5 p-4 border border-gray-300 rounded bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-2">Upload Faculty CSV</h2>
          <input type="file" accept=".csv" className="p-2 border border-gray-300 rounded w-full" onChange={handleFileChange} />
          {selectedFile && (
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleUpload}>Upload</button>
          )}
        </div>
      )}
      
      <div className="flex gap-3 mb-5">
        <input type="text" placeholder="Search faculty..." className="flex-1 p-2 border border-gray-300 rounded" />
        <select className="p-2 border border-gray-300 rounded">
          <option value="">All Departments</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Science">Science</option>
          <option value="English">English</option>
          <option value="History">History</option>
          <option value="Computer Science">Computer Science</option>
        </select>
      </div>
      
      <DataTable columns={columns} data={facultyData} />
    </div>
  );
};

export default FacultyList;
