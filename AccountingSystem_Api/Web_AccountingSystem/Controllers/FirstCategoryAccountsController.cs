using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.FirstCategoryAccounts;
using Microsoft.AspNetCore.Authorization;
using Web_AccountingSystem.Models.FirsCategoryAccounts;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class FirstCategoryAccountsController : ControllerBase
    {
        private readonly DbContextApi _context;

        public FirstCategoryAccountsController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/FistCategoryAccounts/GetFirstCategoryAccounts
        [HttpGet("[action]")]
        public async Task<IEnumerable<FirstCategoryAccountViewModel>> GetFirstCategoryAccounts()
        {
            var firstAccountCategory = await _context.FirstCategoryAccounts
                .Where(a => a.IdAccountFirstCategory == a.IdAccountFirstCategory)
                .OrderBy(a => a.Name).ToListAsync();
            return firstAccountCategory.Select(a => new FirstCategoryAccountViewModel
            {
                IdAccountFirstCategory = a.IdAccountFirstCategory,
                Name = a.Name
            });
        }




        private bool FirstCategoryAccountExists(int id)
        {
            return _context.FirstCategoryAccounts.Any(e => e.IdAccountFirstCategory == id);
        }
    }
}
