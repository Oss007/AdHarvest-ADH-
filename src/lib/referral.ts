import { getStartParam, getTelegramUser } from './telegram';

export const handleReferral = (onNewReferral: (referrerId: string) => void) => {
  const startParam = getStartParam();
  const user = getTelegramUser();
  
  if (!startParam || !user) return;  // Early exit
  
  // ✅ FIXED: Parse "ref_12345" → "12345"
  if (!startParam.startsWith('ref_')) return;
  const referrerId = startParam.split('_')[1];
  const userId = user.id.toString();
  
  // Don't refer yourself
  if (referrerId === userId) return;
  
  // ✅ FIXED: Check if already referred (localStorage)
  const existingReferrals = JSON.parse(localStorage.getItem('referrals') || '[]');
  if (existingReferrals.includes(referrerId)) {
    console.log('Already referred by:', referrerId);
    return;  // No duplicate +5 ads
  }
  
  // ✅ NEW: Save referral permanently
  existingReferrals.push(referrerId);
  localStorage.setItem('referrals', JSON.stringify(existingReferrals));
  
  // Calculate +5 extra ads
  const extraAds = existingReferrals.length * 5;
  localStorage.setItem('extraAdsUnlocked', extraAds.toString());
  
  console.log(`New referral! +5 ads. Total extra: ${extraAds}`);
  
  // Callback for UI update
  onNewReferral(referrerId);
};
