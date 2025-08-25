https://github.com/Vijaydcs/FLAGORA-AI-Powered-Billboard-Detection

# Flagora — AI Powered Billboard Detection

A civic technology project by [@Vijaydcs](https://github.com/Vijaydcs)

---

## Overview

Flagora is a full-stack web application designed to help municipalities and citizens maintain urban compliance by detecting and reporting unauthorized billboards. 

Citizens can upload images or videos, receive instant AI analysis, and submit verified reports to authorities. Administrators can review cases through an operations dashboard that provides analytics, workflow management, and data export capabilities.

New in this version:
- Citizen Rewards: Contributors earn 10 points for each verified photo. For every 100 points, 1 reward token is automatically minted to their wallet via MetaMask (testnet by default, mainnet-ready).
- Professional UI Refresh: Improved typography, accessible color palette, consistent layouts, and polished microcopy for a more professional user experience.

---

## Key Features

### Detection System
- AI-based analysis for billboard detection and compliance scoring  
- Support for image and video uploads with drag-and-drop  
- Real-time violation feedback with confidence scores  
- Geolocation capture to anchor reports to maps  

### Administrator Dashboard
- Case review with media, AI results, and history  
- Workflow management: New → In Review → Actioned → Closed  
- Inspector notes and assignments  
- Analytics by category, district, and time period  
- Data export in CSV or JSON  

### Public Dashboard
- Transparency portal with live compliance statistics and trends  
- District-wise heatmaps  
- Educational resources on billboard regulations  
- Simple reporting entry point for citizens  

### Authentication and Authorization
- Role-based access for Citizens, Inspectors, and Administrators  
- Protected routes and secure session management  
- User profiles and audit trails  

### Compliance Engine
- Registry of local billboard regulations  
- Automated rule checks with severity classification  
- Embedded regulatory references in compliance reports  

### Rewards System
- Contributors earn 10 points for each verified submission  
- Automatic minting of 1 reward token for every 100 points  
- Integration with MetaMask for wallet connection and token balance  
- Fraud prevention through AI verification, administrative checks, and rate limiting  

---

## Technology Stack

- Frontend: Next.js 14 (App Router), React 18, TypeScript  
- Styling: Tailwind CSS with custom design tokens  
- UI Components: shadcn/ui  
- State Management: React Context API  
- Icons: Lucide React  
- Charts: Recharts  
- Fonts: Space Grotesk and DM Sans (Google Fonts)  
- Web3: MetaMask, ethers v6 (client) with server-side mint API  

---

## Getting Started

### Prerequisites
- Node.js 18 or higher  
- npm or yarn package manager  
- MetaMask browser extension for rewards  

### Installation
```bash
git clone https://github.com/Vijaydcs/FLAGORA-AI-Powered-Billboard-Detection.git
cd FLAGORA-AI-Powered-Billboard-Detection
npm install
npm run dev
