import { useState, useEffect } from 'react';
import { fetchSahabaList } from '../services/api';

export const useSahabaData = () => {
  const [sahaba, setSahaba] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSahaba = async () => {
      try {
        setLoading(true);
        const data = await fetchSahabaList();
        setSahaba(data);
        setError(null);
      } catch (err) {
        console.error('Error in useSahabaData:', err);
        setError('فشل في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    loadSahaba();
  }, []);

  return { sahaba, loading, error };
};