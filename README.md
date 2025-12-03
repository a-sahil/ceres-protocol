# 🌾 Ceres Protocol: Decentralized Warehouse Insurance DAO

[![Hedera EVM](https://img.shields.io/badge/Hedera-EVM-green)](https://hedera.com)
[![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-blue)](https://react.dev)
[![Backend: Express + MongoDB](https://img.shields.io/badge/Backend-Express%20%7C%20MongoDB-red)](https://expressjs.com)

## Introduction

Ceres Protocol is a decentralized application (dApp) designed to revolutionize agricultural storage and insurance. It connects farmers with a verified network of warehouses, facilitates transparent storage bookings, and implements a community-driven DAO (Decentralized Autonomous Organization) for validating and paying out insurance claims using smart contracts on the Hedera EVM.

The platform is designed for transparency, security, and community governance, moving away from traditional, opaque insurance processes.

## ✨ Key Features

This project showcases a full-stack dApp architecture with the following core functionalities:

| Feature | Description | Technology |
|---------|-------------|-----------|
| **DAO Governance** | Community members vote on insurance claim proposals to ensure fair and transparent payouts from a decentralized pool. | Solidity, Wagmi, Hedera EVM |
| **Warehouse Listings** | Owners can register and list their warehouses with details, capacity, pricing in HBAR, and images. | Express, MongoDB, Multer |
| **On-Chain Booking** | Farmers can book a warehouse by submitting crop details and executing a payment transaction (in HBAR) directly to the warehouse owner's wallet address. | Viem, Wagmi, Hedera |
| **AR Claim Submission** | Integrates a conceptual framework for farmers to initiate claims and submit Augmented Reality (AR) verified 3D evidence for DAO review. | Frontend Logic, DAO Smart Contract |
| **Secure Authentication** | User (Farmer) signup/login is secured with JWT and bcrypt hashing. | Express, MongoDB, JWT, bcryptjs |

## 📐 Architecture Overview

Ceres Protocol follows a modular architecture:

**Frontend:** A modern, responsive React application built with Vite and Tailwind CSS. It interacts with the backend REST API for user/warehouse data and directly with the Hedera EVM for blockchain transactions (payments, DAO interactions).

**Backend:** A robust Node.js/Express server in TypeScript, managing user authentication, warehouse data (including image uploads with Multer), and providing a RESTful API to the frontend. MongoDB stores all non-blockchain application data.

**Smart Contract:** A Solidity DAO contract deployed on the Hedera Testnet, which handles pooling of insurance funds, proposal creation, and voting logic.

## 💻 Tech Stack

| Layer | Technologies | Key Packages |
|-------|--------------|-------------|
| **Blockchain** | Hedera EVM, Solidity | wagmi, viem, rainbow-me/rainbowkit, ethers |
| **Frontend** | React, TypeScript, Tailwind CSS | clsx, cmdk, date-fns, recharts, shadcn/ui |
| **Backend** | Node.js, Express, TypeScript | mongoose, bcryptjs, jsonwebtoken, multer, dotenv |
| **Database** | MongoDB | Mongoose |

## 🚀 Setup and Installation

Follow these steps to get the Ceres Protocol application running locally.

### Prerequisites

- Node.js (v18+)
- MongoDB Instance (Local or cloud)
- Hedera Testnet Account (for wallet connection and HBAR)

### 1. Smart Contract Deployment

The provided Solidity contract (`contract/DAO.sol`) needs to be compiled and deployed to the Hedera Testnet EVM.

**Contract Address** (from `frontend/src/lib/daoContract.ts`):

```typescript
export const daoContractAddress = '0xfbCf899f1171fa1D3626396BDC96eaBcA9AA40aB';
```

> **Note:** If you deploy your own contract, update the `daoContractAddress` in `frontend/src/lib/daoContract.ts` to your new address.

### 2. Backend Setup

The backend handles user accounts, warehouse listings, and image uploads.

```bash
cd backend
npm install # or yarn install / bun install
```

#### Configuration

Create a `.env` file in the `backend/` directory with your environment variables:

```env
PORT=5000
MONGO_URI=<Your MongoDB Connection String>
JWT_SECRET=<A long, random, secret string>
```

#### Running the Backend

```bash
npm run dev
# Server running on port 5000
```

### 3. Frontend Setup

The frontend connects the user to the backend API and the Hedera EVM.

```bash
cd frontend
npm install # or yarn install / bun install
```

#### Configuration

Create a `.env` file in the `frontend/` directory with the API URL and your RainbowKit project ID:

```env
VITE_API_BASE_URL=http://localhost:5000/api
# The project ID is for RainbowKit/Wagmi to fetch chain data (get one from WalletConnect)
VITE_WALLETCONNECT_PROJECT_ID=51739b9dafb35a0539a875882cafc1bf
```

#### Running the Frontend

```bash
npm run dev
# App running on port 8080 (as configured in vite.config.ts)
```

## 🧑‍💻 Usage

### Farmer Workflow

1. Sign Up at `/signup` and Login at `/login`.
2. Browse Listings at `/listings`.
3. Connect Wallet (Hedera Testnet) using the RainbowKit button.
4. **Book Warehouse:** Select a listing, click Book Now, enter details, and confirm the HBAR payment via your connected wallet.
5. **DAO Participation:** Visit `/dao` to see active claim proposals and cast your vote as a DAO member.

### Warehouse Owner Workflow

1. Register at `/register` using the multi-step form.
2. Provide all details, including HBAR Price and Receiving Wallet Address.
3. Upload Warehouse Images (up to 5 images).
4. Once a warehouse is successfully booked, the owner receives the HBAR payment, and the listing is marked as BOOKED.
5. **Future Feature:** Logic for owner to manually generate a proposal if a claim is agreed upon (currently only farmers can initiate).

### DAO Claim Process

1. A farmer with a booked warehouse visits `/listings` and selects Initiate Insurance Claim.
2. A proposal is created on the deployed DAO smart contract via the `createProposal` function.
3. DAO members visit `/dao`, review the proposal details, and Vote For/Against.
4. After votes are cast, an authorized member or the contract itself can call `countVote` to tally votes and transfer the pool balance (simulating insurance payout) to the specified winner (currently set to the caller's address for testing).

## 📜 DAO Contract Functions

The core logic of the Ceres Protocol insurance is governed by the `HederaDAO.sol` contract:

| Function | Description | Mutability |
|----------|-------------|-----------|
| `pool(uint256 amount)` | Allows users to deposit HBAR (via msg.value) to fund the central DAO insurance treasury. | payable |
| `createProposal(string description)` | Creates a new claim proposal that DAO members can vote on. | nonpayable |
| `vote(uint256 proposalId, bool support)` | Allows DAO members to cast a YES (true) or NO (false) vote. | nonpayable |
| `countVote(uint256 proposalId, address payable winner)` | Tallies the votes. If yesVotes > noVotes, it sets the proposal status to passed and transfers the entire contract balance to the winner (the claim recipient). | nonpayable |
| `getPoolBalance()` | Returns the current HBAR balance of the contract. | view |

## 👋 Contributing

Ceres Protocol is an open-source project. We welcome contributions, bug reports, and feature suggestions.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'feat: add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a new Pull Request.

---

**Ceres Protocol:** Securing the future of agricultural storage.
