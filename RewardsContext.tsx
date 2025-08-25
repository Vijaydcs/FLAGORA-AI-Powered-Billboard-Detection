"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    ethereum?: any;
  }
}

type RewardsContextType = {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  points: number;
  grantPoints: (by: number) => Promise<void>;
  tokenSymbol: string;
  tokenBalance: string;
  isMinting: boolean;
};

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

const STORAGE_KEY = "finora_points";
const NEXT_PUBLIC_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || ""; // set in .env.local
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111); // default Sepolia

export const RewardsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [tokenSymbol, setTokenSymbol] = useState<string>("FNR");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [isMinting, setIsMinting] = useState(false);

  // read from localStorage
  useEffect(() => {
    if (!address) return;
    const raw = localStorage.getItem(STORAGE_KEY);
    const map = raw ? JSON.parse(raw) as Record<string, number> : {};
    setPoints(map[address] || 0);
  }, [address]);

  const savePoints = (addr: string, value: number) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const map = raw ? JSON.parse(raw) as Record<string, number> : {};
    map[addr] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  };

  const connect = async () => {
    if (!window.ethereum) {
      toast({ title: "MetaMask not found", description: "Install the MetaMask extension to continue." });
      return;
    }
    const [acc] = await window.ethereum.request({ method: "eth_requestAccounts" });
    const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
    const cid = parseInt(chainIdHex, 16);
    if (cid !== CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x" + CHAIN_ID.toString(16) }],
        });
      } catch (err:any) {
        toast({ title: "Wrong network", description: "Please switch to the configured network in MetaMask." });
      }
    }
    setAddress(acc);
  };

  const disconnect = () => {
    setAddress(null);
  };

  // fetch token info/balance if configured
  useEffect(() => {
    (async () => {
      if (!address || !NEXT_PUBLIC_TOKEN_ADDRESS) return;
      const { BrowserProvider, Contract } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const { ERC20_ABI } = await import("@/lib/erc20Abi");
      const contract = new Contract(NEXT_PUBLIC_TOKEN_ADDRESS, ERC20_ABI, signer);
      try {
        const sym = await contract.symbol();
        setTokenSymbol(sym);
      } catch {}
      try {
        const bal = await contract.balanceOf(address);
        setTokenBalance(bal.toString());
      } catch {}
    })();
  }, [address]);

  const maybeMint = async (current: number) => {
    if (!address) return;
    // Every 100 points => 1 token (configurable). Mint on-chain if contract address present.
    if (current > 0 && current % 100 === 0 && NEXT_PUBLIC_TOKEN_ADDRESS) {
      try {
        setIsMinting(true);
        const { BrowserProvider, Contract, parseUnits } = await import("ethers");
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const { ERC20_ABI } = await import("@/lib/erc20Abi");
        const c = new Contract(NEXT_PUBLIC_TOKEN_ADDRESS, ERC20_ABI, signer);
        // mint 1 token per 100 points
        const decimals = await c.decimals().catch(() => 18);
        const tx = await c.mint(address, parseUnits("1", decimals));
        toast({ title: "Mint submitted", description: `Transaction: ${tx.hash}` });
        await tx.wait();
        // refresh balance
        const bal = await c.balanceOf(address);
        setTokenBalance(bal.toString());
        toast({ title: "Reward minted", description: `You received 1 ${tokenSymbol}!` });
      } catch (e:any) {
        console.error(e);
        toast({ title: "Mint failed", description: e?.message ?? "Unknown error" });
      } finally {
        setIsMinting(false);
      }
    }
  };

  const grantPoints = async (by: number) => {
    if (!address) {
      toast({ title: "Connect wallet", description: "Please connect MetaMask first." });
      return;
    }
    const newPts = points + by;
    setPoints(newPts);
    savePoints(address, newPts);
    toast({ title: `+${by} points`, description: `You now have ${newPts} points.` });
    await maybeMint(newPts);
  };

  const value = useMemo(() => ({
    address,
    isConnected: !!address,
    connect,
    disconnect,
    points,
    grantPoints,
    tokenSymbol,
    tokenBalance,
    isMinting,
  }), [address, points, tokenBalance, tokenSymbol, isMinting]);

  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>;
};

export const useRewards = () => {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error("useRewards must be used within RewardsProvider");
  return ctx;
};
