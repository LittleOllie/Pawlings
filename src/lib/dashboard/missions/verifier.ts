import type { SocialMissionVerifier, VerificationResult } from "../ownership/types";

/**
 * Manual confirmation verifier — opens X links and trusts user confirmation.
 * TODO(post-launch): XApiSocialMissionVerifier when API access is available.
 */
export class ManualSocialMissionVerifier implements SocialMissionVerifier {
  async verify(_missionId: string, _walletAddress: string): Promise<VerificationResult> {
    return { verified: true, message: "Manual confirmation accepted." };
  }
}

export function createMissionVerifier(): SocialMissionVerifier {
  return new ManualSocialMissionVerifier();
}
