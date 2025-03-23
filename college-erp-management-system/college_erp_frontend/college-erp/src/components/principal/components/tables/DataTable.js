// src/components/tables/DataTable.js
import React from 'react';

const DataTable = ({ columns, data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-5">
      <table className="w-full table-auto">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="bg-gray-100 p-3 text-left font-semibold text-gray-800 border-b border-gray-300">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100">
              {columns.map((column, colIndex) => {
                // Special handling for the Actions column
                if (column === 'Actions') {
                  return <td key={colIndex} className="p-3">{row.actions}</td>;
                }
                // Normal cell rendering for other columns
                const columnKey = column.toLowerCase().replace(/ /g, '');
                const cellValue = row[columnKey === 'id' ? 'id' : columnKey] || 
                                  row[column.toLowerCase()] || 
                                  row[column];
                return <td key={colIndex} className="p-3 border-b border-gray-200">{cellValue}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
