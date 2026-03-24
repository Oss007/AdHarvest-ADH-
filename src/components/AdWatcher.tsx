import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Play, Droplets, X } from 'lucide-react';

interface AdWatcherProps {
  onComplete: () => void;
  adsLeft: number;
}

const AdWatcher: React.FC<AdWatcherProps> = ({ onComplete, adsLeft }) => {
  const { t } = useTranslation();
  const [isWatching, setIsWatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWatching && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
        setProgress((prev) => prev + (100 / 30));
      }, 1000);
    } else if (timer === 0) {
      setIsWatching(false);
      onComplete();
      setTimer(30);
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isWatching, timer, onComplete]);

  const startAd = () => {
    if (adsLeft > 0) {
      setIsWatching(true);
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
            <Droplets className="animate-bounce" />
            {t('watering')} ({timer}s)
          </>
        ) : (
          <>
            <Play fill="currentColor" />
            {t('watch_ad')}
          </>
        )}
      </button>

      <AnimatePresence>
        {isWatching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6"
          >
            <div className="w-full max-w-md aspect-video bg-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden">
              {/* Mock Video Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <Play size={40} fill="white" />
                </div>
                <h3 className="text-xl font-bold mb-2">AdHarvest ADH</h3>
                <p className="text-sm opacity-70">Grow your farm, earn real TON tokens!</p>
              </div>
              
              {/* Progress Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            <div className="mt-8 text-white text-center">
              <p className="text-lg font-bold mb-2">{t('watering')}</p>
              <p className="text-sm opacity-60">Reward: 10 ADH Mint + 2 ADH Burn</p>
            </div>

            {/* Monetag SDK Script would go here in production */}
            {/* <script src="https://alwingulla.com/88/tag.min.js" data-zone="123456"></script> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdWatcher;
