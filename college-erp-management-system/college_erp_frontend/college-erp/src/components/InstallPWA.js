import { useEffect, useState } from "react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBtn, setShowBtn] = useState(false);
  const [showIosMsg, setShowIosMsg] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setShowBtn(false);
      setShowIosMsg(false);
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIos && isSafari) {
      setShowIosMsg(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setShowBtn(false);
      setShowIosMsg(false);
      triggerToast("🎉 App installed successfully!");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      triggerToast("✅ Thanks for installing!");
    } else {
      triggerToast("ℹ️ Install dismissed.");
    }

    setDeferredPrompt(null);
    setShowBtn(false);
  };

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="mt-6 text-center">
      {showBtn && (
        <button
          onClick={handleInstallClick}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition"
        >
          Install App
        </button>
      )}

      {showIosMsg && (
        <div className="mt-4 p-3 rounded-xl bg-gray-100 text-sm text-gray-700 max-w-xs mx-auto shadow">
          📲 To install this app:
          <br />
          Tap <strong>Share</strong> → <strong>Add to Home Screen</strong>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
          {toast}
        </div>
      )}
    </div>
  );
}
