import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";

describe("neobank", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Neobank as Program;
  const user = anchor.web3.Keypair.generate();

  let bankAccountPda: anchor.web3.PublicKey;
  let bump: number;

  before(async () => {
    [bankAccountPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("bank_account"), user.publicKey.toBuffer()],
      program.programId
    );
    
    // Airdrop some lamports to the user for testing
    const sig = await provider.connection.requestAirdrop(
      user.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    const latestBlockHash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: sig,
    });
  });

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initializeAccount()
      .accounts({
        bankAccount: bankAccountPda,
        owner: user.publicKey,
      } as any)
      .signers([user])
      .rpc();

    const account = await program.account.bankAccount.fetch(bankAccountPda);
    assert.ok(account.owner.equals(user.publicKey));
    assert.equal(account.bump, bump);
  });

  it("Deposits SOL", async () => {
    const amountToDeposit = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
    
    const preBankBalance = await provider.connection.getBalance(bankAccountPda);

    await program.methods
      .deposit(amountToDeposit)
      .accounts({
        bankAccount: bankAccountPda,
        owner: user.publicKey,
      } as any)
      .signers([user])
      .rpc();

    const postBankBalance = await provider.connection.getBalance(bankAccountPda);
    assert.equal(postBankBalance - preBankBalance, amountToDeposit.toNumber());
  });

  it("Withdraws SOL", async () => {
    const amountToWithdraw = new anchor.BN(0.5 * anchor.web3.LAMPORTS_PER_SOL);
    
    const preBankBalance = await provider.connection.getBalance(bankAccountPda);

    await program.methods
      .withdraw(amountToWithdraw)
      .accounts({
        bankAccount: bankAccountPda,
        owner: user.publicKey,
      } as any)
      .signers([user])
      .rpc();

    const postBankBalance = await provider.connection.getBalance(bankAccountPda);
    assert.equal(preBankBalance - postBankBalance, amountToWithdraw.toNumber());
  });
});
