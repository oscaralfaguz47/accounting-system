using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web_AccountingSystem.Models.UserCompanies;

namespace Web_AccountingSystem.Models.Companies
{
    public class CreateCompanyViewModel
    {
        public string Name { get; set; }
        public string Identification { get; set; }
        public string Email { get; set; }
        public string CompanyPhone { get; set; }
        public DateTime CreationDate { get; set; }
        public bool Status { get; set; }

        public List<UserCompanyViewModel> userCompanies { get; set; }
    }
}
