import { useEffect, useState } from 'react';
export default function useFetchJson(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    const {
      signal
    } = controller;
    const fetchData = async () => {
      try {
        const res = await fetch(url, {
          signal
        });
        if (!res.ok) {
          throw new Error(`Fetch failed with status ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name === 'AbortError') return; // fetch 중단
        setError(err.message || 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      controller.abort(); // 컴포넌트 언마운트 시 fetch 취소
    };
  }, [url]);
  return {
    data,
    loading,
    error
  };
}