# Pawlings Holder Dashboard — Phase 2

Pre-mint holder experience at `/dashboard` with mock ownership, real wallet connection, and Supabase-backed care state.

## Post-mint integration

Replace `MockPawlingsOwnershipProvider` with `OnChainPawlingsOwnershipProvider`. You will need:

| Item | Example |
|------|---------|
| Chain ID | `1` (Ethereum mainnet) |
| Contract address | `0x…` |
| Token standard | ERC-721 or ERC-1155 |
| RPC / indexer | Alchemy, Infura, or Supabase NFT extension |
| Metadata URI pattern | `ipfs://…/{tokenId}.json` |
| Image field in metadata | `image` or `image_url` |

Dashboard UI reads from `PawlingsOwnershipProvider` only — no component changes required.

## Environment variables

```env
PAWLINGS_DASHBOARD_LIVE=false
PAWLINGS_DASHBOARD_PREVIEW_PASSWORD=your-secret-preview-password
PAWLINGS_MOCK_OWNERSHIP=true
```

Set `PAWLINGS_DASHBOARD_LIVE=true` when ready to open publicly (removes preview gate).

## Security before live

- Implement **Sign-In With Ethereum (SIWE)** before valuable rewards — wallet address is currently client-supplied.
- Holder dashboard tables use **RLS enabled with no anon/authenticated policies** — browser clients cannot read or write these tables directly.
- All dashboard DB access goes through `/api/dashboard/*` routes using `SUPABASE_SERVICE_ROLE_KEY` (server-only).

Migration file: `supabase/migrations/20260813000000_holder_dashboard.sql`

## Demo ownership

Connected wallets receive 1–3 deterministic demo Pawlings from an 8-character catalog, hashed from the wallet address. Use Demo Controls (preview only) to force empty/single/multiple views.

Known empty wallet: `0x0000000000000000000000000000000000000001`
