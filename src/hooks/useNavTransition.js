import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Manual route transition: exit animation → navigate → enter animation.
export function useNavTransition() {
  const navigate = useNavigate();
  return useCallback((path) => {
    const app = document.querySelector('.app');
    if (app?.classList.contains('nav-exiting')) return;
    window.dispatchEvent(new CustomEvent('starfield:route'));
    document.documentElement.classList.add('nav-done');
    if (app) {
      app.classList.add('nav-exiting');
      setTimeout(() => navigate(path), 250);
    } else {
      navigate(path);
    }
  }, [navigate]);
}