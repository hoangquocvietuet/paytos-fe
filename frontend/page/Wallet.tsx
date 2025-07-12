import { ReceiveDialog } from "@/components/ReceiveDialog";
import { SendDialog } from "@/components/SendDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { wallets } from "@/mock";
import { Star } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useContextTemplate } from "@/context/ContextTemplate";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";
import { useState, useEffect } from "react";
import { API_URL } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { WalletSelector } from "@/components/WalletSelector";

export const WalletPage = () => {
  const { connected, account } = useWallet();

  const {
    metaViewPublicKey,
    metaViewPrivateKey,
    metaSpendPublicKey,
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
          viewPublicKey: metaViewPublicKey,
          viewPrivateKey: metaViewPrivateKey,
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

  return !connected ? (
    <main className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-white gap-4">
      <h2 className="text-4xl">Please connect a wallet</h2>
      <WalletSelector className="w-[200px] bg-gradient text-black text-2xl" />
    </main>
  ) : connected && !firstTimeMessage ? (
    <main className="max-w-screen-xl mx-auto flex flex-col items-start xl:items-center gap-10 px-2 xl:px-0">
      <h1 className="xl:mx-auto text-2xl xl:text-4xl bg-black inline-block py-1 px-6 xl:px-10 rounded-full bg-gradient mt-10">
        Main Wallet
      </h1>
      <div className="flex items-center gap-4 w-full xl:w-2/3 mx-auto font-['Prototype']">
        <Star size={40} fill="#F8C265" stroke="#F8C265" className="hidden xl:inline" />
        <div className="flex flex-col xl:flex-row justify-between border p-4 w-full border-gradient text-xl xl:text-3xl">
          <p className="text-white">{wallets[0].address}</p>
          <p className="text-[#F8C265] text-2xl">{wallets[0].balance} USDC</p>
        </div>
      </div>

      <h2 className="xl:mx-auto text-2xl xl:text-4xl bg-black inline-block py-1 px-10 rounded-full bg-gradient">
        Stealth Wallets
      </h2>
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        {wallets.map((wallet, index) => (
          <div key={index} className="flex items-center gap-4 w-full mx-auto font-['Prototype']">
            <p className="hidden xl:flex items-center font-bold text-xl px-4 aspect-square rounded-full bg-[#38D1BD]">
              {index + 1}
            </p>
            <div className="flex flex-col xl:flex-row justify-between border p-4 w-full border-gradient text-xl xl:text-3xl">
              <p className="text-white">{wallets[0].address}</p>
              <div className="flex justify-between">
                <p className="text-[#38D1BD] text-2xl">{wallets[0].balance} USDC</p>
                <p className="xl:hidden flex items-center font-bold text-xl px-4 aspect-square rounded-full bg-[#38D1BD]">
                  {index + 1}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full xl:w-2/3 flex gap-4 xl:gap-10 mb-28 xl:mb-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex-1 bg-[#38D1BD] text-black text-2xl font-bold rounded-lg xl:rounded-xl hover:bg-[#38D1BD80]">
              Send
            </Button>
          </DialogTrigger>
          <SendDialog />
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex-1 bg-[#F8C265] text-black text-2xl font-bold rounded-lg xl:rounded-xl hover:bg-[#F8C26580]">
              Receive
            </Button>
          </DialogTrigger>
          <ReceiveDialog />
        </Dialog>
      </div>
    </main>
  ) : (
    <></>
  );
};
