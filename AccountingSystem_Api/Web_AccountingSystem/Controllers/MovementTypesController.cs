using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.MovementsType;
using Web_AccountingSystem.Models.MovementsType;
using Microsoft.AspNetCore.Authorization;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class MovementTypesController : ControllerBase
    {
        private readonly DbContextApi _context;

        public MovementTypesController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/MovementTypes/GetMovementTypes
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectMovementTypeViewModel>> GetMovementTypes()
        {
            var option = await _context.MovementsType
                .OrderBy(m => m.Name).ToListAsync();
            return option.Select(m => new SelectMovementTypeViewModel
            {
                IdMovementType = m.IdMovementType,
                Name = m.Name
            });
        }

        private bool MovementTypeExists(int id)
        {
            return _context.MovementsType.Any(e => e.IdMovementType == id);
        }
    }
}
