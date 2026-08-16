# 🏗️ BuildGuard — AI-Driven Construction Inventory Engine

> **Automated material shortage detection & idle-stock transfer optimizer for multi-site enterprise construction.**

[![Playwright Tests](https://img.shields.io/badge/Playwright-3%2F3%20Passed-brightgreen)](#) [![Next.js](https://img.shields.io/badge/Next.js-15-black)](#) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](#) [![Prisma](https://img.shields.io/badge/Prisma-ORM-indigo)](#)

---

## 📌 Key Features
- **Automated Shortage Detection:** Real-time tracking of site inventory vs. project demand.
- **Idle Stock Transfer Engine:** AI rule engine that locates surplus materials at nearby sites and generates inter-project transfers.
- **Validation & Rule Guardrails:** Strict rejection of negative/invalid material requests.
- **End-to-End Test Suite:** Fully automated Playwright integration tests covering all critical paths.

## 📁 Documentation & Evidence
- 📐 **[Architecture & System Design](docs/ARCHITECTURE_AND_DESIGN.md)**
- 🤖 **[AI Change-Loop Evidence Log](docs/AI_CHANGE_LOOP_EVIDENCE.md)**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Push database schema
npx prisma db push

# Run development server
npm run dev