import { useState, useEffect } from 'react';
import api from '../api/axiosClient';

type Status = 'checking' | 'online' | 'offline';

export function useApiStatus(intervalMs = 30_000) {
  const [status, setStatus] = useState<Status>('checking');

  const check = async () => {
    try {
      // Ping the leads list endpoint — a lightweight GET
      await api.get('/leads', { params: { _limit: 1 }, timeout: 4000 });
      setStatus('online');
    } catch {
      setStatus('offline');
    }
  };

  useEffect(() => {
    check();
    const id = setInterval(check, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { status, recheck: check };
}
