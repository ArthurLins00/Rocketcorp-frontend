import { useEffect, useState } from "react";

type ErrorModalProps = {
  message: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function ErrorModal({ message, isOpen, onClose }: ErrorModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setFadeOut(false);

      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setShouldRender(false);
          onClose();
        }, 500); 
      }, 3000); 

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed top-6 left-0 right-0 flex justify-center z-50 px-4 ${
        fadeOut ? "animate-fade-out" : "animate-fade-in"
      }`}
      style={{ animationDuration: "500ms" }}
    >
      <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-3 rounded shadow-lg w-auto max-w-full text-center">
        {message}
      </div>
    </div>
  );
}
