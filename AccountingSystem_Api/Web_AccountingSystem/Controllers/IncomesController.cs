using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.Incomes;
using Microsoft.AspNetCore.Authorization;
using Web_AccountingSystem.Models.Incomes;
using Entities_AccountingSystem.JournalSeats;
using Entities_AccountingSystem.JournalMovements;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class IncomesController : ControllerBase
    {
        private readonly DbContextApi _context;

        public IncomesController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/Incomes/GetIncomes
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectIncomeViewModel>> GetIncomes(int idCompany)
        {
            var income = await _context.Incomes
                .Include(i => i.AccountingAccount)
                .Include(i => i.JournalSeat)
                .Include(i => i.Customer)
                .Include(i => i.D151Option)
                .Include(i => i.MovementType)
                .Where(i => i.IdCompany == idCompany)
                .Where(i => i.Status == true)
                .OrderByDescending(i => i.RegistrationDate).ToListAsync();
            return income.Select(i => new SelectIncomeViewModel
            {
                IdIncome = i.IdIncome,
                IdAccountingAccount = i.IdAccountingAccount,
                AccountName = i.AccountingAccount.AccountName,
                IdJournalSeat = i.IdJournalSeat,
                SeatNumber = i.JournalSeat.SeatNumber,
                Voucher = i.Voucher,
                RegistrationDate = i.RegistrationDate,
                IdCustomer = i.IdCustomer,
                CustomerName = i.Customer.Name,
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

        // POST: api/Incomes/CreateIncome
        [HttpPost("[action]")]
        public async Task<ActionResult> CreateIncome([FromBody] CreateIncomeViewModel model)
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

            var origin = await _context.Origins.FirstOrDefaultAsync(i => i.Name == "Ventas");
            int idOrigin = origin.IdOrigin;

            JournalSeat journalSeat = new JournalSeat
            {
                IdOrigin = idOrigin,
                IdCompany = model.IdCompany,
                Date = model.RegistrationDate,
                Description = "Registro de venta",
                Amount = model.TotalAmount,
                Status = true,
                SeatNumber = seatNumber + 1
            };

            try
            {
                _context.JournalSeats.Add(journalSeat);
               // await _context.SaveChangesAsync();
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
                        Description = "Registro de venta",
                        Status = true,
                        IdOrigin = idOrigin
                    };
                    _context.JournalMovements.Add(journalMovement);
                }


                Income income = new Income
                {
                    IdCompany = model.IdCompany,
                    IdAccountingAccount = model.IdAccountingAccount,
                    IdJournalSeat = idJournalSeat,
                    Voucher = model.Voucher,
                    RegistrationDate = model.RegistrationDate,
                    IdCustomer = model.IdCustomer,
                    Details = model.Details,
                    IVA = model.IVA,
                    TotalAmount = model.TotalAmount,
                    Status = true,
                    IdD151 = model.IdD151,
                    IdMovementType = model.IdMovementType
                };

                _context.Incomes.Add(income);

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
            return Ok();
        }

        // PUT: api/Incomes/UpdateIncome
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateIncome([FromBody] UpdateIncomeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.IdIncome <= 0)
            {
                return BadRequest();
            }
            var income = await _context.Incomes.FirstOrDefaultAsync(i => i.IdIncome == model.IdIncome);
            var idJournalSeat = income.IdJournalSeat;
            income.IdAccountingAccount = model.IdAccountingAccount;
            income.Voucher = model.Voucher;
            income.RegistrationDate = model.RegistrationDate;
            income.IdCustomer = model.IdCustomer;
            income.Details = model.Details;
            income.IVA = model.IVA;
            income.TotalAmount = model.TotalAmount;
            income.IdD151 = model.IdD151;
            income.IdMovementType = model.IdMovementType;

            var journalSeat = await _context.JournalSeats.FirstOrDefaultAsync(a => a.IdJournalSeat == idJournalSeat);
            var idCompany = journalSeat.IdCompany;

            if (journalSeat == null)
            {
                return NotFound();
            }

            journalSeat.Date = model.RegistrationDate;
            journalSeat.Amount = model.TotalAmount;

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
                        Description = "Registro de venta",
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

        // PUT: api/Incomes/DeleteIncome
        [HttpPut("[action]")]
        public async Task<IActionResult> DeleteIncome(int idIncome)
        {

            if (idIncome <= 0)
            {
                return BadRequest();
            }

            var income = await _context.Incomes.FirstOrDefaultAsync(i => i.IdIncome == idIncome);
            var idJournalSeat = income.IdJournalSeat;
            var journalSeat = await _context.JournalSeats.FirstOrDefaultAsync(j => j.IdJournalSeat == idJournalSeat);
            var journalMovements = await _context.JournalMovements.Where(j => j.IdJournalSeat == idJournalSeat).ToListAsync();
            

            if (income == null || journalMovements == null)
            {
                return NotFound();
            }

            try
            {
                income.Status = false;
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



        private bool IncomeExists(int id)
        {
            return _context.Incomes.Any(e => e.IdIncome == id);
        }
    }
}
