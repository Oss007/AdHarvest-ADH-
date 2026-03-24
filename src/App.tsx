import React, { useState, useEffect, useCallback } from 'react';
import { TonConnectUIProvider, TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Wheat, Coins, Flame, Settings, User as UserIcon, Home, Users as UsersIcon, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

import './lib/i18n';
import FarmField from './components/FarmField';
import AdWatcher from './components/AdWatcher';
import ReferralSystem from './components/ReferralSystem';
import Profile from './components/Profile';
import { createMintTransfer, ADH_MINT_AMOUNT, ADH_BURN_AMOUNT } from './lib/ton';

// Telegram WebApp API type
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            username: string;
            first_name: string;
          };
          start_param?: string;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
        };
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}

import { handleReferral } from './lib/referral';

const AppContent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const userAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  
  const [activeTab, setActiveTab] = useState<'home' | 'referrals' | 'profile'>('home');
  const [balance, setBalance] = useState(0);
  const [adsLeft, setAdsLeft] = useState(10);
  const [referrals, setReferrals] = useState<string[]>([]);
  const [cropState, setCropState] = useState<'barren' | 'watered' | 'harvested'>('barren');
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalBurned: 0,
    farmLevel: 1,
    adsWatched: 0,
  });

  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || 'DEV_USER_123';

  // Load state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(`adh_state_${userId}`);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setBalance(parsed.balance || 0);
      setAdsLeft(parsed.adsLeft || 10);
      setReferrals(parsed.referrals || []);
      setStats(parsed.stats || { totalEarned: 0, totalBurned: 0, farmLevel: 1, adsWatched: 0 });
    }
    
    window.Telegram?.WebApp?.ready();
    window.Telegram?.WebApp?.expand();
    window.Telegram?.WebApp?.setHeaderColor('#4CAF50');

    // Handle referral logic
    handleReferral((referrerId) => {
      // In a real app, we'd notify the backend
      console.log(`User referred by: ${referrerId}`);
    });
  }, [userId]);

  // Save state to localStorage
  useEffect(() => {
    const state = { balance, adsLeft, referrals, stats };
    localStorage.setItem(`adh_state_${userId}`, JSON.stringify(state));
  }, [balance, adsLeft, referrals, stats, userId]);

  const handleAdComplete = useCallback(() => {
    setCropState('watered');
    setTimeout(() => setCropState('harvested'), 2000);
    setAdsLeft((prev) => prev - 1);
    setStats((prev) => ({
      ...prev,
      adsWatched: prev.adsWatched + 1,
      farmLevel: Math.floor((prev.adsWatched + 1) / 10) + 1,
    }));
  }, []);

  const handleHarvest = async () => {
    if (userAddress) {
      try {
        // In a real app, we'd send the transaction here
        // const transaction = createMintTransfer(userAddress, ADH_MINT_AMOUNT);
        // await tonConnectUI.sendTransaction(transaction);
        
        // For demo, we'll simulate success
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4CAF50', '#FFEB3B', '#FF5722']
        });

        setBalance((prev) => prev + ADH_MINT_AMOUNT);
        setStats((prev) => ({
          ...prev,
          totalEarned: prev.totalEarned + ADH_MINT_AMOUNT,
          totalBurned: prev.totalBurned + ADH_BURN_AMOUNT,
        }));
        setCropState('barren');
      } catch (e) {
        console.error('Transaction failed', e);
      }
    } else {
      // Fallback for no wallet
      setBalance((prev) => prev + ADH_MINT_AMOUNT);
      setStats((prev) => ({
        ...prev,
        totalEarned: prev.totalEarned + ADH_MINT_AMOUNT,
        totalBurned: prev.totalBurned + ADH_BURN_AMOUNT,
      }));
      setCropState('barren');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#FFEB3B', '#FF5722']
      });
    }
  };

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLng);
  };

  const maxAds = 10 + (referrals.length * 5);

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-primary p-6 rounded-b-[40px] shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <Wheat size={120} />
        </div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Wheat size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">{t('app_name')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleLanguage}
              className="p-2 bg-white/20 rounded-xl backdrop-blur-md hover:bg-white/30 transition-all"
            >
              <Globe size={20} />
            </button>
            <TonConnectButton />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
            <div className="flex items-center gap-1 text-white/70 mb-1">
              <Coins size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t('balance')}</span>
            </div>
            <p className="text-xl font-black">{balance} ADH</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
            <div className="flex items-center gap-1 text-white/70 mb-1">
              <Flame size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Burned</span>
            </div>
            <p className="text-xl font-black">{stats.totalBurned} ADH</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
            <div className="flex items-center gap-1 text-white/70 mb-1">
              <Settings size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t('ads_left')}</span>
            </div>
            <p className="text-xl font-black">{adsLeft}/{maxAds}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4"
            >
              <div className="bg-white rounded-[40px] shadow-lg overflow-hidden border border-gray-100 mb-6">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">My Farm</h2>
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase">
                    Level {stats.farmLevel}
                  </span>
                </div>
                <FarmField cropState={cropState} onHarvest={handleHarvest} />
              </div>
              
              <AdWatcher onComplete={handleAdComplete} adsLeft={adsLeft} />
              
              <div className="px-4 mt-4">
                <div className="p-4 bg-gold/10 rounded-3xl border border-gold/20 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-gray-800 shadow-md">
                    <Coins size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Daily Bonus Available!</p>
                    <p className="text-xs text-gray-500">Watch ads to mint 10 ADH every time.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'referrals' && (
            <motion.div
              key="referrals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ReferralSystem userId={userId} referrals={referrals} />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Profile stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-around items-center z-40">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-primary scale-110' : 'text-gray-400'}`}
        >
          <Home size={24} strokeWidth={activeTab === 'home' ? 3 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t('harvest')}</span>
        </button>
        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'referrals' ? 'text-primary scale-110' : 'text-gray-400'}`}
        >
          <UsersIcon size={24} strokeWidth={activeTab === 'referrals' ? 3 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t('invite_friends')}</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-primary scale-110' : 'text-gray-400'}`}
        >
          <UserIcon size={24} strokeWidth={activeTab === 'profile' ? 3 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t('profile')}</span>
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://ais-pre-5sa4citq77yruxcjdlezfr-255228596859.europe-west1.run.app/tonconnect-manifest.json">
      <AppContent />
    </TonConnectUIProvider>
  );
}
