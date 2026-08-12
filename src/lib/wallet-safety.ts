/**
 * SECURITY NOTE: Future wallet-connect, NFT transfer, token transfer,
 * message signing, and transaction functionality MUST be scoped, reviewed,
 * and implemented in a separate phase with explicit security review.
 *
 * See docs/FUTURE_WALLET_FEATURES.md for details.
 *
 * Phase 1 of this application:
 * - NEVER requests seed phrases or private keys
 * - NEVER connects wallets
 * - NEVER initiates blockchain transactions
 * - NEVER requests message/transaction signatures
 * - Uses ceremonial drawn signatures only
 */

export const WALLET_SAFETY_POLICY = {
  phase1Restrictions: [
    "no_seed_phrase",
    "no_private_key",
    "no_wallet_connect",
    "no_transactions",
    "no_message_signing",
    "ceremonial_signature_only",
  ],
  futureFeaturesRequireSeparateReview: true,
} as const;
