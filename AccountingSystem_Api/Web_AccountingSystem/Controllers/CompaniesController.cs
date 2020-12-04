using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.Companies;
using Web_AccountingSystem.Models.Companies;
using Microsoft.AspNetCore.Authorization;
using Entities_AccountingSystem.UserCompanies;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly DbContextApi _context;

        public CompaniesController(DbContextApi context)
        {
            _context = context;
        }

        // POST: api/Companies/CreateCompany
        [HttpPost("[action]")]
        public async Task<IActionResult> CreateFirstCompany([FromBody] CreateCompanyViewModel model, int idUserCreator)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var date = DateTime.Now;

            Company company = new Company
            {
                Name = model.Name,
                Identification = model.Identification,
                Email = model.Email,
                CompanyPhone = model.CompanyPhone,
                CreationDate = date,
                Status = true,
            };

            try
            {
                _context.Companies.Add(company); // Save the changes
                await _context.SaveChangesAsync();

                var idCompany = company.IdCompany;

                UserCompany userCompany1 = new UserCompany
                {
                    IdUser = idUserCreator,
                    IdCompany = idCompany
                };
                _context.UserCompanies.Add(userCompany1); // Save the changes
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest(); // If the changes were not saved then send a Bad Request message
            }

            return Ok();

        }

        // POST: api/Companies/CreateCompany
        [HttpPost("[action]")]
        public async Task<IActionResult> CreateCompany([FromBody] CreateCompanyViewModel model, int idCompanyCreator)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var date = DateTime.Now;

            Company company = new Company
            {
                Name = model.Name,
                Identification = model.Identification,
                Email = model.Email,
                CompanyPhone = model.CompanyPhone,
                CreationDate = date,
                Status = true,
            };

            try
            {
                _context.Companies.Add(company); // Save the changes
                await _context.SaveChangesAsync();

                var idCompany = company.IdCompany;


                var users = await _context.UserCompanies.Include(uc => uc.User)
                .Where(uc => uc.IdCompany == idCompanyCreator)
                .ToListAsync();

                foreach (var us in users)
                {
                    UserCompany userCompany = new UserCompany
                    {
                        IdUser = us.IdUser,
                        IdCompany = idCompany
                    };
                    _context.UserCompanies.Add(userCompany);
                }
                
                    await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest(); // If the changes were not saved then send a Bad Request message
            }

            return Ok();

        }

        // PUT: api/Companies/UpdateCompany
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateCompany([FromBody] UpdateCompanyViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.IdCompany <= 0)
            {
                return BadRequest();
            }

            var company = await _context.Companies.FirstOrDefaultAsync(a => a.IdCompany == model.IdCompany);

            if (company == null)
            {
                return NotFound();
            }

            company.Name = model.Name;
            company.Identification = model.Identification;
            company.Email = model.Email;
            company.CompanyPhone = model.CompanyPhone;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
               
                return BadRequest();
            }

            return Ok();
        }

        // PUT: api/Companies/DeleteCompany
        [HttpPut("[action]")]
        public async Task<IActionResult> DeleteCompany( int idCompany)
        {

            if (idCompany <= 0)
            {
                return BadRequest();
            }

            var company = await _context.Companies.FirstOrDefaultAsync(c => c.IdCompany == idCompany);

            if (company == null)
            {
                return NotFound();
            }

            company.Status = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return BadRequest();
            }

            return Ok();
        }


        private bool CompanyExists(int id)
        {
            return _context.Companies.Any(e => e.IdCompany == id);
        }
    }
}
