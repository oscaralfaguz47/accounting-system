using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.D151Options;
using Microsoft.AspNetCore.Authorization;
using Web_AccountingSystem.Models.D151Options;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class D151OptionsController : ControllerBase
    {
        private readonly DbContextApi _context;

        public D151OptionsController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/D151Options/GetD151OptionsIncomes
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectD151OptionViewModel>> GetD151OptionsIncomes()
        {
            var option = await _context.D151Options
                .Where(o => o.Code != "C")
                .OrderBy(o => o.Name).ToListAsync();
            return option.Select(o => new SelectD151OptionViewModel
            {
                IdD151 = o.IdD151,
                Name = o.Name
            });
        }

        // GET: api/D151Options/GetD151OptionsExpenses
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectD151OptionViewModel>> GetD151OptionsExpenses()
        {
            var option = await _context.D151Options
                .Where(o => o.Code != "V" && o.Code != "D")
                .OrderBy(o => o.Name).ToListAsync();
            return option.Select(o => new SelectD151OptionViewModel
            {
                IdD151 = o.IdD151,
                Name = o.Name
            });
        }

        private bool D151OptionExists(int id)
        {
            return _context.D151Options.Any(e => e.IdD151 == id);
        }
    }
}
