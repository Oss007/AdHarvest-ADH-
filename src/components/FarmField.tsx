import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';  // Add for harvest icon

interface FarmFieldProps {
  cropState: 'barren' | 'watered' | 'harvested';
  onHarvest: () => void;
  adsLeft: number;  // NEW: Show ads status
}

const FarmField: React.FC<FarmFieldProps> = ({ cropState, onHarvest, adsLeft }) => {
  const { t } = useTranslation();

  const getEmoji = () => {
    switch (cropState) {
      case 'barren': return '🟫🌾';    // Better barren look
      case 'watered': return '💧🌱';   // Watered crops
      case 'harvested': return '🌾💰';  // Gold coins!
      default: return '🟫';
    }
  };

  const getStatusText = () => {
    if (adsLeft === 0) return t('no_ads_left');
    return `${adsLeft} ${t('ads_left')}`;
  };

  return (
    <div className="farm-container relative">  {/* Better wrapper */}
      <div className="farm-grid">  {/* Fixed className */}
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="crop-cell"  // Make sure CSS exists
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-4xl block">{getEmoji()}</span>  {/* Better emoji */}
          </motion.div>
        ))}
      </div>
      
      {/* HARVEST OVERLAY - Only on harvested */}
      {cropState === 'harvested' && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-gold/80 to-primary/80 rounded-2xl cursor-pointer shadow-2xl"
          onClick={onHarvest}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Package className="w-12 h-12 text-white mb-2 animate-bounce" />
          <span className="text-lg font-bold text-white uppercase tracking-wide">
            {t('harvest_adh')}
          </span>
          <span className="text-xs text-white/80 mt-1">{getStatusText()}</span>
        </motion.div>
      )}
      
      {/* ADS STATUS BAR */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs text-center rounded-b-2xl">
        {getStatusText()}
      </div>
    </div>
  );
};

export default FarmField;
