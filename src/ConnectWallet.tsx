// src/components/ConnectWallet.tsx
import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@material-ui/core';

const ConnectWallet: React.FC = () => {
  const { connect, connected } = useWallet();

  return (
    <Button onClick={connect}>
      {connected ? 'Connected' : 'Connect Wallet'}
    </Button>
  );
}

export default ConnectWallet;
