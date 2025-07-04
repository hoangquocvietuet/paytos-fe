import { QrCode } from "lucide-react";
import {
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogHeader,
} from "./ui/dialog";
import { Input } from "./ui/input";

export const ReceiveDialog = () => {
	return (
		<DialogContent className="bg-[#1F2427] text-white border-none">
			<DialogHeader>
				<DialogTitle className="text-3xl text-center mb-5">Receive</DialogTitle>
				<DialogDescription className="flex flex-col gap-4 text-lg items-center">
					<div className="w-full text-white">
						<p className="text-lg">Username</p>
						<Input
							placeholder="Enter username"
							className="border-gradient-rounded focus-visible:ring-0 bg-[#1F2427] text-white text-lg"
						/>
					</div>
					<QrCode size={200} strokeWidth={1} stroke="white" />
				</DialogDescription>
			</DialogHeader>
		</DialogContent>
	);
};
