"use client"
import { Button } from "../components/ui/button";
import censorAddress from "../lib/censorAddress";
import { useContext } from "react";
import { AppContext } from "../components/providers/EthereumProvider";
import { MainTabs } from "@/components/tabs/main/main-tabs";

export default function Home() {
  const { account, accounts, connectWallet, sendTx, isLoading, loadingMessage, deployContract, loadingBy } = useContext(AppContext);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {!account && <Button onClick={connectWallet} >Connect Wallet</Button>}
      {accounts.length > 0 && (
        <>
          <Button onClick={connectWallet} >{censorAddress(account)}</Button>
          <MainTabs ctx={{ isLoading, loadingMessage, deployContract, loadingBy }} />
        </>)}
    </div>
  );
}
