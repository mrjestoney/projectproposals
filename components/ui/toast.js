"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const ToastContext = createContext(() => {});

/** Call useToast() to get show(message). Wrap the app (or a prototype) in <ToastProvider>. */
export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);

  const show = useCallback((text) => {
    setMessage({ text, id: Date.now() });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2800);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-group z-50 flex justify-center px-base pb-[env(safe-area-inset-bottom)]"
      >
        {message ? (
          <div key={message.id} className="animate-rise flex max-w-md items-center gap-tight rounded-full bg-ink px-group py-tight text-sm font-medium text-panel shadow-pop">
            <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
            {message.text}
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}
