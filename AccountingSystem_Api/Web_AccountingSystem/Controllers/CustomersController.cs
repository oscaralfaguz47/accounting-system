using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.Customers;
using Web_AccountingSystem.Models.Customers;
using Microsoft.AspNetCore.Authorization;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly DbContextApi _context;

        public CustomersController(DbContextApi context)
        {
            _context = context;
        }

        // GET: api/UserCompanies/GetUserCompanies
        [HttpGet("[action]")]
        public async Task<IEnumerable<SelectCustomersViewModel>> SelectCustomers(int idCompany)
        {
            var customer = await _context.Customers
                .Where(c => c.IdCompany == idCompany)
                .Where(c => c.Status == true)
                .OrderBy(c => c.Name).ToListAsync();
            return customer.Select(c => new SelectCustomersViewModel
            {
                IdCustomer = c.IdCustomer, 
                Identification = c.Identification,
                Name = c.Name,
                Telephone = c.Telephone,
                Email = c.Email,
                Address = c.Address,
                Status = c.Status
            });
        }

        // GET: api/Customers/CustomersList
        [HttpGet("[action]")]
        public async Task<IEnumerable<GetCustomerViewModel>> CustomersList(int idCompany)
        {
            var customer = await _context.Customers
                .Where(c => c.IdCompany == idCompany)
                .Where(c => c.Status == true)
                .OrderBy(c => c.Name).ToListAsync();
            return customer.Select(c => new GetCustomerViewModel
            {
                IdCustomer = c.IdCustomer,
                Name = c.Name
            });
        }

        // POST: api/Customers/CreateCustomer
        [HttpPost("[action]")]
        public async Task<ActionResult> CreateCustomer([FromBody] CreateCustomerViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Customer customer = new Customer
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
            _context.Customers.Add(customer);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
            return Ok();
        }

        // PUT: api/Customers/UpdateCustomer
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateCustomer([FromBody] UpdateCustomerViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.IdCustomer <= 0)
            {
                return BadRequest();
            }

            var customer = await _context.Customers.FirstOrDefaultAsync(a => a.IdCustomer == model.IdCustomer);

            if (customer == null)
            {
                return NotFound();
            }

            customer.Name = model.Name;
            customer.Identification = model.Identification;
            customer.Email = model.Email;
            customer.Telephone = model.Telephone;
            customer.Address = model.Address;

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

        // PUT: api/Customers/DeleteCustomer
        [HttpPut("[action]")]
        public async Task<IActionResult> DeleteCustomer(int idCustomer)
        {

            if (idCustomer <= 0)
            {
                return BadRequest();
            }

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.IdCustomer == idCustomer);

            if (customer == null)
            {
                return NotFound();
            }

            customer.Status = false;

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

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.IdCustomer == id);
        }
    }
}
