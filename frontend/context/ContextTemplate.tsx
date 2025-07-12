import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { secp256k1 } from "@noble/curves/secp256k1";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";
import { Account, Secp256k1PrivateKey, Serializer } from "@aptos-labs/ts-sdk";
import { v4 as uuidv4 } from "uuid";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getPublicKeyHex } from "../utils/helpers";

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
}

interface ContextTemplateProviderProps {
  children: ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL;

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
  const [signatureHex, setSignatureHex] = useState<string | null>(null);

  const setKeys = async () => {
    const data = await signMessage({
      message: "Hello from Paytos! Please sign this message to authenticate.",
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
    setMetaViewPublicKey(metaViewAccount.publicKey.toString());
    setMetaViewPrivateKey(metaViewPrivateKeyHex);
    setMetaSpendPublicKey(metaSpendAccount.publicKey.toString());
    setMetaSpendPrivateKey(metaSpendPrivateKeyHex);

    // storage into local storage
    localStorage.setItem("metaViewPublicKey", metaViewAccount.publicKey.toString());
    localStorage.setItem("metaViewPrivateKey", metaViewPrivateKeyHex);
    localStorage.setItem("metaSpendPublicKey", metaSpendAccount.publicKey.toString());
    localStorage.setItem("metaSpendPrivateKey", metaSpendPrivateKeyHex);
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

    const serializerSignature = new Serializer();
    serializerSignature.serialize(data.signature);
    const signatureHex = bytesToHex(serializerSignature.toUint8Array());
    setSignatureHex(signatureHex);
  };

  const setUsername = (username: string) => {
    localStorage.setItem("username", username);
    setUsernameState(username);
  };

  const setUsernameByPublicKey = async () => {
    if (!firstTimeSignature || !firstTimeMessage || !account || !account.address) {
      return;
    }
    const publicKeyHex = getPublicKeyHex(account.publicKey);
    const messageHex = bytesToHex(utf8ToBytes(firstTimeMessage));

    try {
      const res = await fetch(`${API_URL}/users/public-key/${account.publicKey.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKeyHex: publicKeyHex,
          signatureHex: signatureHex,
          messageHex: messageHex,
        }),
      });
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
