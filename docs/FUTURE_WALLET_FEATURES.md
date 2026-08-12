# Future Wallet Features

> **NOT IMPLEMENTED IN PHASE 1**

This document describes wallet-related features planned for a future phase. These require a separate security review before implementation.

## Planned Features (Phase 2+)

### Wallet Connect
- Connect wallet via WalletConnect or injected provider
- Auto-fill wallet address from connected wallet
- Display connected wallet in UI

### NFT Ownership Checks
- Verify applicant owns specific NFT(s)
- Token-gated application requirements
- On-chain eligibility verification

### Message Signing
- Sign messages to prove wallet ownership
- Nonce-based challenge/response
- Clear UI explaining what is being signed

### Transaction Signing
- Mint transactions
- NFT transfer requests
- Token transfer flows

## Security Requirements for Phase 2

Before implementing ANY of the above:

1. **Separate security review** — Independent audit of transaction flows
2. **Explicit transaction previews** — User must see exactly what they're signing
3. **Scope limitation** — Each feature implemented and reviewed independently
4. **No hidden transfers** — All transaction logic must be visible in UI
5. **Testnet first** — Deploy and test on testnet before mainnet
6. **Rate limiting** — Additional protection for on-chain interactions
7. **Documentation** — User-facing explanation of each wallet interaction

## Current Phase 1 Restrictions

The codebase enforces these restrictions in Phase 1:

```typescript
// src/lib/wallet-safety.ts
export const WALLET_SAFETY_POLICY = {
  phase1Restrictions: [
    "no_seed_phrase",
    "no_private_key",
    "no_wallet_connect",
    "no_transactions",
    "no_message_signing",
    "ceremonial_signature_only",
  ],
};
```

## Implementation Notes

When adding wallet connect:
- Use a well-maintained library (wagmi, RainbowKit, etc.)
- Never store private keys or seed phrases
- Separate wallet connect UI from application form
- Add feature flag in site_settings to enable/disable
- Update privacy policy and terms

When adding transactions:
- Always show transaction preview modal
- Require explicit user confirmation
- Log all transaction attempts in audit log
- Handle failures gracefully
- Never batch unexpected transactions
