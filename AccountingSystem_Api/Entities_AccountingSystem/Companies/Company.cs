using Entities_AccountingSystem.UserCompanies;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities_AccountingSystem.Companies
{
    public class Company
    {
        public int IdCompany { get; set; }
        public string Name { get; set; }
        public string Identification { get; set; }
        public string Email { get; set; }
        public string CompanyPhone { get; set; }
        public DateTime CreationDate { get; set; } 
        public bool Status { get; set; }

        public ICollection<UserCompany> userCompanies { get; set; }
     

    }
}
