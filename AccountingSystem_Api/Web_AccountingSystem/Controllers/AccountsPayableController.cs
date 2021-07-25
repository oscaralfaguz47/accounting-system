using Data_AccountingSystem;
using Entities_AccountingSystem.AccountsPayable;
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
        public async Task<IEnumerable<SelectAccountPayableViewModel>> GetAccountsPayable(int idCompany, int skipNumber, int numberRegisters)
        {
            var accountPayable = await _context.AccountsPayable
                .Include(i => i.Provider)
                .Where(i => i.IdCompany == idCompany)
                .Where(i => i.Status == true)
                .OrderBy(i => i.ExpirationDate).Skip(skipNumber).Take(numberRegisters).ToListAsync();
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

    }
}
