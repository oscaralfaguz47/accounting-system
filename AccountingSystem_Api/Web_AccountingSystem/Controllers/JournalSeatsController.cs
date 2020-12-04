using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.JournalSeats;
using Web_AccountingSystem.Models.JournalSeats;
using Entities_AccountingSystem.JournalMovements;
using Web_AccountingSystem.Models.JournalMovements;
using Microsoft.AspNetCore.Authorization;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class JournalSeatsController : ControllerBase
    {
        private readonly DbContextApi _context;

        public JournalSeatsController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/JournalSeats/GetJournalSeats
        [HttpGet("[action]")]
        public async Task<IEnumerable<GetJournalSeatViewModel>> GetJournalSeats(int idCompany)
        {
            var journalSeat = await _context.JournalSeats
                .Include(j => j.Origin)
                .Where(j => j.IdCompany == idCompany)
                .Where(j => j.Status == true)
                .OrderByDescending(j => j.SeatNumber).ToListAsync();
            return journalSeat.Select(j => new GetJournalSeatViewModel
            {
                IdJournalSeat = j.IdJournalSeat,
                OriginName = j.Origin.Name,
                Date = j.Date,
                Description = j.Description,
                Amount = j.Amount,
                Status = j.Status,
                SeatNumber = j.SeatNumber,
                idMonthlyClosing = j.IdMonthlyClosing
            });
        }

        // GET: api/JournalSeats/GetOpeningSeat
        [HttpGet("[action]")]
        public async Task<IEnumerable<GetJournalSeatViewModel>> GetOpeningSeat(int idCompany)
        {
            var journalSeat = await _context.JournalSeats
                .Include(j => j.Origin)
                .Where(j => j.IdCompany == idCompany)
                .Where(j => j.Origin.Name == "Asiento de apertura")
                .OrderByDescending(j => j.SeatNumber).ToListAsync();
            return journalSeat.Select(j => new GetJournalSeatViewModel
            {
                IdJournalSeat = j.IdJournalSeat,
                Date = j.Date,
                Amount = j.Amount
            });
        }

        // POST: api/JournalSeats/CreateJournalSeat
        [HttpPost("[action]")]
        public async Task<ActionResult> CreateJournalSeat([FromBody] CreateJournalSeatViewModel model)
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
            catch(Exception ex)
            {
                return BadRequest(ex);
            }

            JournalSeat journalSeat = new JournalSeat
            {
                IdOrigin = model.IdOrigin,
                IdCompany = model.IdCompany,
                Date = model.Date,
                Description = model.Description,
                Amount = model.Amount,
                Status = true,
                SeatNumber = seatNumber + 1
            };
            
            try
            {
                _context.JournalSeats.Add(journalSeat);
                await _context.SaveChangesAsync();
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
                        Date = movement.Date,
                        TotalAmount = movement.TotalAmount,
                        Description = movement.Description,
                        Status = true,
                        IdOrigin = movement.IdOrigin
                    };
                    _context.JournalMovements.Add(journalMovement);
                }
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
            return Ok();
        }

        // PUT: api/JournalSeats/UpdateJournalSeat
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateJournalSeat([FromBody] UpdateJournalSeatViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.IdJournalSeat <= 0)
            {
                return BadRequest();
            }

            var journalSeat = await _context.JournalSeats.FirstOrDefaultAsync(a => a.IdJournalSeat == model.IdJournalSeat);

            if (journalSeat == null)
            {
                return NotFound();
            }

            journalSeat.Date = model.Date;
            journalSeat.Description = model.Description;
            journalSeat.Amount = model.Amount;


            try
            {
                var existingMovements = await _context.JournalMovements.Where(j => j.IdJournalSeat == model.IdJournalSeat).ToListAsync();

                foreach (var existingMovement in existingMovements)
                {
                    _context.JournalMovements.Remove(existingMovement);
                    
                }
                await _context.SaveChangesAsync();

                foreach (var movement in model.JournalMovements)
                {
                    JournalMovement journalMovement = new JournalMovement
                    {
                        IdJournalSeat = model.IdJournalSeat,
                        IdCompany = model.IdCompany,
                        IdAccountingAccount = movement.IdAccountingAccount,
                        IdAccountAffectation = movement.IdAccountAffectation,
                        Date = movement.Date,
                        TotalAmount = movement.TotalAmount,
                        Description = movement.Description,
                        Status = true,
                        IdOrigin = movement.IdOrigin
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

        // PUT: api/JournalSeats/UpdateOpeningSeat
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateOpeningSeat([FromBody] UpdateOpeningSeatViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.IdJournalSeat <= 0)
            {
                return BadRequest();
            }

            var openingSeat = await _context.JournalSeats.FirstOrDefaultAsync(a => a.IdJournalSeat == model.IdJournalSeat);

            if (openingSeat == null)
            {
                return NotFound();
            }

            openingSeat.Amount = model.Amount;
            openingSeat.Date = model.Date;
           

            try
            {
                await _context.SaveChangesAsync();

                foreach (var jourMov in model.JournalMovements)
                {
                    var journalMovement = await _context.JournalMovements.FirstOrDefaultAsync(a => a.IdJounalMovement == jourMov.IdJounalMovement);
                    
                    journalMovement.TotalAmount = jourMov.TotalAmount;
                    journalMovement.Date = model.Date;
                    
                }
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {

                return BadRequest();
            }

            return Ok();
        }

        // PUT: api/JournalSeats/DeleteJournalSeat
        [HttpPut("[action]")]
        public async Task<IActionResult> DeleteJournalSeat(int idJournalSeat)
        {

            if (idJournalSeat <= 0)
            {
                return BadRequest();
            }

            var journalSeat = await _context.JournalSeats.FirstOrDefaultAsync(c => c.IdJournalSeat == idJournalSeat);
            var journalMovements = await _context.JournalMovements.Where(j => j.IdJournalSeat == idJournalSeat).ToListAsync();

            if (journalSeat == null || journalMovements == null)
            {
                return NotFound();
            }

           
            try
            {
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


        private bool JournalSeatExists(int id)
        {
            return _context.JournalSeats.Any(e => e.IdJournalSeat == id);
        }
    }
}
