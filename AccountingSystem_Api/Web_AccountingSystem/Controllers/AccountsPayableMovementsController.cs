using Data_AccountingSystem;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web_AccountingSystem.Models.AccountsPayableMovements;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsPayableMovementsController : Controller
    {
        private readonly DbContextApi _context;
        public AccountsPayableMovementsController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/AccountsPayableMovements/GetAccountsPayableMovements
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectAccountPayableMovementViewModel>> GetAccountsPayableMovements(int idAccountPayable)
        {
           
               var accountPayableMovement = await _context.AccountsPayableMovements
                .Include(i => i.JournalSeat)
                .Where(i => i.IdAccountPayable == idAccountPayable)
                .OrderBy(i => i.RegistrationDate).ToListAsync();
           

            return accountPayableMovement.Select(i => new SelectAccountPayableMovementViewModel
            {
                IdAccountPayableMovement = i.IdAccountPayableMovement,
                IdAccountPayable = i.IdAccountPayable,
                JournalSeatNumber = i.JournalSeat.SeatNumber,
                RegistrationDate = i.RegistrationDate,
                AppliedAmount = i.AppliedAmount,
                Details = i.Details
            }); ;

        }
    }
}
