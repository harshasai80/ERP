import React from "react";

const DataTable = ({ columns, data }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden mt-6 text-white">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="w-full table-auto">
          <thead>
            <tr>
              {columns.map((column, index) => {
                const colName =
                  typeof column === "string" ? column : column.name;
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
              <tr
                key={rowIndex}
                className="hover:bg-gray-700 transition-colors"
              >
                {columns.map((column, colIndex) => {
                  const colName =
                    typeof column === "string" ? column : column.name;
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

      {/* Mobile Card View */}
      <div className="md:hidden">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors"
          >
            {columns.map((column, colIndex) => {
              const colName = typeof column === "string" ? column : column.name;
              const key = colName.toLowerCase().replace(/ /g, "");
              const cellValue = row[key] || "";

              // Skip empty values except for Actions column
              if (!cellValue && colName !== "Actions") return null;

              return (
                <div key={colIndex} className="mb-2 last:mb-0">
                  {colName === "Actions" ? (
                    <div className="pt-3 mt-3 border-t border-gray-600">
                      {row.actions}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="font-semibold text-emerald-400 text-sm uppercase mb-1 sm:mb-0">
                        {colName}:
                      </span>
                      <span className="text-sm text-white break-words">
                        {cellValue}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;
