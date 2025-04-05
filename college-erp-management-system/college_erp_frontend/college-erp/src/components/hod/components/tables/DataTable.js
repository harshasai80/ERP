// src/components/tables/DataTable.js
import React from 'react';

const DataTable = ({ columns, data }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden mt-6 text-white">
      <table className="w-full table-auto">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="bg-emerald-700 text-white p-4 text-left text-sm uppercase font-semibold border-b border-emerald-600"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-700 transition-colors"
            >
              {columns.map((column, colIndex) => {
                if (column === 'Actions') {
                  return (
                    <td key={colIndex} className="p-4">
                      {row.actions}
                    </td>
                  );
                }

                const columnKey = column.toLowerCase().replace(/ /g, '');
                const cellValue =
                  row[columnKey === 'id' ? 'id' : columnKey] ||
                  row[column.toLowerCase()] ||
                  row[column];

                return (
                  <td
                    key={colIndex}
                    className="p-4 border-b border-gray-700 text-sm"
                  >
                    {cellValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
