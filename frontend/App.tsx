import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal Components
import { CardHeader } from "@/components/ui/card";
import { useContextTemplate } from "./context/ContextTemplate";
import background from "./assets/image.svg";
import aptos from "./assets/aptos.png";
import { Button } from "./components/ui/button";
import { MoveRight } from "lucide-react";
import { WalletSelector } from "./components/WalletSelector";
import { Link } from "react-router-dom";

function App() {
	const { connected, isLoading } = useWallet();

	return (
		<>
			{/* <Header /> */}
			<div className="relative bg-[#1F2427] w-full h-screen pt-10">
				{connected ? (
					<>
						<img
							src={background}
							alt="background"
							className="min-w-full min-h-screen max-h-screen absolute top-0 left-0 bg-transparent p-4 z-1"
						/>
						<img
							src={aptos}
							alt="Aptos Coin"
							className="absolute z-20 left-1/2 -translate-x-1/2 bottom-4 animate-bounce-subtle"
						/>
						<div className="relative flex flex-col items-center text-white text-center z-10 h-full">
							<h2 className="text-4xl font-bold mb-4">
								<span className="text-gradient">Privacy Payment</span> in crypto
							</h2>
							<h2 className="text-6xl font-bold">
								<span className="text-gradient">Stealth Address</span> &{" "}
								<span className="text-gradient">Bank</span>
							</h2>
							<h1 className="text-[256px] font-bold text-gradient tracking-widest -mt-10">
								PAYTOS
							</h1>
						</div>
						<Link to="/wallet" className="z-50">
							<Button className="absolute bottom-5 z-50 left-1/2 -translate-x-1/2 flex items-center gap-2 text-black bg-white text-3xl font-bold p-8 rounded-full hover:bg-white/80">
								Explore now
								<MoveRight className="w-10 h-10" />
							</Button>
						</Link>
					</>
				) : (
					<CardHeader>
						<WalletSelector />
					</CardHeader>
				)}
			</div>
		</>
	);
}

export default App;
