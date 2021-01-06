using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_AccountingSystem;
using Entities_AccountingSystem.Users;
using Web_AccountingSystem.Models.Users;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Entities_AccountingSystem.UserCompanies;

namespace Web_AccountingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DbContextApi _context;
        //Configuration variable
        private readonly IConfiguration _config;

        public UsersController(DbContextApi context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // GET: api/Users/GetUsers
        [Authorize(Roles = "Administrador")]
        [HttpGet("[action]")]
        public async Task<IEnumerable<UserViewModel>> GetUsers()
        {
            var user = await _context.User.Include(u => u.Roll).ToListAsync();
            return user.Select(u => new UserViewModel  // Retorn an object that instances the UserViewModel
            {
                IdUser = u.IdUser,
                IdRoll = u.IdRoll,
                Roll = u.Roll.Name,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                CreationDate = u.CreationDate,
                Status = u.Status,
                Ocupation = u.Ocupation,
                PasswordHash = u.PasswordHash
            });
        }



        // POST: api/Users/CreateUser
        [HttpPost("[action]")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var email = model.Email.ToLower();

            if (await _context.User.AnyAsync(u => u.Email == email))
            {
                return BadRequest("El email ingresado ya existe");
            }

            CrearPasswordHash(model.Password, out byte[] passwordHash, out byte[] passwordSalt);

            User user = new User
            {

                IdRoll = model.IdRoll,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email.ToLower(),
                CreationDate = DateTime.Now,
                Status = true,
                Ocupation = model.Ocupation,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };
            _context.User.Add(user);
            
            try
            {
                await _context.SaveChangesAsync(); // Save the changes
            }
            catch
            {
                return BadRequest(); // If the changes were not saved then send a Bad Request message
            }

            return Ok();

        }

        // POST: api/Users/CreateUser
        [Authorize(Roles = "Administrador")]
        [HttpPost("[action]")]
        public async Task<IActionResult> CreateUserFromUser([FromBody] CreateUserViewModel model, int idUserLogedIn)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var email = model.Email.ToLower();

            if (await _context.User.AnyAsync(u => u.Email == email))
            {
                return BadRequest("El email ingresado ya existe");
            }

            CrearPasswordHash(model.Password, out byte[] passwordHash, out byte[] passwordSalt);

            User user = new User
            {

                IdRoll = model.IdRoll,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email.ToLower(),
                CreationDate = DateTime.Now,
                Status = true,
                Ocupation = model.Ocupation,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };

            try
            {
                _context.User.Add(user);
                await _context.SaveChangesAsync(); // Save the changes

                var idUser = user.IdUser;
                var companies = await _context.UserCompanies.Include(uc => uc.company)
                .Where(uc => uc.IdUser == idUserLogedIn)
                .Where(uc => uc.company.Status == true)
                .ToListAsync();
                foreach (var comp in companies)
                {
                    UserCompany userCompany = new UserCompany
                    {
                        IdUser = idUser,
                        IdCompany = comp.IdCompany
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

        // PUT: api/Users/UpdateUser
        [Authorize(Roles = "Administrador")]
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.idUser <= 0)
            {
                return BadRequest();
            }

            var user = await _context.User.FirstOrDefaultAsync(u => u.IdUser == model.idUser);

            if (user == null)
            {
                return NotFound();
            }

            user.IdRoll = model.IdRoll;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email.ToLower();
            user.Ocupation = model.Ocupation;


            if (model.act_password == true)
            {
                CrearPasswordHash(model.Password, out byte[] passwordHash, out byte[] passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Save exception
                return BadRequest();
            }

            return Ok();
        }

        // Methot to encrypt the password
        private void CrearPasswordHash(string Password, out byte[] passwordHash, out byte[] PasswordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                PasswordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(Password));
            }
        }

        // PUT: api/Users/DeactivateUser
        [Authorize(Roles = "Administrador")]
        [HttpPut("[action]")]
        public async Task<IActionResult> DeactivateUser(int idUser)
        {

            if (idUser <= 0)
            {
                return BadRequest();
            }

            var user = await _context.User.FirstOrDefaultAsync(u => u.IdUser == idUser);

            if (user == null)
            {
                return NotFound();
            }

            user.Status = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Save Exception
                return BadRequest();
            }

            return Ok();
        }

        // PUT: api/Users/ActivateUser
        [Authorize(Roles = "Administrador")]
        [HttpPut("[action]")]
        public async Task<IActionResult> ActivateUser(int idUser)
        {

            if (idUser <= 0)
            {
                return BadRequest();
            }

            var user = await _context.User.FirstOrDefaultAsync(u => u.IdUser == idUser);

            if (user == null)
            {
                return NotFound();
            }

            user.Status = true;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Save Exception
                return BadRequest();
            }

            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Login(LoginViewModel model) // It receives an object model that instantiates from LoginViewModel
        {
            var email = model.Email.ToLower();
            // Variable for user, look for an existing and active email
            var user = await _context.User.Where(u=>u.Status==true).Include(u => u.Roll).FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound();
            }

            // Verifying if the password is NOT in the database for this user, we call the method (VerifyPasswordHash) and we send the entered Password, the PasswordHash and the PasswordSalt
            if (!VerifyPasswordHash(model.Password, user.PasswordHash, user.PasswordSalt))
            {
                return NotFound();
            }

            // Reclamations that contains information about the user
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.IdUser.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, user.Roll.Name),
                new Claim("IdUser", user.IdUser.ToString()),
                new Claim("Roll", user.Roll.Name),
                new Claim("FirstName", user.FirstName),
                new Claim("LastName", user.LastName),
                new Claim("Email", user.Email),
                new Claim("Status", user.Status.ToString())
            };

            // If the password is correct the method will return the new generated token
            return Ok(
                new {token = GenerateToken(claims)}
                );
        }

        // Method verify password
        private bool VerifyPasswordHash(string password, byte[] passwordHashSaved, byte[] passwordSalt)
        {
            // Here we encrypt the entered password
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
                {
                var passwordHashNew = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                // Comparing if the passwordHashSaved is the same than passwordHashNew, if it is the same return a true if not return false
                return new ReadOnlySpan<byte>(passwordHashSaved).SequenceEqual(new ReadOnlySpan<byte>(passwordHashNew));
            }
        }

        // Method Generate Token after that the user is login 
        private string GenerateToken(List<Claim> claims)  // Receives the list of claims 
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"])); // Variable for key
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);         // Variable for credentials

            // The Jwt:key and Jwt:Issuer must configurate in appsettings.json file
            // Generate the token
            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                expires: DateTime.Now.AddMinutes(880),
                signingCredentials: creds,
                claims: claims
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }




        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.IdUser == id);
        }
    }
}
