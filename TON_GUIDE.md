# AdHarvest (ADH) TON Deployment Guide

## 1. Jetton Contract Deployment
To deploy the ADH Jetton contract on TON Testnet:
1. Install Blueprint: `npm create ton@latest`
2. Create a new Jetton Master contract.
3. Use the provided FunC reference in `src/lib/ton.ts`.
4. Deploy using Tonkeeper or a local wallet.
5. Update `JETTON_MASTER_ADDRESS` in `src/lib/ton.ts`.

## 2. Monetag SDK Setup
1. Create an account on [Monetag](https://monetag.com/).
2. Add a new "Rewarded Video" zone.
3. Copy the zone ID.
4. In `src/components/AdWatcher.tsx`, uncomment the script tag and replace the zone ID.

## 3. Telegram Bot Setup
1. Create a bot via [@BotFather](https://t.me/BotFather).
2. Set up a Mini App link pointing to your deployed URL.
3. Enable "Direct Link" for referrals.

## 4. Production Ready
- The app supports English and Arabic.
- Gas fees are minimized by using a mintless Jetton structure (minting on demand).
- Referral tracking is handled via `start_param` in Telegram.
