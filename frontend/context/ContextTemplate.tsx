import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { secp256k1 } from "@noble/curves/secp256k1";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";
import { Account, AptosConfig, Secp256k1PrivateKey } from "@aptos-labs/ts-sdk";
import { v4 as uuidv4 } from "uuid";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getPublicKeyHex } from "../utils/helpers";
import { Aptos, Network } from "@aptos-labs/ts-sdk";

// Đổi tên Context này cho phù hợp với mục đích sử dụng
const ContextTemplateContext = createContext<ContextTemplateContextType | undefined>(undefined);

interface ContextTemplateContextType {
  metaViewPublicKey: string | null;
  metaViewPrivateKey: string | null;
  metaSpendPrivateKey: string | null;
  metaSpendPublicKey: string | null;
  setKeys: () => Promise<void>;
  username: string | null;
  setUsername: (username: string) => void;
  setUsernameByPublicKey: () => void;
  firstTimeSignature: string | null;
  firstTimeSignMessage: () => Promise<void>;
  firstTimeMessage: string | null;
  getBalance: (address: string) => Promise<number>;
  stealthWallets: any[];
}

interface ContextTemplateProviderProps {
  children: ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL;
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

// Đổi tên Provider này cho phù hợp với mục đích sử dụng
export const ContextTemplateProvider = ({ children }: ContextTemplateProviderProps) => {
  const { account, signMessage } = useWallet();

  // Thêm state và logic ở đây
  const [metaViewPublicKey, setMetaViewPublicKey] = useState<string | null>(null);
  const [metaViewPrivateKey, setMetaViewPrivateKey] = useState<string | null>(null);
  const [metaSpendPrivateKey, setMetaSpendPrivateKey] = useState<string | null>(null);
  const [metaSpendPublicKey, setMetaSpendPublicKey] = useState<string | null>(null);
  const [username, setUsernameState] = useState<string | null>(null);
  const [firstTimeSignature, setFirstTimeSignature] = useState<string | null>(null);
  const [firstTimeMessage, setFirstTimeMessage] = useState<string | null>(null);
  const [stealthWallets, setStealthWallets] = useState<any[]>([]);

  const setKeys = async () => {
    if (!account) {
      return;
    }
    const data = await signMessage({
      message: "Hello from Paytos! Please sign this message to create your stealth wallet.",
      nonce: "Paytos",
    });
    const signature = data.signature.toString();
    const metaViewSeed = signature + "metaview";
    const metaSpendSeed = signature + "metaspend";
    const metaViewPrivateKey = BigInt("0x" + bytesToHex(sha256(utf8ToBytes(metaViewSeed)))) % secp256k1.CURVE.n;
    const metaSpendPrivateKey = BigInt("0x" + bytesToHex(sha256(utf8ToBytes(metaSpendSeed)))) % secp256k1.CURVE.n;
    const metaViewPrivateKeyHex = metaViewPrivateKey.toString(16).padStart(64, "0");
    const metaSpendPrivateKeyHex = metaSpendPrivateKey.toString(16).padStart(64, "0");
    const metaViewAccount = Account.fromPrivateKey({
      privateKey: new Secp256k1PrivateKey(metaViewPrivateKeyHex),
    });
    const metaSpendAccount = Account.fromPrivateKey({
      privateKey: new Secp256k1PrivateKey(metaSpendPrivateKeyHex),
    });

    try {
      const res1 = await fetch(`${API_URL}/encryption/encrypt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: metaViewPrivateKeyHex,
        }),
      });
      // 2. Kiểm tra response status trước khi parse JSON
      if (!res1.ok) {
        const errorText = await res1.text();
        console.error("Encryption API Error:", errorText);
        throw new Error(`Encryption API failed: ${res1.status}`);
      }

      const data = await res1.json();
      console.log("Encryption data:", data);

      const res = await fetch(`${API_URL}/stealth/meta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aptosPublicKey: getPublicKeyHex(account.publicKey),
          scanPublicKey: metaViewAccount.publicKey.toString(),
          scanPrivateKeyEncrypted: data.encrypted,
          spendPublicKey: metaSpendAccount.publicKey.toString(),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Stealth Meta API Error:", errorText);
        throw new Error(`Stealth Meta API failed: ${res.status}`);
      }

      const data2 = await res.json();
      console.log("data2", data2);

      setMetaViewPublicKey(metaViewAccount.publicKey.toString());
      setMetaViewPrivateKey(metaViewPrivateKeyHex);
      setMetaSpendPublicKey(metaSpendAccount.publicKey.toString());
      setMetaSpendPrivateKey(metaSpendPrivateKeyHex);

      // storage into local storage
      localStorage.setItem("metaViewPublicKey", metaViewAccount.publicKey.toString());
      localStorage.setItem("metaViewPrivateKey", metaViewPrivateKeyHex);
      localStorage.setItem("metaSpendPublicKey", metaSpendAccount.publicKey.toString());
      localStorage.setItem("metaSpendPrivateKey", metaSpendPrivateKeyHex);
    } catch (error) {
      console.log("error", error);
    }
  };

  const firstTimeSignMessage = async () => {
    const data = await signMessage({
      message: "Hello from Paytos! Please sign this message to authenticate." + uuidv4(),
      nonce: "0",
    });
    const signature = data.signature.toString();
    const message = data.fullMessage;
    setFirstTimeSignature(signature);
    setFirstTimeMessage(message);
  };

  const setUsername = (username: string) => {
    localStorage.setItem("username", username);
    setUsernameState(username);
  };

  const setUsernameByPublicKey = async () => {
    if (!account || !account.address) {
      return;
    }
    const publicKeyHex = getPublicKeyHex(account.publicKey);

    try {
      const res = await fetch(`${API_URL}/users/public-key?aptosPublicKey=${publicKeyHex}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Users API Error:", errorText);
        throw new Error(`Users API failed: ${res.status}`);
      }

      const data = await res.json();
      setUsernameState(data.username);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const metaViewPublicKey = localStorage.getItem("metaViewPublicKey");
    const metaViewPrivateKey = localStorage.getItem("metaViewPrivateKey");
    const metaSpendPublicKey = localStorage.getItem("metaSpendPublicKey");
    const metaSpendPrivateKey = localStorage.getItem("metaSpendPrivateKey");
    const username = localStorage.getItem("username");
    if (metaViewPublicKey && metaViewPrivateKey && metaSpendPublicKey && metaSpendPrivateKey) {
      setMetaViewPublicKey(metaViewPublicKey);
      setMetaViewPrivateKey(metaViewPrivateKey);
      setMetaSpendPublicKey(metaSpendPublicKey);
      setMetaSpendPrivateKey(metaSpendPrivateKey);
      setUsernameState(username);
    }
  }, []);

  useEffect(() => {
    const fetchStealthWallets = async () => {
      if (!account) {
        return;
      }
      const publicKeyHex = getPublicKeyHex(account.publicKey);
      const res = await fetch(
        `${API_URL}/stealth/addresses?aptosPublicKey=${publicKeyHex}&address=${account.address.toString()}`,
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Stealth Addresses API Error:", errorText);
        throw new Error(`Stealth Addresses API failed: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);
      setStealthWallets(data.data);
    };
    fetchStealthWallets();
  }, [account]);

  const getBalance = async (address: string) => {
    try {
      return await aptos
        .getCurrentFungibleAssetBalances({
          options: {
            where: {
              owner_address: { _eq: address },
              asset_type: { _eq: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832" },
            },
          },
        })
        .then((res) => {
          // sum all amount
          return res.reduce((acc, curr) => acc + Number(curr.amount), 0) / 10 ** 6;
        });
    } catch (error) {
      console.error("Get Balance Error:", error);
      return 0;
    }
  };

  // Giá trị context cung cấp
  const value: ContextTemplateContextType = {
    metaViewPublicKey,
    metaViewPrivateKey,
    metaSpendPrivateKey,
    metaSpendPublicKey,
    setKeys,
    username,
    setUsername,
    setUsernameByPublicKey,
    firstTimeSignature,
    firstTimeSignMessage,
    firstTimeMessage,
    getBalance,
    stealthWallets,
  };

  return <ContextTemplateContext.Provider value={value}>{children}</ContextTemplateContext.Provider>;
};

// Đổi tên hook này cho phù hợp với mục đích sử dụng
export const useContextTemplate = () => {
  const context = useContext(ContextTemplateContext);
  if (context === undefined) {
    throw new Error("useContextTemplate phải được dùng bên trong ContextTemplateProvider");
  }
  return context;
};

export { ContextTemplateContext };
