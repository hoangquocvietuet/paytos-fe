import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "@/App.tsx";
// Internal components
import { Toaster } from "@/components/ui/toaster.tsx";
import { WalletProvider } from "@/components/WalletProvider.tsx";
import { WrongNetworkAlert } from "@/components/WrongNetworkAlert";
import { ContextTemplateProvider } from "./context/ContextTemplate";
import { AppLayout } from "./components/AppLayout";
import { TransactionPage } from "./page/Transaction";
import { WalletPage } from "./page/Wallet";
import { LoginPage } from "./page/Login";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/",
    Component: AppLayout,
    children: [
      { path: "login", Component: LoginPage },
      { path: "wallet", Component: WalletPage },
      { path: "transaction", Component: TransactionPage },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
        <ContextTemplateProvider>
          <RouterProvider router={router} />
        </ContextTemplateProvider>
        <WrongNetworkAlert />
        <Toaster />
      </QueryClientProvider>
    </WalletProvider>
  </React.StrictMode>,
);
