# 🏦 Neobank Descentralizado na Solana

<div align="center">
  <img src="https://img.shields.io/badge/Solana-14F195?style=for-the-badge&logo=solana&logoColor=white" alt="Solana" />
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

<br />

Bem-vindo ao **Neobank na Solana**, uma aplicação desenvolvida durante o **Hackathon Global Bootcamp 2026** (Superteam Brazil + NearX). Atendendo à opção B do Desafio 1! 🚀 

Este projeto constrói um banco descentralizado *(Neobank)* totalmente *on-chain*, permitindo depósitos, saques e verificações de saldo com toda a segurança das **PDAs** *(Program Derived Addresses)*.

---

## 🎯 O Que Este Programa Faz?

Esse Smart Contract age como um banco simplificado onde os usuários conseguem depositar seus fundos (SOL nativo). O dinheiro fica num "Cofre" restrito vinculado à conta deles, sendo totalmente impossível qualquer pessoa movimentar exceto o verdadeiro criador.

### ✨ Principais Características:
- 🔐 **Carteira Vinculada**: Calcula dinamicamente o endereço do cofre usando o dono (`owner`) como base `seeds = [b"bank_account", owner_pubkey]`.
- 💱 **Proteção Extrema**: As rotinas verificam criptograficamente que a transação de depósito e resgate está sendo devidamente requisitada pelo Dono original daquele cofre.

---

## 📜 Instruções Disponíveis (Contrato)

Aqui estão as regras de negócios principais que podem ser chamadas no programa:

### 1️⃣ `initialize_account`
Abre sua conta bancária na blockchain! Ele reserva um espaço seguro (PDA) e cadastra a sua carteira como o "dono" atrelando a *Bump Seed*. 
**Requer:** Assinatura do `owner`.

### 2️⃣ `deposit(amount: u64)`
Realiza a transferência *(Cross-Program Invocation - CPI)* movendo o valor em SOL da sua carteira normal para o PDA bancário (Cofre).
**Requer:** Assinatura do `owner`.

### 3️⃣ `withdraw(amount: u64)`
O tão esperado saque! Ele saca o dinheiro depositado previamente e devolu-o via dedução direta de *lamports*, num processo instantâneo e livre das barreiras off-chain.
**Requer:** Assinatura do `owner` e saldo suficiente na conta bancária (PDA).

---

## 🌐 Deploy na Devnet

🔗 **Program ID:** `2aqMXRCKoxXC9tw42p6AfQuKjsdJfG1bVvtMZ8xwoNqG`

O código está compilado nativamente, referenciando esse id validado e com ambiente já configurado para você usá-lo ou recompilá-lo localmente a qualquer momento.

---

## 🧪 Rodando os Testes Localmente

Preparamos uma suíte nativa em **TypeScript** (usando *Mocha* & *Chai*) para auditar e provar que todas as instruções e permissões ocorrem exatamente da forma estipulada!

**Passo a passo:**

1. 📦 Certifique-se de que o ecossistema Solana encontra-se na sua máquina (`npm`, `rust`, `solana-cli`, `avm`).
2. 🗂️ Instale as dependências da suíte de teste local executando:
   ```bash
   npm install
   ```
3. ⚙️ Inicie a suíte que validará o projeto instanciando um validator:
   ```bash
   anchor test --skip-build
   ```

*(Utilizamos `--skip-build` pois o binário BPF já foi gerado e validado. Ele acionará seu validador e testará transferências baseadas em fundos locais, fugindo das falhas e gargalos severos de limite na Devnet).*

---

<p align="center">
Feito com 💙 para a comunidade fantástica da <b>Solana</b>. Avante Builders! 🛠️
</p>
