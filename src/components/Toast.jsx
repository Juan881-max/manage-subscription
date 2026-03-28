import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Toast({ notification }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [notification]);

  if (!notification && !isVisible) return null;

  const icons = {
    success: <CheckCircle className="text-accent-green" size={20} />,
    error: <AlertCircle className="text-accent-red" size={20} />,
    info: <Info className="text-accent-blue" size={20} />
  };

  return (
    <div className={`toast-container ${isVisible ? 'show' : ''} ${notification?.type || 'success'}`}>
      <div className="toast-icon">
        {icons[notification?.type] || icons.success}
      </div>
      <div className="toast-content">
        {notification?.message}
      </div>
    </div>
  );
}
