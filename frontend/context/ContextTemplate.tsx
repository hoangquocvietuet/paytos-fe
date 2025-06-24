import { AptosSignMessageInput, AptosSignMessageOutput } from "@aptos-labs/wallet-adapter-react";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { secp256k1 } from "@noble/curves/secp256k1";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";
import { Account, Secp256k1PrivateKey } from "@aptos-labs/ts-sdk";

// Đổi tên Context này cho phù hợp với mục đích sử dụng
const ContextTemplateContext = createContext<ContextTemplateContextType | undefined>(undefined);

interface ContextTemplateContextType {
  metaViewPublicKey: string | null;
  metaViewPrivateKey: string | null;
  metaSpendPrivateKey: string | null;
  metaSpendPublicKey: string | null;
  setKeys: (signMessage: (message: AptosSignMessageInput) => Promise<AptosSignMessageOutput>) => void;
}

interface ContextTemplateProviderProps {
  children: ReactNode;
}

// Đổi tên Provider này cho phù hợp với mục đích sử dụng
export const ContextTemplateProvider = ({ children }: ContextTemplateProviderProps) => {
  // Thêm state và logic ở đây
  const [metaViewPublicKey, setMetaViewPublicKey] = useState<string | null>(null);
  const [metaViewPrivateKey, setMetaViewPrivateKey] = useState<string | null>(null);
  const [metaSpendPrivateKey, setMetaSpendPrivateKey] = useState<string | null>(null);
  const [metaSpendPublicKey, setMetaSpendPublicKey] = useState<string | null>(null);

  const setKeys = async (signMessage: (message: AptosSignMessageInput) => Promise<AptosSignMessageOutput>) => {
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

  useEffect(() => {
    const metaViewPublicKey = localStorage.getItem("metaViewPublicKey");
    const metaViewPrivateKey = localStorage.getItem("metaViewPrivateKey");
    const metaSpendPublicKey = localStorage.getItem("metaSpendPublicKey");
    const metaSpendPrivateKey = localStorage.getItem("metaSpendPrivateKey");
    if (metaViewPublicKey && metaViewPrivateKey && metaSpendPublicKey && metaSpendPrivateKey) {
      setMetaViewPublicKey(metaViewPublicKey);
      setMetaViewPrivateKey(metaViewPrivateKey);
      setMetaSpendPublicKey(metaSpendPublicKey);
      setMetaSpendPrivateKey(metaSpendPrivateKey);
    }
  }, []);

  // Giá trị context cung cấp
  const value: ContextTemplateContextType = {
    metaViewPublicKey,
    metaViewPrivateKey,
    metaSpendPrivateKey,
    metaSpendPublicKey,
    setKeys,
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
