import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Share2, Copy, Check, Users } from 'lucide-react';

interface ReferralSystemProps {
  userId: string;
  referrals: string[];
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ userId, referrals }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://t.me/AdHarvestBot/start?startapp=${userId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    const text = `Join AdHarvest and earn ADH tokens for free! 🌾💰\n\n${referralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`);
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-lg m-4 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <Users size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold">{t('invite_friends')}</h3>
          <p className="text-sm text-gray-500">{t('invite_bonus')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={shareLink}
          className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl font-bold shadow-md active:scale-95 transition-all"
        >
          <Share2 size={18} />
          {t('share_link')}
        </button>
        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold active:scale-95 transition-all"
        >
          {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
          {copied ? t('copied') : t('copy_link')}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-wider">
          <span>{t('friends_invited')}</span>
          <span className="text-primary">{referrals.length}</span>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {referrals.length === 0 ? (
            <p className="text-center text-gray-400 py-4 italic">No friends invited yet...</p>
          ) : (
            referrals.map((ref, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <span className="font-mono text-sm text-gray-600">ID: {ref}</span>
                <span className="text-xs font-bold text-green-600">+5 Ads/Day</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;
