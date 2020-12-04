using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.Roles;
using Web_AccountingSystem.Models.Roles;
using Microsoft.AspNetCore.Authorization;

namespace Web_AccountingSystem.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly DbContextApi _context;

        public RolesController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/Roles/GetRoles
        [HttpGet("[action]")]
        public async Task<IEnumerable<RollViewModel>> GetRoles()
        {
            var roll = await _context.Roles.ToListAsync();
            return roll.Select(r => new RollViewModel  // Return an object that instances the RollViewModel
            {
                IdRoll = r.IdRoll,
                Name = r.Name
            });
        }
        [Authorize(Roles = "Administrador")]
        //GET: api/Roles/SelectRoles
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectViewModel>> SelectRoles()
        {
            var roll = await _context.Roles.ToListAsync();
            return roll.Select(r => new SelectViewModel { 
                IdRoll = r.IdRoll,
                Name = r.Name
            });
        }

        private bool RollExists(int id)
        {
            return _context.Roles.Any(e => e.IdRoll == id);
        }
    }
}
