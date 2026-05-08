import { useCallback, useEffect, useState } from 'react';
import { guidesService, type Guide } from '@/services/guidesService';

export function useGuides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await guidesService.list();
      setGuides(data);
      setError(null);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load guides');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const prepend = useCallback((g: Guide) => setGuides((prev) => [g, ...prev]), []);

  return { guides, loading, error, refresh, prepend };
}
