using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.Users
{
    public class UpdateUserViewModel
    {
        public int idUser { get; set; }
        public int IdRoll { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Ocupation { get; set; }
        public string Password { get; set; }
        public bool act_password { get; set; }
    }
}
