use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("2aqMXRCKoxXC9tw42p6AfQuKjsdJfG1bVvtMZ8xwoNqG");

#[program]
pub mod neobank {
    use super::*;

    pub fn initialize_account(ctx: Context<InitializeAccount>) -> Result<()> {
        let bank_account = &mut ctx.accounts.bank_account;
        bank_account.owner = ctx.accounts.owner.key();
        bank_account.bump = ctx.bumps.bank_account;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.owner.to_account_info(),
                to: ctx.accounts.bank_account.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount)?;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let bank_account = &ctx.accounts.bank_account;
        
        let bank_lamports = bank_account.to_account_info().lamports();
        require!(bank_lamports >= amount, ErrorCode::InsufficientFunds);

        **ctx.accounts.bank_account.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.owner.to_account_info().try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAccount<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 1, // discriminator + owner pubkey + bump
        seeds = [b"bank_account", owner.key().as_ref()],
        bump
    )]
    pub bank_account: Account<'info, BankAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"bank_account", owner.key().as_ref()],
        bump = bank_account.bump,
        has_one = owner
    )]
    pub bank_account: Account<'info, BankAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"bank_account", owner.key().as_ref()],
        bump = bank_account.bump,
        has_one = owner
    )]
    pub bank_account: Account<'info, BankAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[account]
pub struct BankAccount {
    pub owner: Pubkey,
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds in the bank account to complete the withdrawal.")]
    InsufficientFunds,
}
