import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { WalletDetails } from "@/components/WalletDetails";
import { NetworkInfo } from "@/components/NetworkInfo";
import { AccountInfo } from "@/components/AccountInfo";
import { TopBanner } from "@/components/TopBanner";
import { useContextTemplate } from "./context/ContextTemplate";
import { QRCode } from "./components/QRCode";

function App() {
  const { connected, signMessage } = useWallet();
  const { metaViewPublicKey, metaViewPrivateKey, metaSpendPublicKey, metaSpendPrivateKey, setKeys } =
    useContextTemplate();

  return (
    <>
      <TopBanner />
      <Header />
      <div className="flex items-center justify-center flex-col">
        {connected ? (
          metaViewPublicKey && metaViewPrivateKey && metaSpendPublicKey && metaSpendPrivateKey ? (
            <Card>
              <CardContent className="flex flex-col gap-10 pt-6">
                <p>MetaView Public Key: {metaViewPublicKey}</p>
                <p>MetaView Private Key: {metaViewPrivateKey}</p>
                <p>MetaSpend Public Key: {metaSpendPublicKey}</p>
                <p>MetaSpend Private Key: {metaSpendPrivateKey}</p>
                <QRCode />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col gap-10 pt-6">
                <p>Please sign message to continue</p>
                <button
                  onClick={async () => {
                    setKeys(signMessage);
                  }}
                >
                  Set Keys
                </button>
                <WalletDetails />
                <NetworkInfo />
                <AccountInfo />
              </CardContent>
            </Card>
          )
        ) : (
          <CardHeader>
            <CardTitle>To get started Connect a wallet</CardTitle>
          </CardHeader>
        )}
      </div>
    </>
  );
}

export default App;
