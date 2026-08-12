"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AdoptionPapersOverlay } from "./adoption-papers-overlay";

interface AdoptionOverlayContextValue {
  isOpen: boolean;
  openAdoption: () => void;
  closeAdoption: () => void;
}

const AdoptionOverlayContext =
  createContext<AdoptionOverlayContextValue | null>(null);

interface AdoptionOverlayProviderProps {
  children: ReactNode;
  canSubmit: boolean;
  closedMessage: string;
}

export function AdoptionOverlayProvider({
  children,
  canSubmit,
  closedMessage,
}: AdoptionOverlayProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openAdoption = useCallback(() => setIsOpen(true), []);
  const closeAdoption = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#apply" || window.location.hash === "#adopt") {
        openAdoption();
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [openAdoption]);

  const value = useMemo(
    () => ({ isOpen, openAdoption, closeAdoption }),
    [isOpen, openAdoption, closeAdoption]
  );

  return (
    <AdoptionOverlayContext.Provider value={value}>
      {children}
      <AdoptionPapersOverlay
        open={isOpen}
        onClose={closeAdoption}
        canSubmit={canSubmit}
        closedMessage={closedMessage}
      />
    </AdoptionOverlayContext.Provider>
  );
}

export function useAdoptionOverlay() {
  const ctx = useContext(AdoptionOverlayContext);
  if (!ctx) {
    throw new Error(
      "useAdoptionOverlay must be used within AdoptionOverlayProvider"
    );
  }
  return ctx;
}

export function useAdoptionOverlayOptional() {
  return useContext(AdoptionOverlayContext);
}
