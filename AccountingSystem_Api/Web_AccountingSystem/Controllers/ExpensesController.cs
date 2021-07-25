using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.Expenses;
using Microsoft.AspNetCore.Authorization;
using Web_AccountingSystem.Models.Expenses;
using Entities_AccountingSystem.JournalSeats;
using Entities_AccountingSystem.JournalMovements;
using Entities_AccountingSystem.AccountsPayable;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        private readonly DbContextApi _context;

        public ExpensesController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/Expenses/GetExpenses
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectExpenseViewModel>> GetExpenses(int idCompany)
        {
            var expense = await _context.Expenses
                .Include(i => i.AccountingAccount)
                .Include(i => i.JournalSeat)
                .Include(i => i.Provider)
                .Include(i => i.D151Option)
                .Include(i => i.MovementType)
                .Where(i => i.IdCompany == idCompany)
                .Where(i => i.Status == true)
                .OrderByDescending(i => i.RegistrationDate).ToListAsync();
            return expense.Select(i => new SelectExpenseViewModel
            {
                IdExpense = i.IdExpense,
                IdAccountingAccount = i.IdAccountingAccount,
                AccountName = i.AccountingAccount.AccountName,
                IdJournalSeat = i.IdJournalSeat,
                SeatNumber = i.JournalSeat.SeatNumber,
                Voucher = i.Voucher,
                RegistrationDate = i.RegistrationDate,
                IdProvider = i.IdProvider,
                ProviderName = i.Provider.Name,
                Details = i.Details,
                IVA = i.IVA,
                TotalAmount = i.TotalAmount,
                IdD151 = i.IdD151,
                D151Name = i.D151Option.Name,
                IdMovementType = i.IdMovementType,
                MovementTypeName = i.MovementType.Name,
                IdMonthlyClosing = i.IdMonthlyClosing
            }); ;
        }


        // GET: api/Expenses/GetNumberOfRegisters
        [HttpGet("[action]")]
        public async Task<IActionResult> GetNumberOfRegisters(int idCompany)
        {
            var numberRegisters = await _context.Expenses
               .Where(n => n.IdCompany == idCompany && n.Status == true)
               .CountAsync();

            return Ok(numberRegisters);
        }

        // POST: api/Expenses/CreateExpense
        [HttpPost("[action]")]
        public async Task<ActionResult> CreateExpense([FromBody] CreateExpenseViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int seatNumber;
            try
            {
                seatNumber = await _context.JournalSeats
                .Where(n => n.IdCompany == model.IdCompany)
                .CountAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
            var origin = await _context.Origins.FirstOrDefaultAsync(i => i.Name == "Gastos");
            int idOrigin = origin.IdOrigin;

            var movementType = await _context.MovementsType.FirstOrDefaultAsync(i => i.IdMovementType == model.IdMovementType);
            Nullable <int> idAccountPayable = null;

            
            if (movementType.Name == "Crédito")
            {
                var expirationDate = model.RegistrationDate.AddDays(model.creditDays);

                AccountPayable accountPayable = new AccountPayable
                {
                    IdCompany = model.IdCompany,
                    RegistrationDate = DateTime.Now,
                    AccountingDate = model.RegistrationDate,
                    ModificationDate = DateTime.Now,
                    ExpirationDate = expirationDate,
                    IdProvider = model.IdProvider,
                    TotalAmount = model.TotalAmount,
                    BalanceAmount = model.TotalAmount,
                    Details = model.Details,
                    AccountStatus = true,
                    Status = true
                };
                try
                {
                    _context.AccountsPayable.Add(accountPayable);
                     await _context.SaveChangesAsync();
                    idAccountPayable = accountPayable.IdAccountPayable;
                }
                catch (Exception ex)
                {
                    return BadRequest(ex);
                }
            }

            JournalSeat journalSeat = new JournalSeat
            {
                IdOrigin = idOrigin,
                IdCompany = model.IdCompany,
                Date = model.RegistrationDate,
                Description = "Registro de gasto",
                Amount = model.TotalAmount,
                Status = true,
                SeatNumber = seatNumber + 1,
                IdAccountPayable = idAccountPayable
            };

            try
            {
                _context.JournalSeats.Add(journalSeat);
            
                var idJournalSeat = journalSeat.IdJournalSeat;
                var idCompany = model.IdCompany;

                foreach (var movement in model.JournalMovements)
                {
                    JournalMovement journalMovement = new JournalMovement
                    {
                        IdJournalSeat = idJournalSeat,
                        IdCompany = idCompany,
                        IdAccountingAccount = movement.IdAccountingAccount,
                        IdAccountAffectation = movement.IdAccountAffectation,
                        Date = model.RegistrationDate,
                        TotalAmount = movement.TotalAmount,
                        Description = "Registro de gasto",
                        Status = true,
                        IdOrigin = idOrigin
                    };
                    _context.JournalMovements.Add(journalMovement);
                }


                Expense expense = new Expense
                {
                    IdCompany = model.IdCompany,
                    IdAccountingAccount = model.IdAccountingAccount,
                    IdJournalSeat = idJournalSeat,
                    Voucher = model.Voucher,
                    RegistrationDate = model.RegistrationDate,
                    IdProvider = model.IdProvider,
                    Details = model.Details,
                    IVA = model.IVA,
                    TotalAmount = model.TotalAmount,
                    Status = true,
                    IdD151 = model.IdD151,
                    IdMovementType = model.IdMovementType
                };

                _context.Expenses.Add(expense);
               
                if (movementType.Name == "Crédito")
                {
                    var accountPayable = await _context.AccountsPayable.FirstOrDefaultAsync(i => i.IdAccountPayable == idAccountPayable);
                    accountPayable.IdExpense = expense.IdExpense;
                }
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
            return Ok();
        }

        // PUT: api/Expenses/UpdateExpense
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateExpense([FromBody] UpdateExpenseViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.IdExpense <= 0)
            {
                return BadRequest();
            }
            var expense = await _context.Expenses.FirstOrDefaultAsync(i => i.IdExpense == model.IdExpense);
            var idJournalSeat = expense.IdJournalSeat;
            expense.IdAccountingAccount = model.IdAccountingAccount;
            expense.Voucher = model.Voucher;
            expense.RegistrationDate = model.RegistrationDate;
            expense.IdProvider = model.IdProvider;
            expense.Details = model.Details;
            expense.IVA = model.IVA;
            expense.TotalAmount = model.TotalAmount;
            expense.IdD151 = model.IdD151;
            expense.IdMovementType = model.IdMovementType;

            var journalSeat = await _context.JournalSeats.FirstOrDefaultAsync(a => a.IdJournalSeat == idJournalSeat);
            var idCompany = journalSeat.IdCompany;

            if (journalSeat == null)
            {
                return NotFound();
            }

            journalSeat.Date = model.RegistrationDate;
            journalSeat.Amount = model.TotalAmount;
            var movementType = await _context.MovementsType.FirstOrDefaultAsync(i => i.IdMovementType == model.IdMovementType);
            if (movementType.Name == "Crédito")
            {
                var expirationDate = model.RegistrationDate.AddDays(model.creditDays);
                var accountPayable = await _context.AccountsPayable.FirstOrDefaultAsync(x => x.IdAccountPayable == journalSeat.IdAccountPayable);
                if (accountPayable != null)
                {
                    accountPayable.AccountingDate = model.RegistrationDate;
                    accountPayable.ModificationDate = DateTime.Now;
                    accountPayable.ExpirationDate = expirationDate;
                    accountPayable.IdProvider = model.IdProvider;

                    if (accountPayable.TotalAmount == accountPayable.BalanceAmount)
                    {
                        accountPayable.BalanceAmount = model.TotalAmount;
                    }
                    else if (accountPayable.TotalAmount > model.TotalAmount)
                    {
                        decimal valueToAddToBalance = model.TotalAmount - accountPayable.TotalAmount;
                        accountPayable.BalanceAmount = accountPayable.BalanceAmount + valueToAddToBalance;
                    }
                    else if (accountPayable.TotalAmount < model.TotalAmount)
                    {
                        decimal valueToSubtractToBalance = accountPayable.TotalAmount - model.TotalAmount;
                        accountPayable.BalanceAmount = accountPayable.BalanceAmount - valueToSubtractToBalance;
                    }
                    accountPayable.TotalAmount = model.TotalAmount;
                    accountPayable.Details = model.Details;
                } else
                {
                    //Create new Account Payable

                    AccountPayable accountPayableToCreate = new AccountPayable
                    {
                        IdCompany = expense.IdCompany,
                        RegistrationDate = DateTime.Now,
                        AccountingDate = model.RegistrationDate,
                        ModificationDate = DateTime.Now,
                        ExpirationDate = expirationDate,
                        IdProvider = model.IdProvider,
                        TotalAmount = model.TotalAmount,
                        BalanceAmount = model.TotalAmount,
                        Details = model.Details,
                        AccountStatus = true,
                        Status = true,
                        IdExpense = expense.IdExpense
                    };
                    try
                    {
                        _context.AccountsPayable.Add(accountPayableToCreate);
                        await _context.SaveChangesAsync();
                        journalSeat.IdAccountPayable = accountPayableToCreate.IdAccountPayable;
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex);
                    }
                }
                

            } else {
                
                if (journalSeat.IdAccountPayable != null)
                {
                    var accountPayable = await _context.AccountsPayable.FirstOrDefaultAsync(x => x.IdAccountPayable == journalSeat.IdAccountPayable);
                    _context.AccountsPayable.Remove(accountPayable);
                }
                journalSeat.IdAccountPayable = null;
            }

            try
            {
                var existingMovements = await _context.JournalMovements.Where(j => j.IdJournalSeat == idJournalSeat).ToListAsync();
                if (existingMovements == null)
                {
                    return NotFound();
                }

                foreach (var existingMovement in existingMovements)
                {
                    _context.JournalMovements.Remove(existingMovement);

                }
                await _context.SaveChangesAsync();

                var origin = await _context.Origins.FirstOrDefaultAsync(i => i.Name == "Gastos");
                int idOrigin = origin.IdOrigin;

                foreach (var movement in model.JournalMovements)
                {
                    JournalMovement journalMovement = new JournalMovement
                    {
                        IdJournalSeat = idJournalSeat,
                        IdCompany = idCompany,
                        IdAccountingAccount = movement.IdAccountingAccount,
                        IdAccountAffectation = movement.IdAccountAffectation,
                        Date = model.RegistrationDate,
                        TotalAmount = movement.TotalAmount,
                        Description = "Registro de gasto",
                        Status = true,
                        IdOrigin = idOrigin
                    };
                    _context.JournalMovements.Add(journalMovement);
                }
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {

                return BadRequest();
            }

            return Ok();
        }

        // PUT: api/Expenses/DeleteExpense
        [HttpPut("[action]")]
        public async Task<IActionResult> DeleteExpense(int idExpense)
        {

            if (idExpense <= 0)
            {
                return BadRequest();
            }

            var expense = await _context.Expenses.FirstOrDefaultAsync(i => i.IdExpense == idExpense);
            var idJournalSeat = expense.IdJournalSeat;
            var journalSeat = await _context.JournalSeats.FirstOrDefaultAsync(j => j.IdJournalSeat == idJournalSeat);
            var journalMovements = await _context.JournalMovements.Where(j => j.IdJournalSeat == idJournalSeat).ToListAsync();
            var accountPayable = await _context.AccountsPayable.FirstOrDefaultAsync(x => x.IdAccountPayable == journalSeat.IdAccountPayable);


            if (expense == null || journalMovements == null)
            {
                return NotFound();
            }

            try
            {
                if (accountPayable != null)
                {
                    accountPayable.Status = false;
                }
                expense.Status = false;
                journalSeat.Status = false;
                foreach (var movement in journalMovements)
                {
                    movement.Status = false;
                }
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return BadRequest();
            }

            return Ok();
        }


        private bool ExpenseExists(int id)
        {
            return _context.Expenses.Any(e => e.IdExpense == id);
        }
    }
}
