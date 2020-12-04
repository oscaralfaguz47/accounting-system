using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.Providers;
using Microsoft.AspNetCore.Authorization;
using Web_AccountingSystem.Models.Providers;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProvidersController : ControllerBase
    {
        private readonly DbContextApi _context;

        public ProvidersController(DbContextApi context)
        {
            _context = context;
        }

        //Get: api/Providers/GetProviders
        [HttpGet("[action]")]
        public async Task<IEnumerable<ProviderViewModel>> GetProviders(int idCompany)
        {
            var provider = await _context.Providers.Include(p => p.Company)
                .Where(p => p.IdCompany == idCompany)
                .Where(p => p.Status == true)
                .ToListAsync();

            return provider.Select(p => new ProviderViewModel 
            { 
                IdProvider = p.IdProvider,
                Identification = p.Identification,
                Name = p.Name,
                IdCompany = p.IdCompany,
                CompanyName = p.Company.Name,
                Telephone = p.Telephone,
                Email = p.Email,
                Address = p.Address,
                Status = p.Status
            });
        }

        // GET: api/Providers/ProvidersList
        [HttpGet("[action]")]
        public async Task<IEnumerable<GetProviderViewModel>> ProvidersList(int idCompany)
        {
            var provider = await _context.Providers
                .Where(c => c.IdCompany == idCompany)
                .Where(c => c.Status == true)
                .OrderBy(c => c.Name).ToListAsync();
            return provider.Select(c => new GetProviderViewModel
            {
                IdProvider = c.IdProvider,
                Name = c.Name
            });
        }

        // POST: api/Providers/CreateProvider
        [HttpPost("[action]")]
        public async Task<ActionResult> CreateProvider([FromBody] CreateProviderViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Provider provider = new Provider
            {
                Identification = model.Identification,
                Name = model.Name,
                IdCompany = model.IdCompany,
                Telephone = model.Telephone,
                Email = model.Email,
                Address = model.Address,
                CreationDate = DateTime.Now,
                Status = true
            };
            _context.Providers.Add(provider);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
            return Ok();
        }

        // PUT: api/Providers/UpdateProvider
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateProvider([FromBody] UpdateProviderViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.IdProvider <= 0)
            {
                return BadRequest();
            }

            var provider = await _context.Providers.FirstOrDefaultAsync(a => a.IdProvider == model.IdProvider);

            if (provider == null)
            {
                return NotFound();
            }

            provider.Name = model.Name;
            provider.Identification = model.Identification;
            provider.Email = model.Email;
            provider.Telephone = model.Telephone;
            provider.Address = model.Address;

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

        // PUT: api/Providers/DeleteProvider
        [HttpPut("[action]")]
        public async Task<IActionResult> DeleteProvider(int idProvider)
        {

            if (idProvider <= 0)
            {
                return BadRequest();
            }

            var provider = await _context.Providers.FirstOrDefaultAsync(c => c.IdProvider == idProvider);

            if (provider == null)
            {
                return NotFound();
            }

            provider.Status = false;

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


        private bool ProviderExists(int id)
        {
            return _context.Providers.Any(e => e.IdProvider == id);
        }
    }
}
