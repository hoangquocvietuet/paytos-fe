import { ReceiveDialog } from "@/components/ReceiveDialog";
import { SendDialog } from "@/components/SendDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { wallets } from "@/mock";
import { Star } from "lucide-react";

export const WalletPage = () => {
	return (
		<main className="max-w-screen-xl mx-auto flex flex-col items-center gap-10">
			<h1 className="mx-auto text-4xl bg-black inline-block py-1 px-10 rounded-full bg-gradient mt-10">
				Main Wallet
			</h1>
			<div className="flex items-center gap-4 w-2/3 mx-auto font-['Prototype']">
				<Star size={40} fill="#F8C265" stroke="#F8C265" />
				<div className="flex justify-between border p-4 w-full border-gradient text-3xl">
					<p className="text-white">{wallets[0].address}</p>
					<p className="text-[#F8C265]">{wallets[0].balance} USDC</p>
				</div>
			</div>

			<h2 className="mx-auto text-4xl bg-black inline-block py-1 px-10 rounded-full bg-gradient">
				Stealth Wallets
			</h2>
			<div className="w-2/3 flex flex-col gap-6">
				{wallets.map((wallet, index) => (
					<div
						key={index}
						className="flex items-center gap-4 w-full mx-auto font-['Prototype']"
					>
						<p className="flex items-center font-bold text-xl px-4 aspect-square rounded-full bg-[#38D1BD]">
							{index + 1}
						</p>
						<div className="flex justify-between border p-4 w-full border-gradient text-3xl">
							<p className="text-white">{wallets[0].address}</p>
							<p className="text-[#F8C265]">{wallets[0].balance} USDC</p>
						</div>
					</div>
				))}
			</div>
			<div className="w-2/3 flex gap-10">
				<Dialog>
					<DialogTrigger asChild>
						<Button className="flex-1 bg-[#38D1BD] text-black text-2xl font-bold rounded-xl hover:bg-[#38D1BD80]">
							Send
						</Button>
					</DialogTrigger>
					<SendDialog />
				</Dialog>
				<Dialog>
					<DialogTrigger asChild>
						<Button className="flex-1 bg-[#F8C265] text-black text-2xl font-bold rounded-xl hover:bg-[#F8C26580]">
							Receive
						</Button>
					</DialogTrigger>
					<ReceiveDialog />
				</Dialog>
			</div>
		</main>
	);
};
