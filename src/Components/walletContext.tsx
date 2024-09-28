import React, { createContext, useContext, useState } from 'react';

interface WalletContextType {
  wallet: any | null;
  setWallet: (wallet: any) => void;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  setWallet: () => {},
});

export const WalletProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [wallet, setWallet] = useState<any | null>(null);

  // ... other wallet logic

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
