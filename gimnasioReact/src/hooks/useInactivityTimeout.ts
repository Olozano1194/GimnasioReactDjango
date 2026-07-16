import { useEffect, useRef, useCallback } from 'react';

const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

/**
 * Ejecuta `onTimeout` cuando el usuario lleva `timeoutMinutes` sin actividad.
 * Se reinicia automáticamente con mouse, teclado, scroll, clics o touch.
 */
export function useInactivityTimeout(
  timeoutMinutes: number,
  onTimeout: () => void,
  enabled: boolean = true
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTimeoutRef = useRef(onTimeout);
  // Siempre tener el último callback sin reiniciar el efecto
  onTimeoutRef.current = onTimeout;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (enabled) {
      timerRef.current = setTimeout(() => {
        onTimeoutRef.current();
      }, timeoutMinutes * 60 * 1000);
    }
  }, [timeoutMinutes, enabled, clearTimer]);

  useEffect(() => {
    if (!enabled) {
      clearTimer();
      return;
    }

    // Timer inicial
    startTimer();

    // Escuchar eventos de actividad
    const handleActivity = () => startTimer();
    ACTIVITY_EVENTS.forEach(event =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    return () => {
      ACTIVITY_EVENTS.forEach(event =>
        window.removeEventListener(event, handleActivity)
      );
      clearTimer();
    };
  }, [enabled, startTimer, clearTimer]);

  return { resetTimer: startTimer };
}
