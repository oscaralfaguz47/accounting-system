using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.Users
{
    public class UserViewModel
    {

        public int IdUser { get; set; }
        public int IdRoll { get; set; }
        public string Roll { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime CreationDate { get; set; }
        public bool Status { get; set; }
        public string Ocupation { get; set; }
        public byte[] PasswordHash { get; set; }
    }
}
