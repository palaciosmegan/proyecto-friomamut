import { useCallback, useState } from "react";

type CalibradorResponse = {
  ok: boolean;
  message: string;
};

export function useCalibradorResponse() {
  const [response, setResponse] = useState<CalibradorResponse | null>(null);
  const [toastKey, setToastKey] = useState(0);

  const wrapFunction = useCallback(
    async (fn: () => Promise<void>) => {
      try {
        await fn();
        setResponse({ ok: true, message: "Guardado correctamente" });
      } catch (error) {
        const raw = error instanceof Error ? error.message : "Error, no se pudo guardar"
        setResponse({ ok: false, message: raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() });
      }
      setToastKey(prev => prev + 1);
    },
    [],
  );

  const clearMessage = useCallback(() => setResponse(null), []);

  return { response, toastKey, wrapFunction, clearMessage };
}
