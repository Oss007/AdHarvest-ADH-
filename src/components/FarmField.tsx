import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface FarmFieldProps {
  cropState: 'barren' | 'watered' | 'harvested';
  onHarvest: () => void;
}

const FarmField: React.FC<FarmFieldProps> = ({ cropState, onHarvest }) => {
  const { t } = useTranslation();

  const getEmoji = () => {
    switch (cropState) {
      case 'barren': return '🟫';
      case 'watered': return '🌱';
      case 'harvested': return '🌾';
      default: return '🟫';
    }
  };

  return (
    <div className="farm-grid">
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={i}
          className="crop-cell"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-4xl">{getEmoji()}</span>
          {cropState === 'harvested' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-gold/20 cursor-pointer"
              onClick={onHarvest}
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-xs font-bold text-primary uppercase">{t('harvest')}</span>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default FarmField;
