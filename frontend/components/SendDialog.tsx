import {
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogHeader,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const SendDialog = () => {
	return (
		<DialogContent className="bg-[#1F2427] text-white border-none">
			<DialogHeader>
				<DialogTitle className="text-3xl text-center mb-10">Send</DialogTitle>
				<DialogDescription className="flex flex-col gap-4 text-lg">
					<Input
						placeholder="Enter username"
						className="border-gradient-rounded focus-visible:ring-0 bg-[#1F2427] text-white"
					/>
					<p>Balance: 100 USDC</p>
					<Input
						placeholder="Enter amount"
						className="border-gradient-rounded focus-visible:ring-0 bg-[#1F2427] text-white"
					/>
					<Button className="bg-gradient text-black text-xl">Send</Button>
				</DialogDescription>
			</DialogHeader>
		</DialogContent>
	);
};
