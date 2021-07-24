using Data_AccountingSystem;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsPayableController : Controller
    {
        private readonly DbContextApi _context;

        public AccountsPayableController(DbContextApi context)
        {
            _context = context;
        }





    }
}
