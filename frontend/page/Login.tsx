import { AptosConnectWalletRow } from "@/components/WalletSelector";
import { groupAndSortWallets, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const nav = useNavigate();
  const { connected, account, isLoading, wallets = [] } = useWallet();
  const { aptosConnectWallets: wallet, availableWallets, installableWallets } = groupAndSortWallets(wallets);

  useEffect(() => {
    if (connected) {
      nav("/wallet");
    }
  }, [connected]);

  return isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl text-gradient tracking-widest">Loading...</h1>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-4xl text-gradient tracking-widest mb-6">PAYTOS</h1>
      <h2 className="text-3xl">Login now!</h2>
      {wallet.length > 0 ? (
        <div className="flex flex-col gap-4 mt-6">
          <AptosConnectWalletRow key={wallet[0].name} wallet={wallet[0]} onConnect={close} />
        </div>
      ) : (
        <p className="text-lg text-muted-foreground mt-4">No Aptos Connect wallets available.</p>
      )}
    </div>
  );
};
