import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleArrowUp } from "lucide-react";
import { useState } from "react";
import { useContextTemplate } from "@/context/ContextTemplate";

export const TransactionPage = () => {
  const { stealthWallets } = useContextTemplate();
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>(stealthWallets);

  const filter = (type: string) => {
    if (type === "ALL") {
      setFilteredTransactions(stealthWallets);
      return;
    }

    const filtered = stealthWallets.filter((transaction) => transaction.direction === type);
    setFilteredTransactions(filtered);
  };

  return (
    <main className="flex w-full max-w-screen-xl mx-auto flex-col gap-6">
      <Tabs defaultValue="all" className="px-2 xl:px-0">
        <TabsList className="grid w-full grid-cols-3 bg-[#000000] mb-10">
          <TabsTrigger value="all" onClick={() => filter("ALL")}>
            All
          </TabsTrigger>
          <TabsTrigger value="in" onClick={() => filter("IN")}>
            Received
          </TabsTrigger>
          <TabsTrigger value="out" onClick={() => filter("OUT")}>
            Sent
          </TabsTrigger>
        </TabsList>
        <section className="text-white flex flex-col gap-4">
          {filteredTransactions.map((transaction, index) => (
            <div className="flex gap-2 border-b border-white pb-4" key={index}>
              {transaction.type ? (
                <CircleArrowUp strokeWidth={1} className="-rotate-45" stroke="white" size={40} />
              ) : (
                <CircleArrowUp strokeWidth={1} className="rotate-[135deg]" stroke="#F8C265" size={40} />
              )}
              <div className="w-full">
                <div className="flex items-center text-xl xl:text-3xl">
                  <p>{transaction.type ? "Sent" : "Received"}</p>
                </div>
                <div className="flex justify-between text-md xl:text-xl font-['Prototype']">
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
