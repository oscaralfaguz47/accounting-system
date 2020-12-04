using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.AccountingAccounts;
using Microsoft.AspNetCore.Authorization;
using Web_AccountingSystem.Models.AccountingAccounts;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountingAccountsController : ControllerBase
    {
        private readonly DbContextApi _context;

        public AccountingAccountsController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/AccountingAccounts/GetAccountingAccounts
        [HttpGet("[action]")]
        public async Task<IEnumerable<AccountingAccountViewModel>> GetAccountingAccounts(int idCompany)
        {
            var accountingAccount = await _context.AccountingAccounts
                .Include(a => a.FirstCategoryAccount)
                .Include(a => a.SecondCategoryAccount)
                .Include(a => a.AccountAffectation)
                .Where(a => a.IdCompany == idCompany)
                .OrderBy(c => c.Code).ToListAsync();
            return accountingAccount.Select(a => new AccountingAccountViewModel
            {
                IdAccountingAccount = a.IdAccountingAccount,
                IdAccountFirstCategory = a.IdAccountFirstCategory,
                FirstCategoryName = a.FirstCategoryAccount.Name,
                IdAccountSecondCategory = a.IdAccountSecondCategory,
                SecondCategoryName = a.SecondCategoryAccount.Name,
                IdAccountAffectation = a.IdAccountAffectation,
                AccountAffectationName = a.AccountAffectation.Name,
                Code = a.Code,
                AccountName = a.AccountName,
                Description = a.Description
            });
        }


        // GET: api/AccountingAccounts/GetDefaultAccountingAccounts
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectDefaultAccountsViewModel>> GetDefaultAccountingAccounts()
        {
            var accountingAccount = await _context.AccountingAccounts
                .Where(a => a.DefaultAccount == true)
                .OrderBy(c => c.Code).ToListAsync();
            return accountingAccount.Select(a => new SelectDefaultAccountsViewModel
            {
                IdAccountingAccount = a.IdAccountingAccount,
                AccountName = a.AccountName,
                IdAccountAffectation = a.IdAccountAffectation,
                Code = a.Code
            });
        }

        // GET: api/AccountingAccounts/GetIncomesAccountingAccounts
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectAccuntingAccountViewModel>> GetIncomesAccountingAccounts(int idCompany)
        {
            var accountingAccount = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany)
                .Where(a => a.FirstCategoryAccount.Number == 4)
                .OrderBy(c => c.AccountName).ToListAsync();
            return accountingAccount.Select(a => new SelectAccuntingAccountViewModel
            {
                IdAccountingAccount = a.IdAccountingAccount,
                 AccountName = a.AccountName
            });
        }

        // GET: api/AccountingAccounts/GetExpensesAccountingAccounts
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectAccuntingAccountViewModel>> GetExpensesAccountingAccounts(int idCompany)
        {
            var accountingAccount = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany)
                .Where(a => a.FirstCategoryAccount.Number == 5)
                .OrderBy(c => c.AccountName).ToListAsync();
            return accountingAccount.Select(a => new SelectAccuntingAccountViewModel
            {
                IdAccountingAccount = a.IdAccountingAccount,
                AccountName = a.AccountName
            });
        }

        // GET: api/AccountingAccounts/SelectAccountingAccounts
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectAccuntingAccountViewModel>> SelectAccountingAccounts(int idCompany)
        {
            var accountingAccount = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .OrderBy(a => a.Code).ToListAsync();
            return accountingAccount.Select(a => new SelectAccuntingAccountViewModel
            {
                IdAccountingAccount = a.IdAccountingAccount,
                AccountName = a.AccountName,
                Code = a.Code
            });
        }

        // POST: api/AccountingAccounts/CreateAccountingAccount
        [HttpPost("[action]")]
        public async Task<ActionResult> CreateAccountingAccount([FromBody] CreateAccountingAccountViewModel model, int idAccountFirstCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            int numAccountsThirdCategory;
            try
            {
                 numAccountsThirdCategory = await _context.AccountingAccounts
                .Where(n => n.IdCompany == model.IdCompany || (n.DefaultAccount == true ))
                .Where(n=> (n.IdAccountFirstCategory == idAccountFirstCategory) && (n.IdAccountSecondCategory == model.IdAccountSecondCategory))
                .CountAsync();
                numAccountsThirdCategory = numAccountsThirdCategory + 1;
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
            var firstCategory = await _context.FirstCategoryAccounts.FirstOrDefaultAsync(u => u.IdAccountFirstCategory == model.IdAccountFirstCategory);
            var secondCategory = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(u => u.IdAccountSecondCategory == model.IdAccountSecondCategory);
            var code1 = firstCategory.Number;
            var code2 = secondCategory.Number;
            var code3 = numAccountsThirdCategory.ToString();
            var codeConcatenated = "" + code1 + "." + code2 +"." + code3;

            AccountingAccount account = new AccountingAccount
            {
                IdCompany = model.IdCompany,
                IdAccountFirstCategory = model.IdAccountFirstCategory,
                IdAccountSecondCategory = model.IdAccountSecondCategory,
                AccountThirdCategory = numAccountsThirdCategory,
                IdAccountAffectation = model.IdAccountAffectation,
                Code = codeConcatenated,
                AccountName = model.AccountName,
                Description = model.Description,
                CreationDate = DateTime.Now,
                DefaultAccount = false
            };
            _context.AccountingAccounts.Add(account);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
            return Ok();
        }

        // PUT: api/AccountingAccounts/UpdateAccountingAccount
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateAccountingAccount([FromBody] UpdateAccountingAccountViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.IdAccountingAccount <= 0)
            {
                return BadRequest();
            }

            var account = await _context.AccountingAccounts.FirstOrDefaultAsync(a => a.IdAccountingAccount == model.IdAccountingAccount);

            if (account == null)
            {
                return NotFound();
            }

            account.AccountName = model.AccountName;
            account.Description = model.Description;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {

                return BadRequest();
            }

            return Ok();
        }


        private bool AccountingAccountExists(int id)
        {
            return _context.AccountingAccounts.Any(e => e.IdAccountingAccount == id);
        }
    }
}
