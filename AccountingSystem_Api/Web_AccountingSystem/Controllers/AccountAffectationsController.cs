using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.AccountAffectations;
using Microsoft.AspNetCore.Authorization;
using Web_AccountingSystem.Models.AccountAffectations;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountAffectationsController : ControllerBase
    {
        private readonly DbContextApi _context;

        public AccountAffectationsController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/AccountAffectations/GetAccountAffectations
        [HttpGet("[action]")]
        public async Task<IEnumerable<AccountAffectationViewModel>> GetAccountAffectations()
        {
            var accountAffectation = await _context.AccountAffectations
                .Where(a => a.IdAccountAffectation == a.IdAccountAffectation)
                .OrderBy(a => a.Name).ToListAsync();
            return accountAffectation.Select(a => new AccountAffectationViewModel
            {
                IdAccountAffectation = a.IdAccountAffectation,
                Name = a.Name
            });
        }


        private bool AccountAffectationExists(int id)
        {
            return _context.AccountAffectations.Any(e => e.IdAccountAffectation == id);
        }
    }
}
