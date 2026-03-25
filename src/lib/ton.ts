import { Address, beginCell, toNano, SendMode } from '@ton/core';
import { TonConnectUI } from '@tonconnect/ui-react';

// ✅ YOUR REAL TESTNET ADDRESSES (replace after deploy)
export const JETTON_MASTER_ADDRESS = Address.parse('EQD...YOUR-JETTON-MASTER');  // From TON Minter
export const ADMIN_WALLET = Address.parse('YOUR-ADMIN-WALLET');  // Your Tonkeeper

export const ADH_MINT_AMOUNT = 10n;  // bigint
export const ADH_BURN_AMOUNT = 2n;

// ✅ REAL MINT (Admin → User)
export const createMintMessage = (userJettonWallet: Address, amount: bigint) => {
  return {
    validUntil: Math.floor(Date.now() / 1000) + 300,  // 5 min
    messages: [
      {
        address: JETTON_MASTER_ADDRESS,
        amount: toNano('0.1'),  // Gas
        payload: beginCell()
          .storeUint(0x1674b0a0, 32)  // op::mint
          .storeUint(Math.floor(Math.random() * 1e9), 64)  // query_id
          .storeAddress(userJettonWallet)
          .storeCoins(amount)
          .endCell()
      }
    ]
  };
};

// ✅ REAL BURN (User → null)
export const createBurnMessage = (userJettonWallet: Address, amount: bigint) => {
  return {
    validUntil: Math.floor(Date.now() / 1000) + 300,
    messages: [
      {
        address: userJettonWallet,
        amount: toNano('0.05'),
        payload: beginCell()
          .storeUint(0x595f07bc, 32)  // op::burn
          .storeUint(Math.floor(Math.random() * 1e9), 64)
          .storeCoins(amount)
          .storeCoins(toNano('0'))  // Send 0 back
          .storeUint(0, 1)  // No response
          .endCell()
      }
    ]
  };
};

// ✅ MAIN REWARD FUNCTION (Your AdWatcher calls this)
export const rewardUser = async (tonConnectUI: TonConnectUI, userJettonWallet: Address) => {
  try {
    // 1. MINT 10 ADH to user
    const mintTx = createMintMessage(userJettonWallet, ADH_MINT_AMOUNT);
    await tonConnectUI.sendTransaction(mintTx);
    
    // 2. BURN 2 ADH (from admin or pool)
    const burnTx = createBurnMessage(userJettonWallet, ADH_BURN_AMOUNT);
    await tonConnectUI.sendTransaction(burnTx);
    
    console.log('✅ 10 ADH minted + 2 ADH burned!');
    return true;
  } catch (error) {
    console.error('TON Error:', error);
    return false;
  }
};
