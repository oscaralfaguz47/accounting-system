using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.UserCompanies;
using Web_AccountingSystem.Models.UserCompanies;
using Microsoft.AspNetCore.Authorization;

namespace Web_AccountingSystem.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class UserCompanies : ControllerBase
    {
        private readonly DbContextApi _context;

        public UserCompanies(DbContextApi context)
        {
            _context = context;
        }

        [Authorize(Roles = "Administrador")]
        // GET: api/UserCompanies/GetUserCompanies
        [HttpGet("[action]")]
        public async Task<IEnumerable<UserCompanyViewModel>> GetUserCompanies(int idUser)
        {
            var company = await _context.UserCompanies.Include(uc => uc.company)
                .Where(uc => uc.IdUser == idUser)
                .Where(uc => uc.company.Status == true)
                .ToListAsync();
            return company.Select(uc => new UserCompanyViewModel  
            {
                IdUser = uc.IdUser,
                IdCompany = uc.IdCompany,
                CompanyName = uc.company.Name,
                CompanyIdentification = uc.company.Identification,
                CompanyEmail = uc.company.Email,
                CompanyPhone = uc.company.CompanyPhone,
                CompanyStatus = uc.company.Status
            });
        }


        [Authorize(Roles = "Administrador, Visitante")]
        // GET: api/UserCompanies/SelectCompanies
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectCompaniesViewModel>> SelectCompanies(int idUser)
        {
            var company = await _context.UserCompanies
                .Include(uc => uc.company)
                .Where(uc => uc.IdUser == idUser)
                .Where(uc => uc.company.Status == true)
                .ToListAsync();
            return company.Select(uc => new SelectCompaniesViewModel  
            {
                IdCompany = uc.IdCompany,
                CompanyName = uc.company.Name
            });
        }


        [Authorize(Roles = "Administrador, Visitante")]
        // GET: api/UserCompanies/SelectFirstCompany
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectCompaniesViewModel>> SelectFirstCompany(int idUser)
        {

            var company = await _context.UserCompanies.Include(uc => uc.company)
                .Where(uc => uc.IdUser == idUser)
                .Where(uc => uc.company.Status == true)
                .OrderBy(uc => uc.IdCompany).Take(1).ToListAsync();
            return company.Select(uc => new SelectCompaniesViewModel
            {
                IdCompany = uc.IdCompany,
                CompanyName = uc.company.Name
            });
        }

        [Authorize(Roles = "Administrador")]
        // GET: api/UserCompanies/GetUsers
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectUsersViewModel>> GetUsers(int idCompany)
        {
            var user = await _context.UserCompanies.Include(u => u.User).Include(u => u.User.Roll).Where(u => u.IdCompany == idCompany)
                .OrderByDescending(u => u.IdUser).Take(100).ToListAsync();
            return user.Select(u => new SelectUsersViewModel  
            {
                IdUser = u.IdUser,
                IdRoll = u.User.IdRoll,
                Roll = u.User.Roll.Name,
                FirstName = u.User.FirstName,
                LastName = u.User.LastName,
                Email = u.User.Email,
                Status = u.User.Status,
                Ocupation = u.User.Ocupation
            });
        }


        private bool UserCompanyExists(int id)
        {
            return _context.UserCompanies.Any(e => e.IdUser == id);
        }
    }
}
