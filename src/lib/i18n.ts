import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_name": "AdHarvest",
      "balance": "ADH Balance",
      "ads_left": "Ads Left",
      "extra_ads": "Extra Ads",           // ✅ NEW
      "watch_ad": "Water Crops (Watch Ad)",
      "watching_ad": "Watching Ad...",    // ✅ NEW (AdWatcher fix)
      "invite_friends": "Invite Friends",
      "invite_bonus": "Get +5 ads/day per friend!",
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
      "no_ads_left": "No ads left!",      // ✅ NEW (FarmField)
      "daily_limit_reached": "Daily limit reached! Invite friends for more.",
      "watering": "Watering crops...",
      "harvest": "Harvest",
      "harvest_adh": "Harvest ADH",       // ✅ NEW (FarmField)
      "friends_invited": "Friends Invited",
      "share_link": "Share Link",
      "copy_link": "Copy Link",
      "copied": "Copied!",
      "welcome": "Welcome to AdHarvest!",
      "start_farming": "Start Farming"
    }
  },
  ar: {
    translation: {
      "app_name": "حصاد الإعلانات",
      "balance": "رصيد ADH",
      "ads_left": "الإعلانات المتبقية",
      "extra_ads": "إعلانات إضافية",      // ✅ NEW
      "watch_ad": "سقي المحاصيل (إعلان)",
      "watching_ad": "مشاهدة الإعلان...", // ✅ NEW
      "invite_friends": "دعوة الأصدقاء",
      "invite_bonus": "احصل على +5 إعلانات/يوم لكل صديق!",
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
      "no_ads_left": "لا توجد إعلانات!",   // ✅ NEW
      "daily_limit_reached": "تم الوصول للحد اليومي! ادعُ أصدقاءك للمزيد.",
      "watering": "سقي المحاصيل...",
      "harvest": "حصاد",
      "harvest_adh": "حصاد ADH",          // ✅ NEW
      "friends_invited": "الأصدقاء المدعوون",
      "share_link": "مشاركة الرابط",
      "copy_link": "نسخ الرابط",
      "copied": "تم النسخ!",
      "welcome": "مرحباً بك في حصاد الإعلانات!",
      "start_farming": "ابدأ الزراعة"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar",  // ✅ Default Arabic for Algeria
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
