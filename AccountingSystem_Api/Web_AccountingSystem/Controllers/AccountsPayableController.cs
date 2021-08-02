using Data_AccountingSystem;
using Entities_AccountingSystem.AccountsPayable;
using Entities_AccountingSystem.AccountsPayableMovements;
using Entities_AccountingSystem.JournalMovements;
using Entities_AccountingSystem.JournalSeats;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Web_AccountingSystem.Models.AccountsPayable;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsPayableController : Controller
    {
        private readonly DbContextApi _context;

        public AccountsPayableController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/AccountsPayable/GetAccountsPayable
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectAccountPayableViewModel>> GetAccountsPayable(int idCompany, int skipNumber, int numberRegisters, string criteria)
        {
            List<AccountPayable> accountPayable;
            if (criteria == null)
            {
                accountPayable = await _context.AccountsPayable
                .Include(i => i.Provider)
                .Where(i => i.IdCompany == idCompany)
                .Where(i => i.Status == true)
                .OrderBy(i => i.AccountStatus == false).ThenBy(i => i.ExpirationDate).Skip(skipNumber).Take(numberRegisters).ToListAsync();
            } else
            {
                accountPayable = await _context.AccountsPayable
                .Include(i => i.Provider)
                .Where(i => i.IdCompany == idCompany)
                .Where(i => i.Status == true)
                .Where(i => i.Provider.Name.Contains(criteria.Trim()) || i.Details.Contains(criteria.Trim()))
                .OrderBy(i => i.AccountStatus == false).ThenBy(i => i.ExpirationDate).Skip(skipNumber).Take(numberRegisters).ToListAsync();
            }
            
            return accountPayable.Select(i => new SelectAccountPayableViewModel
            {
                IdAccountPayable = i.IdAccountPayable,
                AccountingDate = i.AccountingDate,
                ExpirationDate = i.ExpirationDate,
                TotalAmount = i.TotalAmount,
                BalanceAmount = i.BalanceAmount,
                AccountStatus = i.AccountStatus,
                Provider = i.Provider.Name,
                Details = i.Details,
                IdExpense = i.IdExpense,
                creditDays = (i.ExpirationDate - i.AccountingDate).Days, 
                daysToExpire = (i.ExpirationDate - DateTime.Now).Days
            }); ;
             
        }


        // GET: api/AccountsPayable/GetNumberOfRegisters
        [HttpGet("[action]")]
        public async Task<IActionResult> GetNumberOfRegisters(int idCompany)
        {
            var numberRegisters = await _context.AccountsPayable
               .Where(n => n.IdCompany == idCompany && n.Status == true)
               .CountAsync();

            return Ok(numberRegisters);
        }

        // GET: api/AccountsPayable/GetNumberOfRegistersWhenFilter
        [HttpGet("[action]")]
        public async Task<IActionResult> GetNumberOfRegistersWhenFilter(int idCompany, string criteria)
        {
            var numberRegisters = await _context.AccountsPayable
               .Where(n => n.IdCompany == idCompany && n.Status == true)
               .Where(i => i.Provider.Name.Contains(criteria) || i.Details.Contains(criteria))
               .CountAsync();

            return Ok(numberRegisters);
        }

        // GET: api/AccountsPayable/FilterAccountsPayable
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectAccountPayableViewModel>> FilterAccountsPayable(int idCompany, int numberRegisters, string criteria)
        {
            var accountPayable = await _context.AccountsPayable
                .Include(i => i.Provider)
                .Where(i => i.IdCompany == idCompany)
                .Where(i => i.Status == true)
                .Where(i => i.Provider.Name.Contains(criteria.Trim()) || i.Details.Contains(criteria.Trim()))
                .OrderBy(i => i.AccountStatus == false).ThenBy(i => i.ExpirationDate).Take(numberRegisters).ToListAsync();
            return accountPayable.Select(i => new SelectAccountPayableViewModel
            {
                IdAccountPayable = i.IdAccountPayable,
                AccountingDate = i.AccountingDate,
                ExpirationDate = i.ExpirationDate,
                TotalAmount = i.TotalAmount,
                BalanceAmount = i.BalanceAmount,
                AccountStatus = i.AccountStatus,
                Provider = i.Provider.Name,
                Details = i.Details,
                IdExpense = i.IdExpense,
                creditDays = (i.ExpirationDate - i.AccountingDate).Days,
                daysToExpire = (i.ExpirationDate - DateTime.Now).Days
            }); ;
        }

        // POST: api/AccountsPayable/PayAccountPayable
        [HttpPost("[action]")]
        public async Task<ActionResult> PayAccountPayable([FromBody] PayAccountPayableViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int seatNumber;
            var accountPayable = await _context.AccountsPayable.Where(x => x.IdAccountPayable == model.IdAccountPayable).FirstOrDefaultAsync();
            if (model.AppliedAmount > accountPayable.BalanceAmount)
            {
                return BadRequest("The applied amount should not be greater than the balance amount");
            }
            try
            {
                seatNumber = await _context.JournalSeats
                .Where(n => n.IdCompany == accountPayable.IdCompany)
                .CountAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
            var origin = await _context.Origins.FirstOrDefaultAsync(i => i.Name == "Cuentas por pagar");
            int idOrigin = origin.IdOrigin;
            string movementDetail;
            var expense = await _context.Expenses.Where(x => x.IdExpense == accountPayable.IdExpense).FirstOrDefaultAsync();
            if (expense.AccountPayablePaid == false || expense.AccountPayablePaid == null)
            {
                expense.AccountPayablePaid = true;
            }
            
            if (model.AppliedAmount == accountPayable.BalanceAmount)
            {
                accountPayable.BalanceAmount = 0;
                accountPayable.AccountStatus = false;
                movementDetail = "Cancelación de cuenta por pagar";
            }
            else
            {
                accountPayable.BalanceAmount = accountPayable.BalanceAmount - model.AppliedAmount;
                movementDetail = "Abono a cuenta por pagar";
            }

            JournalSeat journalSeat = new JournalSeat
            {
                IdOrigin = idOrigin,
                IdCompany = accountPayable.IdCompany,
                Date = DateTime.Now,
                Description = movementDetail,
                Amount = model.AppliedAmount,
                Status = true,
                SeatNumber = seatNumber + 1
            };

            try
            {
                _context.JournalSeats.Add(journalSeat);

                var idJournalSeat = journalSeat.IdJournalSeat;
                var jsForExistingAccountPayable = await _context.JournalSeats
                    .Where(x => x.IdAccountPayable == model.IdAccountPayable)
                    .FirstOrDefaultAsync();
                var creditMovementType = await _context.AccountAffectations
                    .Where(X => X.Name == "Crédito").FirstOrDefaultAsync();
                var jmForExistingAccountPayable = await _context.JournalMovements
                    .Where(x => x.IdJournalSeat == jsForExistingAccountPayable.IdJournalSeat && x.IdAccountAffectation == creditMovementType.IdAccountAffectation)
                    .FirstOrDefaultAsync();

                var debitMovementType = await _context.AccountAffectations
                   .Where(X => X.Name == "Débito").FirstOrDefaultAsync();

                JournalMovement journalMovementDebit = new JournalMovement
                    {
                        IdJournalSeat = idJournalSeat,
                        IdCompany = accountPayable.IdCompany,
                        IdAccountingAccount = jmForExistingAccountPayable.IdAccountingAccount,
                        IdAccountAffectation = debitMovementType.IdAccountAffectation,
                        Date = DateTime.Now,
                        TotalAmount = model.AppliedAmount,
                        Description = movementDetail,
                        Status = true,
                        IdOrigin = idOrigin
                    };
                    _context.JournalMovements.Add(journalMovementDebit);

                JournalMovement journalMovementCredit = new JournalMovement
                {
                    IdJournalSeat = idJournalSeat,
                    IdCompany = accountPayable.IdCompany,
                    IdAccountingAccount = model.IdCreditedAccount,
                    IdAccountAffectation = creditMovementType.IdAccountAffectation,
                    Date = DateTime.Now,
                    TotalAmount = model.AppliedAmount,
                    Description = movementDetail,
                    Status = true,
                    IdOrigin = idOrigin
                };
                _context.JournalMovements.Add(journalMovementCredit);

                AccountsPayableMovement accountPayableMovement = new AccountsPayableMovement
                {
                    IdAccountPayable = accountPayable.IdAccountPayable,
                    IdJournalSeat = idJournalSeat,
                    RegistrationDate = DateTime.Now,
                    AppliedAmount = model.AppliedAmount,
                    Details = model.Details
                };
                _context.AccountsPayableMovements.Add(accountPayableMovement);

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
            return Ok();
        }

    }
}
