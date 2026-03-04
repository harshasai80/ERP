import React from "react";

const DataTable = ({ columns, data }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden mt-6 text-white">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto min-w-full">
          <thead>
            <tr>
              {columns.map((column, index) => {
                const colName = typeof column === "string" ? column : column.name;
                return (
                  <th
                    key={index}
                    className="bg-emerald-700 text-white p-3 lg:p-4 text-center text-base lg:text-base uppercase font-semibold border-b border-emerald-600"
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
                      className="p-3 lg:p-4 border-b border-gray-700 text-base lg:text-base text-center"
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

      {/* Mobile Card View */}
      <div className="block md:hidden">
        {data.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No data available
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {data.map((row, rowIndex) => (
              <div key={rowIndex} className="p-4 hover:bg-gray-700 transition-colors">
                {columns.map((column, colIndex) => {
                  const colName = typeof column === "string" ? column : column.name;
                  const key = colName.toLowerCase().replace(/ /g, "");
                  const cellValue = row[key] || "";

                  // Skip empty values except for Actions column
                  if (!cellValue && colName !== "Actions") return null;

                  return (
                    <div key={colIndex} className="flex justify-between items-start mb-2 last:mb-0">
                      <span className="text-base font-medium text-emerald-400 uppercase tracking-wide min-w-0 flex-shrink-0 mr-3">
                        {colName}:
                      </span>
                      <div className="text-base text-right flex-1 min-w-0">
                        {colName === "Actions" ? (
                          <div className="flex justify-end">
                            {row.actions}
                          </div>
                        ) : (
                          <span className="break-words">{cellValue}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;




