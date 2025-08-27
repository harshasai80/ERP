import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const DragDropCSVUpload = ({ onChange }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles(acceptedFiles);
      if (onChange) {
        onChange(acceptedFiles[0]);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".csv",
    multiple: false,
  });

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow border border-gray-700 text-white text-sm">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-emerald-500 p-8 cursor-pointer rounded-lg transition-all hover:bg-gray-700"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-emerald-400 font-medium">
            Drop the CSV file here...
          </p>
        ) : (
          <p className="text-gray-300">
            Drag and drop a CSV file here, or click to select
          </p>
        )}
      </div>
    </div>
  );
};

export default DragDropCSVUpload;
