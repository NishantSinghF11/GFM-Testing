"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface MessageButtonProps {
  receiverId: string;
  receiverName: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function MessageButton({ receiverId, receiverName, className = 'btn btn-primary', style }: MessageButtonProps) {
  const router = useRouter();

  const handleClick = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.id === receiverId) {
      router.push('/messages');
      return;
    }

    // Send a starter message if no conversation exists
    const { data: existing } = await supabase
      .from('messages')
      .select('id')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
      .limit(1);

    if (!existing || existing.length === 0) {
      await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: receiverId,
        content: `Hi ${receiverName}! I'm interested in working with you.`,
      });
    }

    router.push(`/messages?with=${receiverId}`);
  };

  return (
    <button className={className} style={style} onClick={handleClick}>
      <i className="fa-regular fa-envelope"></i> Contact Me
    </button>
  );
}
