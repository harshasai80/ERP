import React from 'react';
import DataTable from '../../components/tables/DataTable';

const StudentList = () => {
  const columns = ['ID', 'Name', 'Class', 'Section', 'Guardian', 'Contact', 'Actions'];
  
  const studentData = [
    { id: 'S001', name: 'Alex Johnson', class: 'XI', section: 'A', guardian: 'Mark Johnson', contact: 'mark.j@mail.com' },
    { id: 'S002', name: 'Emma Williams', class: 'X', section: 'B', guardian: 'Lisa Williams', contact: 'lisa.w@mail.com' },
    { id: 'S003', name: 'James Brown', class: 'XII', section: 'A', guardian: 'Robert Brown', contact: 'robert.b@mail.com' },
    { id: 'S004', name: 'Sophia Davis', class: 'IX', section: 'C', guardian: 'Michael Davis', contact: 'michael.d@mail.com' },
    { id: 'S005', name: 'William Miller', class: 'XI', section: 'B', guardian: 'Jennifer Miller', contact: 'jennifer.m@mail.com' },
  ];
  
  const handleAddStudent = () => {
    alert('Add student form will appear here');
  };
  
  return (
    <div className="p-5 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Student List</h1>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleAddStudent}>Add New Student</button>
      </div>
      
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
    </div>
  );
};

export default StudentList;
