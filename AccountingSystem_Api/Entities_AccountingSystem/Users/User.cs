using Entities_AccountingSystem.Roles;
using Entities_AccountingSystem.UserCompanies;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities_AccountingSystem.Users
{
    public class User
    {
        [Required]
        public int IdUser { get; set; }
        [Required]
        [ForeignKey("IdRoll")]
        public int IdRoll { get; set; }

        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public DateTime CreationDate { get; set; }
        [Required]
        public bool Status { get; set; }
        public string Ocupation { get; set; }
        [Required]
        public byte[] PasswordHash { get; set; }
        [Required]
        public byte[] PasswordSalt { get; set; }

        public Roll Roll { get; set; }
        public ICollection<UserCompany> userCompanies { get; set; }
    }
}
