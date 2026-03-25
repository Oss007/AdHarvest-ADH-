import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Play, Droplets, X, Check } from 'lucide-react';

interface AdWatcherProps {
  onComplete: () => void;  // Now calls mintADH + burnADH
  adsLeft: number;
  setAdsLeft: (n: number) => void;  // NEW: Decrement ads
}

const AdWatcher: React.FC<AdWatcherProps> = ({ onComplete, adsLeft, setAdsLeft }) => {
  const { t } = useTranslation();
  const [isWatching, setIsWatching] = useState(false);
  const [adError, setAdError] = useState(false);

  const startAd = async () => {
    if (adsLeft > 0 && window.show_10780044) {  // Your Monetag function!
      try {
        setIsWatching(true);
        setAdError(false);
        
        // 🔥 REAL MONETAG REWARDED AD
        await window.show_10780044({ type: 'rewarded' });
        
        // ✅ AD COMPLETED SUCCESSFULLY
        setAdsLeft(adsLeft - 1);  // Decrement daily limit
        onComplete();  // Mint 10 ADH + burn 2
        setIsWatching(false);
      } catch (e) {
        // ❌ User closed/skipped ad → NO REWARD
        setIsWatching(false);
        setAdError(true);
        console.log('Ad skipped:', e);
      }
    } else {
      alert('No more ads today or SDK not loaded');
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={startAd}
        disabled={adsLeft === 0 || isWatching}
        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg transition-all ${
          adsLeft === 0 || isWatching
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-accent active:scale-95'
        }`}
      >
        {isWatching ? (
          <>
            <Droplets className="animate-spin" />
            {t('watching_ad')}
          </>
        ) : (
          <>
            <Play fill="currentColor" />
            {t('watch_ad')} ({adsLeft} left)
          </>
        )}
      </button>

      {/* SUCCESS/ERROR TOASTS */}
      <AnimatePresence>
        {adError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-2 p-3 bg-red-500 text-white rounded-xl flex items-center gap-2"
          >
            <X size={20} />
            Watch full ad to earn ADH!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdWatcher;
