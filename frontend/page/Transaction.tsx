import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { transactions } from "@/mock";
import { CircleArrowUp } from "lucide-react";
import { useState } from "react";

export const TransactionPage = () => {
	const [filteredTransactions, setFilteredTransactions] =
		useState(transactions);

	const filter = (type: number) => {
		if (type === -1) {
			setFilteredTransactions(transactions);
			return;
		}

		const filtered = transactions.filter(
			(transaction) => transaction.type === type,
		);
		setFilteredTransactions(filtered);
	};

	return (
		<main className="flex w-full max-w-screen-xl mx-auto flex-col gap-6">
			<Tabs defaultValue="all">
				<TabsList className="grid w-full grid-cols-3 bg-[#000000] mb-10">
					<TabsTrigger value="all" onClick={() => filter(-1)}>
						All
					</TabsTrigger>
					<TabsTrigger value="in" onClick={() => filter(0)}>
						In
					</TabsTrigger>
					<TabsTrigger value="out" onClick={() => filter(1)}>
						Out
					</TabsTrigger>
				</TabsList>
				<section className="text-white flex flex-col gap-4">
					{filteredTransactions.map((transaction, index) => (
						<div className="flex gap-2 border-b border-white pb-4" key={index}>
							{transaction.type ? (
								<CircleArrowUp
									strokeWidth={1}
									className="-rotate-45"
									stroke="white"
									size={40}
								/>
							) : (
								<CircleArrowUp
									strokeWidth={1}
									className="rotate-[135deg]"
									stroke="#F8C265"
									size={40}
								/>
							)}
							<div className="w-full">
								<div className="flex items-center text-3xl">
									<p>{transaction.type ? "Sent" : "Received"}</p>
								</div>
								<div className="flex justify-between text-xl font-['Prototype']">
									<p>{transaction.address}</p>
									<p className="text-[#F8C265]">{transaction.amount} USDC</p>
								</div>
							</div>
						</div>
					))}
				</section>
			</Tabs>
		</main>
	);
};
