import React from "react";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-lg">
        <h1 className="text-3xl font-bold text-[#2D2A43]">Admin Dashboard</h1>
        <p className="mt-4 text-lg text-gray-600">
          We are <b className="text-[#FF4C4C]">Under Progress...</b>
        </p>
      </div>
    </div>
  );
}