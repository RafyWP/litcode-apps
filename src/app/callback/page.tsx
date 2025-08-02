// src/app/callback/page.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

const CallbackPage: React.FC = () => {
  const searchParams = useSearchParams();
  const authCode = searchParams.get('authCode');
  const email = searchParams.get('email');
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authCode && email) {
      login(authCode, email).then(() => {
        setIsLoading(false);
        router.push('/alink-pro');
      });
    }
  }, [authCode, email, login, router]);

  return (
    <div>{isLoading ? <p>Loading...</p> : <p>Callback processed.</p>}</div>
  );
};

export default CallbackPage;