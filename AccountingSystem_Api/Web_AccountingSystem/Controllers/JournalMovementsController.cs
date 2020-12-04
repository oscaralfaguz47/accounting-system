using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.JournalMovements;
using Web_AccountingSystem.Models.JournalMovements;
using Microsoft.AspNetCore.Authorization;
using Web_AccountingSystem.Models.IncomeStatements;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class JournalMovementsController : ControllerBase
    {
        private readonly DbContextApi _context;

        public JournalMovementsController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/JournalMovements/GetOpeningSeatJournalMovement
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectOpeningSeatJournalMovementViewModel>> GetOpeningSeatJournalMovements(int idCompany)
        {
            var openingSeatjournalMovement = await _context.JournalMovements
                .Where(o => o.IdCompany == idCompany)
                .Where(o => o.IdOrigin == 1)
                .OrderBy(o => o.IdAccountingAccount).ToListAsync();
            return openingSeatjournalMovement.Select(o => new SelectOpeningSeatJournalMovementViewModel
            {
                IdJounalMovement = o.IdJounalMovement,
                IdJournalSeat = o.IdJournalSeat,
                IdAccountAffectation = o.IdAccountAffectation,
                TotalAmount = o.TotalAmount,
                IdMonthlyClosing = o.IdMonthlyClosing,
                Date = o.Date
            });
        }

        // GET: api/JournalMovements/GetJournalMovements
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectJournalMovementViewModel>> GetJournalMovements(int idJournalSeat)
        {
            var journalMovement = await _context.JournalMovements
                .Where(j => j.IdJournalSeat == idJournalSeat)
                .Where(j => j.Status == true)
                .OrderBy(j => j.IdAccountAffectation).ToListAsync();
            return journalMovement.Select(j => new SelectJournalMovementViewModel
            {
                IdJounalMovement = j.IdJounalMovement,
                IdAccountingAccount = j.IdAccountingAccount,
                IdAccountAffectation = j.IdAccountAffectation,
                Date = j.Date,
                TotalAmount = j.TotalAmount,
                Description = j.Description
            });
        }

        // GET: api/JournalMovements/GetDetailedJournalMovements
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectDetailedJournalMovementViewModel>> GetDetailedJournalMovements(int idJournalSeat)
        {
            var journalMovement = await _context.JournalMovements
                .Include(j => j.AccountingAccount)
                .Include(j => j.AccountAffectation)
                .Where(j => j.IdJournalSeat == idJournalSeat)
                .Where(j => j.Status == true)
                .OrderBy(j => j.IdAccountAffectation).ToListAsync();
            return journalMovement.Select(j => new SelectDetailedJournalMovementViewModel
            {
                AccountingAccountName = j.AccountingAccount.AccountName,
                AccountAffectationName = j.AccountAffectation.Name,
                TotalAmount = j.TotalAmount,
                Description = j.Description
            });
        }

        private bool JournalMovementExists(int id)
        {
            return _context.JournalMovements.Any(e => e.IdJounalMovement == id);
        }
    }
}
