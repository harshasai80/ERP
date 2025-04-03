function SyllabusTab() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-200 text-gray-900 p-5">
      <div className="bg-white shadow-2xl rounded-3xl p-10 text-center max-w-lg border border-gray-300">
        <h1 className="text-4xl font-extrabold text-[#2D2A43] mb-4">📘 Syllabus</h1>
        <p className="mt-2 text-lg text-gray-700">
          We are <b className="text-[#FF4C4C] animate-pulse">Under Progress...</b>
        </p>
        <p className="mt-3 text-sm text-gray-500 italic">Stay tuned for updates!</p>
      </div>
    </div>
  );
}

export default SyllabusTab;
