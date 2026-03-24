import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Trophy, TrendingUp, Flame, User } from 'lucide-react';

interface ProfileProps {
  stats: {
    totalEarned: number;
    totalBurned: number;
    farmLevel: number;
    adsWatched: number;
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

  return (
    <div className="p-6 bg-white rounded-3xl shadow-lg m-4 border border-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <User size={40} />
        </div>
        <div>
          <h3 className="text-2xl font-bold">{getLevelName(stats.farmLevel)}</h3>
          <p className="text-sm text-gray-500">{t('farm_level')} {stats.farmLevel}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-2 text-primary mb-2">
            <TrendingUp size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">{t('total_earned')}</span>
          </div>
          <p className="text-2xl font-black text-primary">{stats.totalEarned} ADH</p>
        </div>
        <div className="p-4 bg-burn/5 rounded-2xl border border-burn/10">
          <div className="flex items-center gap-2 text-burn mb-2">
            <Flame size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">{t('burns_contributed')}</span>
          </div>
          <p className="text-2xl font-black text-burn">{stats.totalBurned} ADH</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-400 mb-2">
          <Trophy size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">{t('leaderboard')}</span>
        </div>
        <div className="space-y-2">
          {[
            { name: 'TON_Master', score: 12500, rank: 1 },
            { name: 'ADH_Farmer', score: 9800, rank: 2 },
            { name: 'Crypto_Grower', score: 8400, rank: 3 },
          ].map((user, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                  user.rank === 1 ? 'bg-gold text-gray-800' : 'bg-gray-200 text-gray-500'
                }`}>
                  {user.rank}
                </span>
                <span className="font-bold text-gray-700">{user.name}</span>
              </div>
              <span className="font-mono text-sm text-primary">{user.score} ADH</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
