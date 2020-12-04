using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.SecondCategoryAccounts;
using Microsoft.AspNetCore.Authorization;
using Web_AccountingSystem.Models.SecondCategoryAccounts;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class SecondCategoryAccountsController : ControllerBase
    {
        private readonly DbContextApi _context;

        public SecondCategoryAccountsController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/SecondCategoryAccounts/GetSecondCategoryAccounts
        [HttpGet("[action]")]
        public async Task<IEnumerable<SecondCategoryAccountViewModel>> GetSecondCategoryAccounts(int idFirstCategoryAccount)
        {
            var secondAccountCategory = await _context.SecondCategoryAccounts
                .Where(a => a.IdAccountSecondCategory == a.IdAccountSecondCategory)
                .Where(a => a.IdAccountFirstCategory == idFirstCategoryAccount)
                .OrderBy(a => a.Name).ToListAsync();
            return secondAccountCategory.Select(a => new SecondCategoryAccountViewModel
            {
                IdAccountSecondCategory = a.IdAccountSecondCategory,
                Name = a.Name
            });
        }



        private bool SecondCategoryAccountExists(int id)
        {
            return _context.SecondCategoryAccounts.Any(e => e.IdAccountSecondCategory == id);
        }
    }
}
