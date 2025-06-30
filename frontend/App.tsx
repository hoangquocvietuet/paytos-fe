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
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";

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
    if (!usernameInput || !metaSpendPublicKey || !firstTimeSignature || !firstTimeMessage) {
      return;
    }
    console.log("usernameInput", usernameInput);
    console.log("metaSpendPublicKey", metaSpendPublicKey);
    console.log("firstTimeSignature", firstTimeSignature);
    console.log("firstTimeMessage", firstTimeMessage);
    console.log(
      "body",
      JSON.stringify({
        username: usernameInput,
        sendPublicKey: metaSpendPublicKey,
        publicKeyHex: account?.publicKey.toString(),
        signatureHex: firstTimeSignature,
        messageHex: bytesToHex(utf8ToBytes(firstTimeMessage)),
      }),
    );
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput,
          sendPublicKey: metaSpendPublicKey,
          publicKeyHex: account?.publicKey.toString(),
          signatureHex: firstTimeSignature,
          messageHex: bytesToHex(utf8ToBytes(firstTimeMessage)),
        }),
      });
      const data = await res.json();
      console.log(data);
      setUsername(usernameInput);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFirstTimeSignMessage = async () => {
    await firstTimeSignMessage();
  };

  const handleSetKeys = async () => {
    await setKeys();
  };

  return (
    <>
      <TopBanner />
      <Header />
      <div className="flex items-center justify-center flex-col">
        {connected ? (
          <>
            {!firstTimeMessage ? (
              <Card>
                <CardContent>
                  <p>
                    Whenever you reload the page, you need to sign a message to generate keys to authenticate with
                    backend. This step will be removed in the future with zk proofs.
                  </p>
                  <button onClick={handleFirstTimeSignMessage}>Sign Message to generate keys</button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col gap-10 pt-6">
                  {metaSpendPublicKey ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <p>No Send Public Key</p>
                      <p>
                        Because it's first time you join. Sign a message to generate a view & send public key. This will
                        be stored in local storage. You can recover it any time.
                      </p>
                      <button onClick={handleSetKeys}>Sign Message to generate keys</button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent>
              <p>No connected wallet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

export default App;
