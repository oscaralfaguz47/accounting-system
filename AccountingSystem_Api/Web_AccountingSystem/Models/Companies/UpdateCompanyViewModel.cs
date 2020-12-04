using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.Companies
{
    public class UpdateCompanyViewModel
    {
        public int IdCompany { get; set; }
        public string Name { get; set; }
        public string Identification { get; set; }
        public string Email { get; set; }
        public string CompanyPhone { get; set; }
    }
}
