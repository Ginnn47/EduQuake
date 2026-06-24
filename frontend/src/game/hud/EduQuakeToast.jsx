const EduQuakeToast = ({ toasts = [] }) => {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="eduquake-toast-stack" aria-live="polite">
      {toasts.slice(-3).map((toast) => (
        <p key={toast.id}>{toast.text}</p>
      ))}
    </div>
  );
};

export default EduQuakeToast;
