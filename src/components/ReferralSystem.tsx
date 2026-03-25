import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Share2, Copy, Check, Users, Plus } from 'lucide-react';

interface ReferralSystemProps {
  userId: string;
  referrals: string[];
  extraAdsUnlocked: number;  // NEW: +5 per invite
  setExtraAdsUnlocked: (n: number) => void;  // NEW
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ 
  userId, 
  referrals, 
  extraAdsUnlocked, 
  setExtraAdsUnlocked 
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  // ✅ CORRECTED REFERRAL LINK FORMAT
  const referralLink = `https://t.me/AdHarvestBot/app?startapp=ref_${userId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    const text = `Join AdHarvest! 🌾 Watch ads → earn ADH tokens 💰\n\n${referralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-lg m-4 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl text-white shadow-lg">
          <Users size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{t('invite_friends')}</h3>
          <p className="text-sm font-bold text-emerald-600">
            +5 ads/day per friend! (Currently: <span className="font-black">+{extraAdsUnlocked}</span>)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={shareLink}
          className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Share2 size={18} />
          {t('share_link')}
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={copyLink}
          className="flex items-center justify-center gap-2 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold shadow-md border transition-all"
        >
          {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
          {copied ? t('copied') : t('copy_link')}
        </motion.button>
      </div>

      {/* REFERRAL STATS */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-center p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl">
        <div>
          <div className="text-2xl font-black text-emerald-600">{referrals.length}</div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">{t('friends_invited')}</span>
        </div>
        <div>
          <div className="text-2xl font-black text-blue-600">+{extraAdsUnlocked}</div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">{t('extra_ads')}</span>
        </div>
      </div>

      {/* REFERRALS LIST */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-wider">
          <span>{t('friends_invited')}</span>
          <span className="text-emerald-600 font-black">+{extraAdsUnlocked} Ads</span>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
          {referrals.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-gray-400 py-8 italic bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
            >
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              Invite your first friend! 👆
            </motion.div>
          ) : (
            referrals.map((ref, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl shadow-sm border border-emerald-100"
              >
                <span className="font-mono text-sm text-gray-700">@{ref.slice(-8)}</span>
                <div className="flex items-center gap-1 bg-emerald-100 px-3 py-1 rounded-full">
                  <Plus size={14} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">5 Ads</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;
