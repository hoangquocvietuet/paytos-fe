import { WalletSelector } from "./WalletSelector";
import logo from "../assets/logo.svg";
import { Link, NavLink } from "react-router-dom";
import { ArrowLeftRight, Wallet } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { beautifyAddress } from "@/utils/helpers";

export function Header() {
  const { account } = useWallet();

  return (
    <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full">
      <div className="hidden xl:flex items-center text-3xl gap-20 text-white">
        <Link to="/">
          <img src={logo} alt="Paytos logo" />
        </Link>
        <NavLink to="/wallet" className={({ isActive }) => `${isActive ? "text-[#38D1BD]" : ""} font-bold`}>
          Wallet
        </NavLink>
        <NavLink to="/transaction" className={({ isActive }) => `${isActive ? "text-[#38D1BD]" : ""} font-bold`}>
          Transaction
        </NavLink>
      </div>

      <div className="flex justify-between items-center xl:hidden w-full">
        <Link to="/" className="text-2xl tracking-widest text-gradient">
          PAYTOS
        </Link>
        <div className="flex gap-2 items-center">
          <Wallet />
          <h3>{beautifyAddress(account?.address.toString() || "")}</h3>
          {/* <WalletSelector /> */}
        </div>
      </div>

      <div className="flex gap-8 px-10 py-4 left-1/2 -translate-x-1/2 rounded-full xl:hidden fixed bottom-6 z-50 bg-[#38474A]">
        <NavLink to="/wallet" className={({ isActive }) => `${isActive ? "text-[#38D1BD]" : ""}`}>
          <Wallet size={30} />
        </NavLink>
        <NavLink to="/transaction" className={({ isActive }) => `${isActive ? "text-[#38D1BD]" : ""}`}>
          <ArrowLeftRight size={30} />
        </NavLink>
      </div>
    </div>
  );
}
