import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Trophy, TrendingUp, Flame, User, Users, Share2 } from 'lucide-react';

interface ProfileProps {
  stats: {
    totalEarned: number;
    totalBurned: number;
    farmLevel: number;
    adsWatched: number;
    invites: number;  // NEW: Referral count
    extraAds: number; // NEW: Extra ads from invites
  };
}

const Profile: React.FC<ProfileProps> = ({ stats }) => {
  const { t } = useTranslation();

  const getLevelName = (level: number) => {
    if (level < 5) return 'Novice Farmer';
    if (level < 15) return 'Green Thumb';
    if (level < 30) return 'Master Harvester';
    return 'ADH Tycoon';
  };

  // SAFETY: Ensure invites is a number to prevent .length errors
  const invitesCount = typeof stats.invites === 'number' ? stats.invites : 0;

  return (
    <div className="p-6 bg-white rounded-3xl shadow-lg m-4 border border-gray-100">
      {/* PROFILE HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <User size={40} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{getLevelName(stats.farmLevel)}</h3>
          <p className="text-sm text-gray-500">{t('farm_level')} {stats.farmLevel}</p>
        </div>
      </div>

      {/* MAIN STATS */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 group hover:bg-primary/10 transition-all">
          <div className="flex items-center gap-2 text-primary mb-2">
            <TrendingUp size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">{t('total_earned')}</span>
          </div>
          <p className="text-2xl font-black text-primary">{stats.totalEarned.toLocaleString()} ADH</p>
        </div>
        
        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 group hover:bg-orange-100 transition-all">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Flame size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">{t('burns_contributed')}</span>
          </div>
          <p className="text-2xl font-black text-orange-600">{stats.totalBurned.toLocaleString()} ADH</p>
        </div>
      </div>

      {/* REFERRAL STATS - NEW! */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl">
        <div className="flex flex-col items-center text-center">
          <Users className="w-10 h-10 text-emerald-500 mb-1" />
          <span className="font-bold text-lg">{invitesCount}</span>
          <span className="text-xs text-gray-500">{t('invites')}</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <Share2 className="w-10 h-10 text-blue-500 mb-1" />
          <span className="font-bold text-lg">+{stats.extraAds}</span>
          <span className="text-xs text-gray-500">{t('extra_ads')}</span>
        </div>
      </div>

      {/* FAKE LEADERBOARD */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-400 mb-2">
          <Trophy size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">{t('leaderboard')}</span>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {[
            { name: 'TON_Master', score: 12500, rank: 1 },
            { name: 'ADH_Farmer', score: 9800, rank: 2 },
            { name: 'Crypto_Grower', score: 8400, rank: 3 },
            { name: 'AlgeriaKing', score: 7200, rank: 4 },  // Algeria nod!
          ].map((user, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${
                  user.rank === 1 ? 'bg-yellow-400 text-gray-800 shadow-lg' : 
                  user.rank === 2 ? 'bg-gray-300 text-gray-800' : 
                  user.rank === 3 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  #{user.rank}
                </span>
                <span className="font-bold text-gray-700">{user.name}</span>
              </div>
              <span className="font-mono text-sm text-primary font-bold">{user.score.toLocaleString()} ADH</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
