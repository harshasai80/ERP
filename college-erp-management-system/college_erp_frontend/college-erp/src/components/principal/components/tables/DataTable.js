import React from "react";

const DataTable = ({ columns, data }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-emerald-500/10 overflow-hidden mt-8 text-gray-900">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-emerald-500/[0.03]">
              {columns.map((column, index) => {
                const colName =
                  typeof column === "string" ? column : column.name;
                return (
                  <th
                    key={index}
                    className="p-6 text-center text-base uppercase font-bold tracking-[0.2em] text-emerald-600 border-b border-gray-100"
                  >
                    {colName}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-emerald-500/[0.02] transition-colors group"
              >
                {columns.map((column, colIndex) => {
                  const colName =
                    typeof column === "string" ? column : column.name;
                  const key = colName.toLowerCase().replace(/ /g, "");
                  const cellValue = row[key] || "";

                  return (
                    <td
                      key={colIndex}
                      className="p-6 text-base text-center font-medium text-gray-700"
                    >
                      {colName === "Actions" ? (
                        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                          {row.actions}
                        </div>
                      ) : cellValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-100">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="p-6 hover:bg-emerald-500/[0.02] transition-colors"
          >
            {columns.map((column, colIndex) => {
              const colName = typeof column === "string" ? column : column.name;
              const key = colName.toLowerCase().replace(/ /g, "");
              const cellValue = row[key] || "";

              // Skip empty values except for Actions column
              if (!cellValue && colName !== "Actions") return null;

              return (
                <div key={colIndex} className="mb-4 last:mb-0">
                  {colName === "Actions" ? (
                    <div className="pt-4 mt-4 border-t border-emerald-500/10">
                      {row.actions}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start">
                      <span className="font-bold text-emerald-600 text-base uppercase tracking-widest mb-1 sm:mb-0">
                        {colName}
                      </span>
                      <span className="text-base text-gray-800 font-medium break-words">
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
        <div className="p-16 text-center text-gray-400">
          <div className="text-4xl mb-4 opacity-20">📂</div>
          <p className="text-base font-bold uppercase tracking-widest">No data matching records</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;




