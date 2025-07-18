import { Account, Network, PublicKey, Serializer, SigningSchemeInput } from "@aptos-labs/ts-sdk";
import { NetworkInfo, isAptosNetwork } from "@aptos-labs/wallet-adapter-react";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { secp256k1 } from "@noble/curves/secp256k1";
import { sha256 } from "@noble/hashes/sha2";
import { sha3_256 } from "@noble/hashes/sha3";

export const isValidNetworkName = (network: NetworkInfo | null) => {
  if (isAptosNetwork(network)) {
    return Object.values<string | undefined>(Network).includes(network?.name);
  }
  // If the configured network is not an Aptos network, i.e is a custom network
  // we resolve it as a valid network name
  return true;
};

export const beautifyAddress = (addr: string) => {
  return `${addr.slice(0, 5)}...${addr.slice(addr.length - 5, addr.length)}`;
};

export const publicKeyToAddress = (publicKey: string) => {
  const stealthPubBytes = hexToBytes(publicKey); // compressed 33-byte pubkey
  const prefix = new Uint8Array([0x01]);
  const scheme = new Uint8Array([0x02]);
  const concat = new Uint8Array(prefix.length + stealthPubBytes.length + scheme.length);
  concat.set(prefix, 0);
  concat.set(stealthPubBytes, 1);
  concat.set(scheme, 1 + stealthPubBytes.length);

  const stealthAddressBytes = sha3_256(concat);
  const stealthAddress = `0x${bytesToHex(stealthAddressBytes)}`;
  return stealthAddress;
};

export const getPublicKeyHex = (publicKey: PublicKey) => {
  const serializerPublicKey = new Serializer();
  serializerPublicKey.serialize(publicKey);
  const publicKeyBytes = serializerPublicKey.toUint8Array();
  const publicKeyHex = bytesToHex(publicKeyBytes);
  return publicKeyHex;
};

export const calculateStealthWallet = (
  receipentSpendPublicKey: string, // A
  receipentScanPublicKey: string, // B
) => {
  const fullScanPubHex = receipentScanPublicKey.slice(6);

  const scanPoint = secp256k1.Point.fromHex(fullScanPubHex); // parse uncompressed
  const scanCompressedHex = bytesToHex(scanPoint.toBytes(true)); // compressed

  // 1. Generate ephemeral key pair
  const ephemeralKeyPair = Account.generate({
    scheme: SigningSchemeInput.Secp256k1Ecdsa,
  });

  const ephPriv = ephemeralKeyPair.privateKey.toUint8Array(); // as Uint8Array
  const ephPubHex = ephemeralKeyPair.publicKey.toString(); // hex string

  // 2. Compute shared secret: sha256(e * B)
  const sharedSecretPoint = secp256k1.getSharedSecret(
    ephPriv,
    scanCompressedHex,
    true, // compressed
  );

  const sharedSecret = sha256(sharedSecretPoint.slice(1)); // remove prefix (0x04)

  // 3. Calculate tweak = H(eB) mod n
  const tweak = BigInt("0x" + bytesToHex(sharedSecret)) % secp256k1.CURVE.n;

  // 4. Compute stealth public key: S = A + tweak·G
  const A = secp256k1.Point.fromHex(receipentSpendPublicKey.slice(6));
  const stealthPub = A.add(secp256k1.Point.BASE.multiply(tweak));
  const stealthPubHex = bytesToHex(stealthPub.toBytes(true)); // compressed
  const stealthAddress = publicKeyToAddress(stealthPubHex);

  return {
    ephemeralPublicKey: ephPubHex,
    stealthPublicKey: stealthPubHex,
    stealthAddress: stealthAddress,
  };
};
