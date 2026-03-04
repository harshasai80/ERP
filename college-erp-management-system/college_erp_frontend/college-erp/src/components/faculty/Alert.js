import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";

function Alert({ message, type }) {
  const alertRef = useRef(null);
  const [visible, setVisible] = useState(true);

  const alertClasses = {
    success: "bg-green-100 text-green-800 border border-green-200",
    error: "bg-red-100 text-red-800 border border-red-200",
  };

  // Entry animation
  useEffect(() => {
    if (alertRef.current) {
      anime({
        targets: alertRef.current,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 600,
        easing: "easeOutExpo",
      });
    }

    // Exit animation after 4.5s (we give 500ms buffer before it disappears)
    const timer = setTimeout(() => {
      if (alertRef.current) {
        anime({
          targets: alertRef.current,
          opacity: [1, 0],
          translateY: [0, -10],
          duration: 500,
          easing: "easeInExpo",
          complete: () => setVisible(false),
        });
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  // Don’t render after exit animation is done
  if (!visible) return null;

  return (
    <div
      ref={alertRef}
      className={`p-4 my-4 rounded-md opacity-0 ${alertClasses[type]}`}
    >
      {message}
    </div>
  );
}

export default Alert;




