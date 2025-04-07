import React from "react";

const DataTable = ({ columns, data }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden mt-6 text-white">
      <table className="w-full table-auto">
        <thead>
          <tr>
            {columns.map((column, index) => {
              const colName = typeof column === "string" ? column : column.name;
              return (
                <th
                  key={index}
                  className="bg-emerald-700 text-white p-4 text-center text-sm uppercase font-semibold border-b border-emerald-600"
                >
                  {colName}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-700 transition-colors">
              {columns.map((column, colIndex) => {
                const colName = typeof column === "string" ? column : column.name;
                const key = colName.toLowerCase().replace(/ /g, "");
                const cellValue = row[key] || "";

                return (
                  <td
                    key={colIndex}
                    className={`p-4 border-b border-gray-700 text-sm text-center`}
                  >
                    {colName === "Actions" ? row.actions : cellValue}
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
