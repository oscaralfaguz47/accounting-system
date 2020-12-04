using Entities_AccountingSystem.Companies;
using Entities_AccountingSystem.Roles;
using Entities_AccountingSystem.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities_AccountingSystem.UserCompanies
{
    public class UserCompany
    {
        [ForeignKey("IdUser")]
        public int IdUser { get; set; }
        [ForeignKey("IdCompany")]
        public int IdCompany { get; set; }

        
        public User User { get; set; }
        public Company company { get; set; }

    }
}
