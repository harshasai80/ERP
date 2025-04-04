import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const DragDropCSVUpload = ({ onChange }) => { // Accept onChange as a prop
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
    if (onChange) {
      onChange(acceptedFiles[0]); // Call onChange with the first file
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".csv",
    multiple: false, // Only allow one CSV file at a time
  });

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
      {/* Drag & Drop Area */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-10 cursor-pointer bg-gray-200 hover:bg-gray-300"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the CSV file here...</p>
        ) : (
          <p>Drag & drop a CSV file here, or click to select</p>
        )}
      </div>
    </div>
  );
};

export default DragDropCSVUpload;
