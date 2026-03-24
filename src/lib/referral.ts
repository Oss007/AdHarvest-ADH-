import { getStartParam, getTelegramUser } from './telegram';

export const handleReferral = (onNewReferral: (referrerId: string) => void) => {
  const startParam = getStartParam();
  const user = getTelegramUser();
  
  if (startParam && user) {
    const referrerId = startParam;
    const userId = user.id.toString();
    
    // Don't refer yourself
    if (referrerId !== userId) {
      // In a real app, we'd send this to the backend
      // For now, we'll return the referrer ID
      onNewReferral(referrerId);
    }
  }
};
