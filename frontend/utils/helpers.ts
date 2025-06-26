import { Network, PublicKey, Serializer } from "@aptos-labs/ts-sdk";
import { NetworkInfo, isAptosNetwork } from "@aptos-labs/wallet-adapter-react";
import { bytesToHex } from "@noble/hashes/utils";

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

export const getPublicKeyHex = (publicKey: PublicKey) => {
  const serializerPublicKey = new Serializer();
  serializerPublicKey.serialize(publicKey);
  const publicKeyBytes = serializerPublicKey.toUint8Array();
  const publicKeyHex = bytesToHex(publicKeyBytes);
  return publicKeyHex;
};
