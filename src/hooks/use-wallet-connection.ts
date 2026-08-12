"use client";

import { useCallback, useEffect, useState } from "react";
import { formatWalletForDisplay } from "@/lib/wallet";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export type WalletConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "wrong_network"
  | "no_provider";

export interface WalletState {
  status: WalletConnectionStatus;
  address: string | null;
  displayAddress: string | null;
  chainId: number | null;
  error: string | null;
}

const SUPPORTED_CHAIN_IDS = new Set([1, 11155111, 8453, 84532]);

function getProvider(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  return window.ethereum ?? null;
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function useWalletConnection() {
  const [state, setState] = useState<WalletState>({
    status: "disconnected",
    address: null,
    displayAddress: null,
    chainId: null,
    error: null,
  });

  const syncFromProvider = useCallback(async (provider: EthereumProvider) => {
    try {
      const accounts = (await provider.request({ method: "eth_accounts" })) as string[];
      const chainHex = (await provider.request({ method: "eth_chainId" })) as string;
      const chainId = parseInt(chainHex, 16);
      const address = accounts[0] ?? null;

      if (!address) {
        setState({
          status: "disconnected",
          address: null,
          displayAddress: null,
          chainId,
          error: null,
        });
        return;
      }

      const checksummed = formatWalletForDisplay(address);
      setState({
        status: SUPPORTED_CHAIN_IDS.has(chainId) ? "connected" : "wrong_network",
        address: checksummed,
        displayAddress: shortenAddress(checksummed),
        chainId,
        error: SUPPORTED_CHAIN_IDS.has(chainId)
          ? null
          : "Please switch to a supported network in your wallet.",
      });
    } catch {
      setState((s) => ({
        ...s,
        status: "disconnected",
        error: "We couldn't connect to your wallet. Please try again.",
      }));
    }
  }, []);

  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    void syncFromProvider(provider);

    const onAccounts = (accounts: unknown) => {
      const list = accounts as string[];
      if (!list?.length) {
        setState({
          status: "disconnected",
          address: null,
          displayAddress: null,
          chainId: state.chainId,
          error: null,
        });
        return;
      }
      void syncFromProvider(provider);
    };

    const onChain = () => {
      void syncFromProvider(provider);
    };

    provider.on?.("accountsChanged", onAccounts);
    provider.on?.("chainChanged", onChain);

    return () => {
      provider.removeListener?.("accountsChanged", onAccounts);
      provider.removeListener?.("chainChanged", onChain);
    };
  }, [syncFromProvider, state.chainId]);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setState((s) => ({
        ...s,
        status: "no_provider",
        error: "MetaMask is not installed. Please install a browser wallet to continue.",
      }));
      return;
    }

    setState((s) => ({ ...s, status: "connecting", error: null }));

    try {
      const accounts = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (!accounts.length) {
        setState((s) => ({
          ...s,
          status: "disconnected",
          error: "Connection was cancelled.",
        }));
        return;
      }

      await syncFromProvider(provider);
    } catch {
      setState((s) => ({
        ...s,
        status: "disconnected",
        error: "Connection was rejected. Please try again when you're ready.",
      }));
    }
  }, [syncFromProvider]);

  const disconnect = useCallback(() => {
    setState({
      status: "disconnected",
      address: null,
      displayAddress: null,
      chainId: null,
      error: null,
    });
  }, []);

  return { ...state, connect, disconnect, isConnected: state.status === "connected" };
}
