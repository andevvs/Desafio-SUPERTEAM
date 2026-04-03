import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { IDL } from "../target/idl/neobank";

describe("neobank", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Safely grab the raw JSON IDL from the ts file
  const rawIdl = IDL as anchor.Idl;
  const programId = new anchor.web3.PublicKey("2aqMXRCKoxXC9tw42p6AfQuKjsdJfG1bVvtMZ8xwoNqG");
  const program = new Program(rawIdl, provider);

  const user = anchor.web3.Keypair.generate();

  let bankAccountPda: anchor.web3.PublicKey;
  let bump: number;

  before(async () => {
    [bankAccountPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("bank_account"), user.publicKey.toBuffer()],
      programId
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
    await program.methods
      .initializeAccount()
      .accounts({
        bankAccount: bankAccountPda,
        owner: user.publicKey,
      } as any)
      .signers([user])
      .rpc();

    const account = await program.account["bankAccount"].fetch(bankAccountPda) as any;
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
