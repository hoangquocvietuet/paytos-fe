import {
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogHeader,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const SendDialog = () => {
	return (
		<AlertDialogContent className="bg-[#1F2427] text-white border-none">
			<AlertDialogHeader>
				<AlertDialogTitle className="text-3xl text-center mb-10">
					Send
				</AlertDialogTitle>
				<AlertDialogDescription className="flex flex-col gap-4 text-lg">
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
				</AlertDialogDescription>
			</AlertDialogHeader>
		</AlertDialogContent>
	);
};
