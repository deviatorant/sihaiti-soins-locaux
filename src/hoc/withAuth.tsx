
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';

// HOC for route protection
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  guestsAllowed = false
) => {
  const WithAuth: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        toast({
          title: t('auth.authRequired'),
          description: t('auth.pleaseLogin'),
          variant: 'destructive',
        });
        navigate('/login');
      } else if (!isLoading && !guestsAllowed && user?.isGuest) {
        toast({
          title: t('auth.fullAccountRequired'),
          description: t('auth.pleaseCreateAccount'),
          variant: 'destructive',
        });
        navigate('/login');
      }
    }, [isLoading, isAuthenticated, user, navigate, t]);

    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">{t('common.loading')}</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    if (!guestsAllowed && user?.isGuest) {
      return null;
    }

    return <Component {...props} />;
  };

  return WithAuth;
};

export default withAuth;
