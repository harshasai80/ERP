import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 py-3">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 space-y-2 md:space-y-0">
        
        {/* College Info */}
        <span className="text-emerald-300 font-semibold text-base text-center md:text-left">
          Sanjay Gandhi Polytechnic Ballari
        </span>
        {/* Copyright */}
        <span className="text-xs text-gray-500 text-center md:text-right">
            © 2025 Sanjay Gandhi Polytechnic
        </span>

        {/* Links + Copyright */}
        <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-2 md:space-y-0">
          {/* Links */}
          <div className="flex space-x-4">
            {[
              { name: "Contact", path: "/contact-details" },
              { name: "About", path: "/about" },
              { name: "Team", path: "/team" },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleNavigation(item.path)}
                className="hover:text-white transition"
              >
                {item.name}
              </button>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
