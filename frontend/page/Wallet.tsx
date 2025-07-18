import { ReceiveDialog } from "@/components/ReceiveDialog";
import { SendDialog } from "@/components/SendDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useContextTemplate } from "@/context/ContextTemplate";
import { getPublicKeyHex } from "../utils/helpers";
import { useState, useEffect } from "react";
import { API_URL } from "@/constants";
import { WalletSelector } from "@/components/WalletSelector";
import { shortenAddress } from "@/lib/utils";

export const WalletPage = () => {
  const { connected, account } = useWallet();

  const [balance, setBalance] = useState<string>("0");

  const {
    metaViewPublicKey,
    metaSpendPublicKey,
    setKeys,
    setUsername,
    username,
    setUsernameByPublicKey,
    firstTimeSignature,
    firstTimeMessage,
    firstTimeSignMessage,
    getBalance,
    stealthWallets,
  } = useContextTemplate();

  const [usernameInput, setUsernameInput] = useState("");

  useEffect(() => {
    if (connected && account) {
      setUsernameByPublicKey();
      // Load balance
      getBalance(account.address.toString()).then((balance) => {
        setBalance(balance.toString());
      });
    }
  }, [connected, account]);

  const handleSetUsername = async () => {
    if (!usernameInput || !account) {
      return;
    }
    const publicKeyHex = getPublicKeyHex(account.publicKey);

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput,
          aptosPublicKey: publicKeyHex,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Users API Error:", errorText);
        throw new Error(`Users API failed: ${res.status}`);
      }

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

  return !connected || !account ? (
    <main className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-white gap-4">
      <h2 className="text-4xl">Please connect a wallet</h2>
      <WalletSelector className="w-[200px] bg-gradient text-black text-2xl" />
    </main>
  ) : connected && firstTimeMessage ? (
    <main className="max-w-screen-xl mx-auto flex flex-col items-start xl:items-center gap-10 px-2 xl:px-0">
      <h1 className="xl:mx-auto text-2xl xl:text-4xl bg-black inline-block py-1 px-6 xl:px-10 rounded-full bg-gradient mt-10">
        Main Wallet
      </h1>
      <div className="flex items-center gap-4 w-full xl:w-2/3 mx-auto font-['Prototype']">
        <Star size={40} fill="#F8C265" stroke="#F8C265" className="hidden xl:inline" />
        <div className="flex flex-col xl:flex-row justify-between border p-4 w-full border-gradient text-xl xl:text-3xl">
          <p className="text-white">{shortenAddress(account.address.toString())}</p>
          <p className="text-[#F8C265] text-2xl">{balance} USDC</p>
        </div>
      </div>

      <h2 className="xl:mx-auto text-2xl xl:text-4xl bg-black inline-block py-1 px-10 rounded-full bg-gradient">
        Stealth Wallets
      </h2>
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        {stealthWallets
          .filter((wallet) => wallet.direction === "IN" && wallet.amount !== "0")
          .map((wallet, index) => (
            <div key={wallet.stealthAddress} className="flex items-center gap-4 w-full mx-auto font-['Prototype']">
              <p className="hidden xl:flex items-center font-bold text-xl px-4 aspect-square rounded-full bg-[#38D1BD]">
                {index + 1}
              </p>
              <div className="flex flex-col xl:flex-row justify-between border p-4 w-full border-gradient text-xl xl:text-3xl">
                <p className="text-white">{shortenAddress(wallet.stealthAddress)}</p>
                <div className="flex justify-between">
                  <p className="text-[#38D1BD] text-2xl">{parseInt(wallet.amount) / 1000000} USDC</p>
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
    <main className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-white gap-6 min-h-[60vh]">
      {/* Bước 1: Nhập username nếu chưa có */}
      {!username ? (
        <div className="flex flex-col items-center gap-4 w-full xl:w-2/3">
          <h2 className="text-3xl font-bold text-[#F8C265] mb-2">Nhập tên người dùng</h2>
          <input
            className="w-full px-4 py-2 rounded text-black text-xl border border-[#38D1BD] focus:outline-none"
            placeholder="Nhập username..."
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <Button
            className="w-full py-3 bg-gradient-to-r from-[#F8C265] to-[#38D1BD] text-black text-xl font-bold rounded-full hover:opacity-80 shadow-lg border-none"
            onClick={handleSetUsername}
          >
            Lưu username
          </Button>
        </div>
      ) : !metaSpendPublicKey || !metaViewPublicKey ? (
        // Bước 2: Tạo spending/view key nếu chưa có
        <div className="flex flex-col items-center gap-4 w-full xl:w-2/3">
          <span className="text-6xl mb-2">🔑</span>
          <h2 className="text-3xl font-bold text-[#F8C265] mb-2">Tạo khóa ví Stealth</h2>
          <span className="text-lg bg-black bg-opacity-30 px-4 py-2 rounded text-white border border-[#38D1BD] font-semibold w-full">
            Bạn cần ký để tạo khóa spending/view cho ví Stealth. Khóa này sẽ được lưu local.
          </span>
          <Button
            className="w-full py-3 bg-gradient-to-r from-[#F8C265] to-[#38D1BD] text-black text-xl font-bold rounded-full hover:opacity-80 shadow-lg border-none"
            onClick={handleSetKeys}
          >
            Ký để tạo khóa
          </Button>
        </div>
      ) : !firstTimeSignature ? (
        // Bước 3: Ký xác thực với backend nếu chưa ký
        <div className="flex flex-col items-center gap-4 w-full xl:w-2/3">
          <span className="text-6xl mb-2">🖊️</span>
          <h2 className="text-3xl font-bold text-[#F8C265] mb-2">Please sign here</h2>
          <span className="text-lg bg-black bg-opacity-30 px-4 py-2 rounded text-white border border-[#38D1BD] font-semibold w-full">
            Bạn cần ký message để xác thực ví với backend. Bước này sẽ được bỏ trong tương lai với zk-proofs/privy
            wallets.
          </span>
          <Button
            className="w-full py-3 bg-gradient-to-r from-[#F8C265] to-[#38D1BD] text-black text-xl font-bold rounded-full hover:opacity-80 shadow-lg border-none"
            onClick={handleFirstTimeSignMessage}
          >
            Sign and Next
          </Button>
        </div>
      ) : (
        // Đã hoàn thành các bước
        <div className="flex flex-col items-center gap-4 w-full xl:w-2/3">
          <h2 className="text-3xl font-bold text-[#38D1BD] mb-2">Bạn đã hoàn tất xác thực ví!</h2>
        </div>
      )}
    </main>
  );
};
