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
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const { connected, signMessage, account } = useWallet();
  const {
    metaViewPublicKey,
    metaViewPrivateKey,
    metaSpendPublicKey,
    metaSpendPrivateKey,
    setKeys,
    setUsername,
    username,
    setUsernameByPublicKey,
    firstTimeSignature,
    firstTimeMessage,
    firstTimeSignMessage,
  } = useContextTemplate();

  const [usernameInput, setUsernameInput] = useState("");

  useEffect(() => {
    if (connected && account && firstTimeSignature && firstTimeMessage) {
      setUsernameByPublicKey();
    }
  }, [connected, account, firstTimeSignature, firstTimeMessage]);

  const handleSetUsername = async () => {
    if (!usernameInput) {
      return;
    }
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      body: JSON.stringify({
        username: usernameInput,
        publicKeyHex: account?.publicKey.toString(),
        signatureHex: firstTimeSignature,
        messageHex: firstTimeMessage,
      }),
    });
    const data = await res.json();
    console.log(data);
    setUsername(usernameInput);
  };

  const handleFirstTimeSignMessage = async () => {
    await firstTimeSignMessage();
  };

  return (
    <>
      <TopBanner />
      <Header />
      <div className="flex items-center justify-center flex-col">
        {connected ? (
          firstTimeSignature && firstTimeMessage ? (
            <Card>
              <CardContent className="flex flex-col gap-10 pt-6">
                {username ? (
                  <p>Welcome {username}</p>
                ) : (
                  <div>
                    <p>Please choose a username</p>
                    <input
                      type="text"
                      placeholder="Username"
                      onChange={(e) => setUsernameInput(e.target.value)}
                      value={usernameInput || ""}
                    />
                    <button onClick={handleSetUsername}>Set Username</button>
                  </div>
                )}
                <WalletDetails />
                <NetworkInfo />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col gap-10 pt-6">
                <p>Please sign message to continue</p>
                <button onClick={handleFirstTimeSignMessage}>Sign Message</button>
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
