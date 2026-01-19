import { useEffect } from "react";

export default function Toast({
  message,
  type = "success",
  autoClose = true,
  onClose,
}) {
  useEffect(() => {
    if (autoClose) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [onClose]);
  return (
    <div className={`toast ${type}`}>
      {message}
      {!autoClose && (
        <a
          className="close"
          onClick={() => {
            if (!autoClose) {
              onClose();
            }
          }}
        >
          Close
        </a>
      )}
    </div>
  );
}
