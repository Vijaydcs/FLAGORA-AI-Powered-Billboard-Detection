# Rewards & MetaMask Integration

This update adds a **points + token rewards** system:

- **+10 points** for each admin-verified photo/report.
- **Every 100 points ⇒ 1 FNR token** minted to the reporter's wallet via MetaMask.

## How it works

- Points are stored locally (per wallet) in `localStorage` under `finora_points` for demo purposes.
- When an admin clicks **"Verify & Reward +10"** in the Dashboard, the connected user gets 10 points.
- On reaching 100, 200, 300... points, the app calls the token contract's `mint(address, amount)` using MetaMask.
- Contract address and chain are configurable via env vars.

## Setup

1. Install deps:
   ```bash
   npm i ethers @openzeppelin/contracts
   ```

2. Deploy the ERC20 token (Hardhat, Foundry, or Remix). Example contract in `contracts/FinoraToken.sol`.
   - After deployment, note the **token address** and **decimals** (OpenZeppelin default = 18).

3. Configure `.env.local`:
   ```bash
   NEXT_PUBLIC_TOKEN_ADDRESS=0xYourTokenAddress
   NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia by default
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

## Notes

- For production, move point accounting and verification to a real database and perform minting from a **backend service** (API route) using a server key or automated signer, to prevent users from self-issuing rewards.
- This demo uses `onlyOwner mint` on the token; for production you might prefer a role-based minter or an **ERC-1155** badge per milestone.
