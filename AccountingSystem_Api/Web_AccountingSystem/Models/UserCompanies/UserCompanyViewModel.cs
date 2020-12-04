using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.UserCompanies
{
    public class UserCompanyViewModel
    {
        public int IdUser { get; set; }
        public int IdCompany { get; set; }
        public string CompanyName { get; set; }
        public string CompanyIdentification { get; set; }
        public string CompanyEmail { get; set; }
        public string CompanyPhone { get; set; }
        public bool CompanyStatus { get; set; }

    }
}
