import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TonConnectUIProvider, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { Address } from '@ton/core';

import './lib/i18n';
import FarmField from './components/FarmField';
import AdWatcher from './components/AdWatcher';
import ReferralSystem from './components/ReferralSystem';
import Profile from './components/Profile';

import { rewardUser } from './lib/ton';
import { handleReferral } from './lib/referral';

declare global {
  interface Window {
    Telegram: any;
    show_10780044: any;
  }
}

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const userAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  // STATES
  const [balance, setBalance] = useState(0);
  const [adsLeft, setAdsLeft] = useState(10);
  const [referrals, setReferrals] = useState<string[]>([]);
  const [extraAdsUnlocked, setExtraAdsUnlocked] = useState(0);
  const [cropState, setCropState] = useState<'barren' | 'watered' | 'harvested'>('barren');

  const [stats, setStats] = useState({
    totalEarned: 0,
    totalBurned: 0,
    farmLevel: 1,
    adsWatched: 0,
    invites: 0
  });

  const userId =
    window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || 'DEV_USER_123';

  const totalDailyAds = useMemo(
    () => 10 + extraAdsUnlocked,
    [extraAdsUnlocked]
  );

  // 🔥 LOAD + DAILY RESET (runs once)
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`adh_state_${userId}`);

    if (saved) {
      const parsed = JSON.parse(saved);

      setBalance(parsed.balance || 0);
      setReferrals(parsed.referrals || []);
      setExtraAdsUnlocked(parsed.extraAdsUnlocked || 0);
      setStats(parsed.stats || stats);

      const lastReset = localStorage.getItem(`lastReset_${userId}`);

      if (lastReset !== today) {
        localStorage.setItem(`lastReset_${userId}`, today);
        setAdsLeft(10 + (parsed.extraAdsUnlocked || 0));
      } else {
        setAdsLeft(
          parseInt(localStorage.getItem(`adsLeft_${userId}`) || '10')
        );
      }
    } else {
      setAdsLeft(10);
    }

    // Telegram safe init
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#4CAF50');
    }
  }, [userId]);

  // 🔥 REFERRAL HANDLER (run once)
  useEffect(() => {
    handleReferral((newReferrer) => {
      setReferrals((prev) => {
        if (prev.includes(newReferrer)) return prev;

        const updated = [...prev, newReferrer];
        const extra = updated.length * 5;

        setExtraAdsUnlocked(extra);
        setAdsLeft(10 + extra);

        return updated;
      });
    });
  }, []);

  // 💾 SAVE STATE
  useEffect(() => {
    const state = {
      balance,
      adsLeft,
      referrals,
      extraAdsUnlocked,
      stats
    };

    localStorage.setItem(`adh_state_${userId}`, JSON.stringify(state));
    localStorage.setItem(`adsLeft_${userId}`, adsLeft.toString());
  }, [balance, adsLeft, referrals, extraAdsUnlocked, stats, userId]);

  // ✅ AD COMPLETE
  const handleAdComplete = useCallback(async () => {
    if (adsLeft <= 0) return;

    setCropState('watered');

    try {
      if (userAddress && tonConnectUI) {
        const userJettonWallet = Address.parse('YOUR-JETTON-WALLET');

        const success = await rewardUser(tonConnectUI, userJettonWallet);

        if (!success) throw new Error('Transaction failed');

        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        updateStats(10, 2);
      } else {
        // fallback demo
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          updateStats(10, 2);
        }, 1500);
      }

      setAdsLeft((prev) => Math.max(0, prev - 1));
      setCropState('harvested');
    } catch (err) {
      console.error('Reward failed:', err);
    }
  }, [adsLeft, userAddress, tonConnectUI]);

  const updateStats = (earned: number, burned: number) => {
    setBalance((prev) => prev + earned);

    setStats((prev) => ({
      ...prev,
      totalEarned: prev.totalEarned + earned,
      totalBurned: prev.totalBurned + burned,
      adsWatched: prev.adsWatched + 1,
      farmLevel: Math.floor((prev.adsWatched + 1) / 10) + 1,
      invites: referrals.length
    }));
  };

  const handleHarvest = () => {
    setCropState('barren');
  };

  return (
    <>
      <FarmField cropState={cropState} onHarvest={handleHarvest} />

      <ReferralSystem
        userId={userId}
        referrals={referrals}
        extraAdsUnlocked={extraAdsUnlocked}
        setExtraAdsUnlocked={setExtraAdsUnlocked}
      />

      <Profile stats={{ ...stats, invites: referrals.length }} />

      <AdWatcher
        onComplete={handleAdComplete}
        adsLeft={adsLeft}
        setAdsLeft={setAdsLeft}
      />
    </>
  );
};

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl="YOUR-MANIFEST-URL">
      <AppContent />
    </TonConnectUIProvider>
  );
}
