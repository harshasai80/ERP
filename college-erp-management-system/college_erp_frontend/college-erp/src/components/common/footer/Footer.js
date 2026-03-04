import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer className="bg-academic border-t-2 border-gold py-10">
      <div className="container max-w-[1500px] mx-auto px-10 flex flex-col md:flex-row items-center justify-between text-base font-black uppercase tracking-[0.4em] text-faded-ink space-y-8 md:space-y-0">

        {/* College Info */}
        <span className="text-white classic-heading text-base tracking-widest text-center md:text-left leading-tight">
          Sanjay Gandhi Polytechnic <br />
          <span className="text-gold">Administrative Registry</span>
        </span>

        {/* Links */}
        <div className="flex items-center space-x-12">
          {[
            { name: "Registry Contact", path: "/contact-details" },
            { name: "Institutional Profile", path: "/about" },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigation(item.path)}
              className="text-white hover:text-gold transition-colors duration-300 border-b border-transparent hover:border-gold pb-1"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Copyright */}
        <span className="text-faded-ink opacity-40 text-center md:text-right text-base">
          © MMXXV SANJAY GANDHI POLYTECHNIC • REGISTRY OFFICE <br />
          Institutional Governance System v9.0
        </span>
      </div>
    </footer>
  );
}




