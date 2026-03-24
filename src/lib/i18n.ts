import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_name": "AdHarvest",
      "balance": "ADH Balance",
      "ads_left": "Daily Ads Left",
      "watch_ad": "Water Crops (Watch Ad)",
      "invite_friends": "Invite Friends",
      "invite_bonus": "Get +5 ads/day & 1 ADH per invite",
      "wallet_connect": "Connect Wallet",
      "harvested": "Harvested!",
      "minted": "10 ADH Minted",
      "burned": "2 ADH Burned",
      "profile": "Profile",
      "total_earned": "Total Earned",
      "burns_contributed": "Burns Contributed",
      "farm_level": "Farm Level",
      "leaderboard": "Leaderboard",
      "language": "Language",
      "daily_limit_reached": "Daily limit reached! Invite friends to unlock more.",
      "watering": "Watering crops...",
      "harvest": "Harvest",
      "friends_invited": "Friends Invited",
      "share_link": "Share Link",
      "copy_link": "Copy Link",
      "copied": "Copied!",
      "welcome": "Welcome to AdHarvest!",
      "start_farming": "Start Farming",
    }
  },
  ar: {
    translation: {
      "app_name": "حصاد الإعلانات (ADH)",
      "balance": "رصيد ADH",
      "ads_left": "الإعلانات اليومية المتبقية",
      "watch_ad": "سقي المحاصيل (مشاهدة إعلان)",
      "invite_friends": "دعوة الأصدقاء",
      "invite_bonus": "احصل على +5 إعلانات/يوم و 1 ADH لكل دعوة",
      "wallet_connect": "ربط المحفظة",
      "harvested": "تم الحصاد!",
      "minted": "تم سك 10 ADH",
      "burned": "تم حرق 2 ADH",
      "profile": "الملف الشخصي",
      "total_earned": "إجمالي الأرباح",
      "burns_contributed": "المساهمة في الحرق",
      "farm_level": "مستوى المزرعة",
      "leaderboard": "لوحة المتصدرين",
      "language": "اللغة",
      "daily_limit_reached": "تم الوصول للحد اليومي! ادعُ أصدقاءك لفتح المزيد.",
      "watering": "سقي المحاصيل...",
      "harvest": "حصاد",
      "friends_invited": "الأصدقاء المدعوون",
      "share_link": "مشاركة الرابط",
      "copy_link": "نسخ الرابط",
      "copied": "تم النسخ!",
      "welcome": "مرحباً بك في حصاد الإعلانات!",
      "start_farming": "ابدأ الزراعة",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
