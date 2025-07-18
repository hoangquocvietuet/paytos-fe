import { DialogContent, DialogTitle, DialogDescription, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useContextTemplate } from "@/context/ContextTemplate";
import { useEffect, useState } from "react";
import { API_URL, MODULE_ADDRESS } from "@/constants";
import { calculateStealthWallet, publicKeyToAddress } from "@/utils/helpers";
import { hexToBytes } from "@noble/hashes/utils";

export const SendDialog = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const { getBalance } = useContextTemplate();
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (account) {
      getBalance(account.address.toString()).then((balance) => {
        setBalance(balance);
      });
    }
  }, [account]);

  const handleSend = async () => {
    if (!account) {
      alert("Please connect your wallet");
      return;
    }

    const res = await fetch(`${API_URL}/stealth/meta/${recipient}`, {
      method: "GET",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Stealth Meta API Error:", errorText);
      alert(`API Error: ${res.status}`);
      return;
    }

    const data = await res.json();
    if (!data) {
      alert("Recipient not found");
      return;
    }
    console.log("data", data);
    const receipentScanPublicKey = data.data[0].scanPublic;
    const receipentSpendPublicKey = data.data[0].spendPublic;

    const info = calculateStealthWallet(receipentSpendPublicKey, receipentScanPublicKey);
    console.log("info", info);
    console.log(
      "address",
      publicKeyToAddress(account?.publicKey.toString().slice(2) || ""),
      account?.address.toString(),
    );

    const response = await signAndSubmitTransaction({
      sender: account?.address.toString(),
      data: {
        function: `${MODULE_ADDRESS}::payment::send`,
        functionArguments: [
          "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832",
          info.stealthAddress,
          Array.from(hexToBytes(info.ephemeralPublicKey.slice(2))),
          1,
        ],
        typeArguments: ["0x1::fungible_asset::Metadata"],
      },
      options: {
        expirationSecondsFromNow: 10,
      },
    });

    alert(JSON.stringify(response));
  };

  return (
    <DialogContent className="bg-[#1F2427] text-white border-none">
      <DialogHeader>
        <DialogTitle className="text-3xl text-center mb-10">Send</DialogTitle>
        <DialogDescription className="flex flex-col gap-4 text-lg">
          <Input
            placeholder="Enter recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="border-gradient-rounded focus-visible:ring-0 bg-[#1F2427] text-white"
          />
          <p>Balance: {balance} USDC</p>
          <Input
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border-gradient-rounded focus-visible:ring-0 bg-[#1F2427] text-white"
          />
          <Button className="bg-gradient text-black text-xl" onClick={handleSend}>
            Send
          </Button>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};
