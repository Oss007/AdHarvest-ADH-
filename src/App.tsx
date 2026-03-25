import React, { useState, useEffect, useCallback } from 'react';
import { TonConnectUIProvider, TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Wheat, Coins, Flame, Settings, User as UserIcon, Home, Users as UsersIcon, Globe, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

import './lib/i18n';
import FarmField from './components/FarmField';
import AdWatcher from './components/AdWatcher';
import ReferralSystem from './components/ReferralSystem';
import Profile from './components/Profile';
import { rewardUser } from './lib/ton';  // Your real TON!
import { handleReferral } from './lib/referral';  // Fixed referral

declare global {
  interface Window {
    Telegram: any;  // Fixed typing
    show_10780044: any;  // Your Monetag!
  }
}

const AppContent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const userAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  
  // STATES
  const [activeTab, setActiveTab] = useState<'home' | 'referrals' | 'profile'>('home');
  const [balance, setBalance] = useState(0);
  const [adsLeft, setAdsLeft] = useState(10);
  const [referrals, setReferrals] = useState<string[]>([]);
  const [extraAdsUnlocked, setExtraAdsUnlocked] = useState(0);  // NEW!
  const [cropState, setCropState] = useState<'barren' | 'watered' | 'harvested'>('barren');
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalBurned: 0,
    farmLevel: 1,
    adsWatched: 0,
    invites: 0  // NEW
  });

  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || 'DEV_USER_123';
  const totalDailyAds = 10 + extraAdsUnlocked;  // ✅ Base + referrals!

  // 🔥 DAILY RESET + LOAD STATE (FIX #3)
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`adh_state_${userId}`);
    
    if (saved) {
      const parsed = JSON.parse(saved);
      setBalance(parsed.balance || 0);
      setReferrals(parsed.referrals || []);
      setExtraAdsUnlocked(parsed.extraAdsUnlocked || 0);
      setStats(parsed.stats || stats);
      
      // ✅ DAILY RESET LOGIC
      const lastReset = localStorage.getItem(`lastReset_${userId}`);
      if (lastReset !== today) {
        localStorage.setItem(`lastReset_${userId}`, today);
        setAdsLeft(totalDailyAds);  // Reset to 10 + extra!
        localStorage.setItem(`adsLeft_${userId}`, totalDailyAds.toString());
      } else {
        setAdsLeft(parseInt(localStorage.getItem(`adsLeft_${userId}`) || totalDailyAds.toString()));
      }
    } else {
      setAdsLeft(totalDailyAds);  // First time
    }
    
    // Telegram setup
    window.Telegram?.WebApp?.ready();
    window.Telegram?.WebApp?.expand();
    window.Telegram?.WebApp?.setHeaderColor('#4CAF50');

    // 🔥 REFERRAL CHECK
    handleReferral((newReferrer) => {
      if (!referrals.includes(newReferrer)) {
        const newReferrals = [...referrals, newReferrer];
        const newExtra = newReferrals.length * 5;
        setReferrals(newReferrals);
        setExtraAdsUnlocked(newExtra);
        setAdsLeft(totalDailyAds);  // Refresh limit
        localStorage.setItem(`extraAdsUnlocked_${userId}`, newExtra.toString());
      }
    });
  }, [userId, extraAdsUnlocked]);

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

  // ✅ FIXED AD COMPLETE (Real TON + Stats)
  const handleAdComplete = useCallback(async () => {
    setCropState('watered');
    
    // Real TON reward (your fixed lib!)
    if (userAddress && tonConnectUI) {
      const userJettonWallet = Address.parse('YOUR-JETTON-WALLET');  // Get from TON
      const success = await rewardUser(tonConnectUI, userJettonWallet);
      
      if (success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        updateStats(10, 2);
      }
    } else {
      // Fallback demo
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        updateStats(10, 2);
      }, 1500);
    }
    
    setAdsLeft(prev => Math.max(0, prev - 1));
    setCropState('harvested');
  }, [userAddress, tonConnectUI]);

  const updateStats = (earned: number, burned: number) => {
    setBalance(prev => prev + earned);
    setStats(prev => ({
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

  // ... rest of your JSX stays SAME (tabs, header, nav perfect!)

  return (
    // Your existing JSX - NO CHANGES NEEDED
    // Just pass extraAdsUnlocked to Profile/ReferralSystem
    <ReferralSystem 
      userId={userId} 
      referrals={referrals}
      extraAdsUnlocked={extraAdsUnlocked}
      setExtraAdsUnlocked={setExtraAdsUnlocked}
    />
    <Profile stats={{...stats, invites: referrals.length}} />
    <AdWatcher 
      onComplete={handleAdComplete} 
      adsLeft={adsLeft} 
      setAdsLeft={setAdsLeft}
    />
  );
};

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl="YOUR-MANIFEST-URL">
      <AppContent />
    </TonConnectUIProvider>
  );
}
