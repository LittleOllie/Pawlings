import type { Pawling } from "@/types/dashboard";

export interface PawlingsOwnershipProvider {
  getPawlingsForWallet(
    walletAddress: string,
    options?: { forceEmpty?: boolean; forceCount?: number }
  ): Promise<Pawling[]>;
}

export interface VerificationResult {
  verified: boolean;
  message?: string;
}

export interface SocialMissionVerifier {
  verify(missionId: string, walletAddress: string): Promise<VerificationResult>;
}
