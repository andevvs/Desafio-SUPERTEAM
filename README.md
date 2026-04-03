# Banco Descentralizado em Solana (Neobank Anchor)

Este é um programa inteligente em Solana criado usando o framework **Anchor**, cumprindo com o **Desafio 1 (Opção B - Neobank)** do Bootcamp Hackathon Global 2026. 

## O que o programa faz?
O programa funciona como uma conta bancária on-chain simplificada, permitindo que os usuários realizem operações financeiras básicas como depositar e sacar (SOL nativo). O banco usa fundos depositados pelo próprio dono, assegurado com PDAs (Program Derived Addresses).

### Características
- Criação de uma conta bancária atrelada à *public key* do usuário usando um PDA (`seeds = [b"bank_account", owner_pubkey]`).
- O programa valida que o resgate e depósitos estão sendo feitos e assinados pelo *owner* da conta, garantindo o controle de acesso e fundos.

---

## Instruções Disponíveis

O programa possui três instruções públicas para interagir:

### 1. `initialize_account`
Cria a conta (PDA) para o banco associado ao usuário assinante. Ele registra o endereço do criador como o `owner` da conta.  
**Requisitos**: Assinatura do `owner`.

### 2. `deposit(amount: u64)`
Deposita lamports (SOL) na conta bancária (PDA) a partir da carteira do dono da conta (`owner`). Realiza um processo de *Cross-Program Invocation* (CPI) nativo via `system_program::transfer`.  
**Requisitos**: Assinatura do `owner`.

### 3. `withdraw(amount: u64)`
Saca (retira) lamports (SOL) da conta bancária de volta para a carteira do usuário. O programa verifica se o solicitante e assinante é o verdadeiro `owner` do PDA correspondente ao banco, para garantir a segurança. Verifica via o saldo disponível (`lamports`) usando `.try_borrow_mut_lamports()`.  
**Requisitos**: Assinatura do `owner`.

---

## Devnet

**Program ID**: `<DEPLOY_PROGRAM_ID>`

Este programa já está disponível e testado na rede de testes da Solana (Devnet).

---

## Como rodar os testes

Os testes são automatizados usando o frameowrk `anchor` juntamente de Mocha/Chai. Para rodar a suíte de testes:

1. Certifique-se de que você tem `npm`, `rust` e as cli's de `solana` e `anchor`.
2. Instale as dependências (TypeScript e módulos):
   ```bash
   npm install
   ```
3. Rode toda a suíte de testes com o `anchor`:
   ```bash
   anchor test
   ```
   *Isto engloba compilar o programa e validar as três instruções num LocalValidator.*

## Autor & Hackathon

Criado para o  Bootcamp Hackathon Global 2026, Superteam Brazil + NearX.
