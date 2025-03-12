import React from 'react';

function Alert({ message, type }) {
  const alertClasses = {
    success: "bg-green-100 text-green-800 border border-green-200",
    error: "bg-red-100 text-red-800 border border-red-200"
  };

  return (
    <div className={`p-4 my-4 rounded-md ${alertClasses[type]}`}>
      {message}
    </div>
  );
}

export default Alert;