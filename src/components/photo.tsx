'use client';
import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
/** Private profile photos are resolved only for signed-in members. */
export default function Photo(props: ImageProps) {
  const source = typeof props.src === 'string' ? props.src : '';
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/avatars/`;
  const privatePhoto = source.startsWith(prefix);
  const [signed, setSigned] = useState('');
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!privatePhoto || !supabase) return;
    let active = true;
    async function refresh() {
      const { data } = await supabase!.storage.from('avatars').createSignedUrl(source.slice(prefix.length), 600);
      if (active) setSigned(data?.signedUrl || '');
    }
    void refresh();
    const timer = setInterval(() => void refresh(), 480000);
    return () => { active = false; clearInterval(timer); };
  }, [privatePhoto, source, prefix]);
  const fallback = failed || (privatePhoto && !signed);
  return <Image {...props} unoptimized src={fallback ? '/images/mountain.svg' : privatePhoto ? signed : props.src} alt={fallback ? 'Illustración de montaña · fotografía no disponible' : props.alt} onError={() => setFailed(true)} />;
}
