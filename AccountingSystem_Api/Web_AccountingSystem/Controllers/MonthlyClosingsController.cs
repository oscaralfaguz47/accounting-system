using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.MonthlyClosings;
using Web_AccountingSystem.Models.MonthlyClosings;
using Microsoft.AspNetCore.Authorization;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class MonthlyClosingsController : ControllerBase
    {
        private readonly DbContextApi _context;

        public MonthlyClosingsController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/MonthlyClosings/GetMonthlyClosings
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectMonthlyClosingViewModel>> GetMonthlyClosings(int idCompany)
        {
            var monthlyClosing = await _context.MonthlyClosings
                .Where(m => m.IdCompany == idCompany)
                .Where(m => m.Status == true)
                .OrderBy(m => m.Date).ToListAsync();
            return monthlyClosing.Select(m => new SelectMonthlyClosingViewModel
            {
                IdMonthlyClosing = m.IdMonthlyClosing,
                Date = m.Date,
                Details = m.Details,
                Month = m.Month,
                Year = m.Year,
                ProfitOrLoss = m.ProfitOrLoss
            });
        }

        // POST: api/MonthlyClosings/CreateMonthlyClosing
        [HttpPost("[action]")]
        public async Task<ActionResult> CreateMonthlyClosing([FromBody] CreateMonthlyClosingViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DateTime initialDate;
            DateTime finalDate;
            int daysInMonth;

            daysInMonth = System.DateTime.DaysInMonth(model.Year, model.Month);
            initialDate = DateTime.Parse("" + model.Month + "/01/" + model.Year + " 12:00:00 am");
            finalDate = Convert.ToDateTime("" + model.Month + "/"+daysInMonth+"/" + model.Year + " 11:59:59 pm");

            // Get seat that are between the initial and final dates
            var seats = await _context.JournalSeats
                .Where(j => j.Date >= initialDate && j.Date <= finalDate)
                .Where(j => j.IdCompany == model.IdCompany)
                .Where(j => j.Status == true)
                .ToListAsync();
            // Get journal movements that are between the initial and final dates
            var journalMovements = await _context.JournalMovements.Where(m => m.Date >= initialDate && m.Date <= finalDate)
                .Where(j => j.IdCompany == model.IdCompany)
                .Where(j => j.Status == true)
                .ToListAsync();

            MonthlyClosing monthlyClosing = new MonthlyClosing
            {
                Date = DateTime.Now,
                Details = model.Details,
                IdCompany = model.IdCompany,
                Month = model.Month,
                Year = model.Year,
                ProfitOrLoss = model.ProfitOrLoss,
                Status = true
            };
            _context.MonthlyClosings.Add(monthlyClosing);
            try
            {
                await _context.SaveChangesAsync();

                var idMonthlyClosing = monthlyClosing.IdMonthlyClosing;

                foreach (var seat in seats)
                {
                    seat.IdMonthlyClosing = idMonthlyClosing;
                    var expense = await _context.Expenses.FirstOrDefaultAsync(a => a.IdJournalSeat == seat.IdJournalSeat);
                    if(expense != null)
                    {
                        expense.IdMonthlyClosing = idMonthlyClosing;
                    }
                    var income = await _context.Incomes.FirstOrDefaultAsync(a => a.IdJournalSeat == seat.IdJournalSeat);
                    if (income != null)
                    {
                        income.IdMonthlyClosing = idMonthlyClosing;
                    }

                  
                }
                foreach (var movement in journalMovements)
                {
                    movement.IdMonthlyClosing = idMonthlyClosing;
                }
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
            return Ok();
        }


        [HttpPut("[action]")]
        public async Task<IActionResult> DeleteMonthlyClosing([FromBody] int idMonthlyClosing)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var seats = await _context.JournalSeats
               .Where(j => j.IdMonthlyClosing == idMonthlyClosing)
               .Where(j => j.Status == true)
               .ToListAsync();
                foreach (var seat in seats)
                {
                    seat.IdMonthlyClosing = null;
                }

                var expenses = await _context.Expenses
                    .Where(j => j.IdMonthlyClosing == idMonthlyClosing)
                    .Where(j => j.Status == true)
                    .ToListAsync();
                foreach (var expense in expenses)
                {
                    expense.IdMonthlyClosing = null;
                }

                var incomes = await _context.Incomes
                    .Where(j => j.IdMonthlyClosing == idMonthlyClosing)
                    .Where(j => j.Status == true)
                    .ToListAsync();
                foreach (var income in incomes)
                {
                    income.IdMonthlyClosing = null;
                }

                var movements = await _context.JournalMovements
                    .Where(j => j.IdMonthlyClosing == idMonthlyClosing)
                    .Where(j => j.Status == true)
                    .ToListAsync();
                foreach (var movement in movements)
                {
                    movement.IdMonthlyClosing = null;
                }

                var monthlyClosing = await _context.MonthlyClosings.FirstOrDefaultAsync(m => m.IdMonthlyClosing == idMonthlyClosing);
                monthlyClosing.Status = false;

                await _context.SaveChangesAsync();

            } catch(Exception ex)
            {
                return BadRequest();
            }
           
            return Ok();
        }

        private bool MonthlyClosingExists(int id)
        {
            return _context.MonthlyClosings.Any(e => e.IdMonthlyClosing == id);
        }
    }
}
