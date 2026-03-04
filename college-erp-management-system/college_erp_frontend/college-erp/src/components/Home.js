// Home.lazyed.jsx  (replace your current Home with this)
import React, { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HomeNavbar from "./common/navbars/HomeNavbar";
// Lazy-load heavy components so they don't inflate the initial bundle
const Marquee = React.lazy(() => import("./common/Marquee"));
const Footer = React.lazy(() => import("./common/footer/Footer"));

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-mesh text-academic font-sans overflow-x-hidden">
      <HomeNavbar />

      <Suspense fallback={<div aria-hidden className="h-8" />}>
        <Marquee />
      </Suspense>

      <main className="flex-grow container mx-auto px-8 py-16 sm:py-24 relative">
        {/* Academic Backdrop Decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-academic/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-burgundy/5 blur-[120px] rounded-full -z-10" />

        <motion.div
          className="flex flex-col items-center justify-center space-y-16 max-w-6xl mx-auto w-full px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>

          <div className="space-y-10 text-center">
            <div className="flex items-center gap-4 justify-center">
              <div className="h-[2px] w-12 bg-gold" />
              <h4 className="text-base font-bold text-gold uppercase tracking-[0.6em]">
                The Academic Registry
              </h4>
              <div className="h-[2px] w-12 bg-gold" />
            </div>
            <h2 className="text-6xl sm:text-8xl font-black text-academic classic-heading leading-tight">
              Sanjay Gandhi <br />
              <span className="text-burgundy">Polytechnic</span>
            </h2>

            <div className="mx-auto max-w-2xl">
              <p className="border-x-4 border-gold/30 px-8 py-2 text-faded-ink text-base font-medium leading-relaxed italic">
                "Upholding the standard of academic excellence through rigorous digital administration and institutional integrity."
              </p>
            </div>
          </div>

          <div className="w-full relative rounded-[3rem] overflow-hidden shadow-2xl border-b-8 border-gold/20">
            <img
              src="/college_campus.png"
              alt="Collegiate Campus"
              className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-academic/50 to-transparent" />
            <div className="absolute bottom-10 left-10 md:left-20 text-white">
              <div className="flex items-center gap-6 backdrop-blur-md bg-academic/40 p-10 rounded-2xl border-l-8 border-gold">
                <div className="w-16 h-16 bg-white/20 flex items-center justify-center text-white text-4xl rounded-xl">
                  🏛️
                </div>
                <div>
                  <p className="text-base font-bold text-gold/90 uppercase tracking-widest mb-1.5">Institutional Status</p>
                  <p className="text-2xl font-black text-white uppercase tracking-tighter">Operational Excellence</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              {
                title: "Registry & Attendance",
                desc: "Meticulous records of student participation and academic presence.",
                action: "Access Registry",
                route: "/login/student",
                icon: "📜",
                accent: "border-academic"
              },
              {
                title: "Scholastic Performance",
                desc: "Comprehensive evaluation transcripts and merit-based reporting.",
                action: "Review Credentials",
                route: "/login/student",
                icon: "🎓",
                accent: "border-burgundy"
              },
              {
                title: "Faculty Directorate",
                desc: "Administrative authority and departmental oversight protocols.",
                action: "Directorate Login",
                route: "/role-based-login",
                icon: "⚖️",
                accent: "border-gold"
              },
            ].map(({ title, desc, action, route, icon, accent }, i) => (
              <motion.div
                key={i}
                className={`lux-card p-10 group relative transition-all duration-500 hover:bg-academic/5 ${accent} h-full flex flex-col`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}>

                <div className="flex flex-col gap-6 relative z-10 h-full">
                  <div className="text-5xl opacity-80 group-hover:opacity-100 transition-opacity">
                    {icon}
                  </div>
                  <div className="space-y-4 flex-grow">
                    <h3 className="text-base font-black text-academic uppercase tracking-tight">
                      {title}
                    </h3>
                    <p className="text-faded-ink text-base font-medium leading-relaxed">{desc}</p>
                  </div>
                  <button
                    onClick={() => navigate(route)}
                    className="btn-primary py-3 px-8 text-base w-full mt-4">
                    {action}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center w-full pt-8">
            <p className="text-base font-bold text-faded-ink uppercase tracking-[0.6em] opacity-40">
              Institutional ERP Framework 4.2 • A.D. MMXXIV
            </p>
          </div>
        </motion.div>
      </main>

      <Suspense fallback={<div aria-hidden className="h-10" />}>
        <Footer />
      </Suspense>
    </div >
  );
};

export default Home;




