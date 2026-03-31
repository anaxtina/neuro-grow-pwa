/**
 * Index — Main App Controller (SPA Router)
 * WHY single-page with state machine: Avoids page reloads for PWA feel.
 * The screen state acts as a finite state machine, making transitions
 * predictable and debuggable. Each screen is lazy-loaded conceptually.
 */
import { useState, useCallback, useEffect } from 'react';
import type { UserData } from '@/lib/ml';
import { loadOnboardingState, saveOnboardingState, saveUserData, loadUserData } from '@/lib/onboarding-state';
import SplashScreen from '@/components/neurogrow/SplashScreen';
import TermsScreen from '@/components/neurogrow/TermsScreen';
import OnboardingFlow from '@/components/neurogrow/OnboardingFlow';
import PaywallScreen from '@/components/neurogrow/PaywallScreen';
import Dashboard from '@/components/neurogrow/Dashboard';

type AppScreen = 'splash' | 'terms' | 'onboarding' | 'paywall' | 'dashboard';

const Index = () => {
  // WHY: Check localStorage on mount to restore returning users
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [userData, setUserData] = useState<Partial<UserData>>({});

  useEffect(() => {
    const saved = loadOnboardingState();
    const savedUser = loadUserData();
    if (saved?.completed && savedUser) {
      // Returning user: skip to dashboard after splash
      setUserData(savedUser);
      setTimeout(() => setScreen('dashboard'), 2000);
    }
  }, []);

  const handleSplashComplete = useCallback(() => {
    const saved = loadOnboardingState();
    if (saved?.completed) {
      setScreen('dashboard');
    } else {
      setScreen('terms');
    }
  }, []);

  const handleTermsAccept = useCallback(() => {
    setScreen('onboarding');
  }, []);

  const handleOnboardingComplete = useCallback((data: Partial<UserData>) => {
    setUserData(data);
    saveUserData(data);
    setScreen('paywall');
  }, []);

  const handlePlanSelect = useCallback((plan: 'trial' | 'monthly' | 'annual') => {
    // WHY: Save completed state so user skips onboarding on return
    saveOnboardingState({
      currentStep: 0,
      totalSteps: 5,
      userData,
      completed: true,
      termsAccepted: true,
    });
    console.log(`Plan selected: ${plan}`);
    setScreen('dashboard');
  }, [userData]);

  return (
    <>
      {screen === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      {screen === 'terms' && <TermsScreen onAccept={handleTermsAccept} />}
      {screen === 'onboarding' && <OnboardingFlow onComplete={handleOnboardingComplete} />}
      {screen === 'paywall' && <PaywallScreen userName={userData.name || 'Amigo'} onSelect={handlePlanSelect} />}
      {screen === 'dashboard' && <Dashboard userData={userData} />}
    </>
  );
};

export default Index;
