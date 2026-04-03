import { useEffect, useCallback } from "react";

const DATA_REFRESH_EVENT = "data-refresh";

export function useDataRefresh(callback: () => void) {
  useEffect(() => {
    const handleRefresh = () => {
      callback();
    };

    window.addEventListener(DATA_REFRESH_EVENT, handleRefresh);
    return () => {
      window.removeEventListener(DATA_REFRESH_EVENT, handleRefresh);
    };
  }, [callback]);
}

export function triggerDataRefresh() {
  window.dispatchEvent(new Event(DATA_REFRESH_EVENT));
}
