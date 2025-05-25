import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-success";
      case "error":
        return "bg-error";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div
      className={`${getBackgroundColor()} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {getIcon()}
      <span className="flex-1">{message}</span>
      <button
        onClick={handleClose}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
