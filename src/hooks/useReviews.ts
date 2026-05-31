import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export interface Review {
  id: string;
  nombre: string;
  comentario: string;
  created_at: string;
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setReviews(data);
      setLoading(false);
    };

    fetchReviews();

    // Realtime - aparece al instante
    const channelId = `reviews-realtime-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reviews'
      }, () => {
        fetchReviews();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { reviews, loading };
}
