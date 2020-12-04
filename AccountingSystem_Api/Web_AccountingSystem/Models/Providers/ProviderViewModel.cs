using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.Providers
{
    public class ProviderViewModel
    {
        public int IdProvider { get; set; }
        public string Identification { get; set; }
        public string Name { get; set; }
        public int IdCompany { get; set; }
        public string CompanyName { get; set; }
        public string Telephone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public bool Status { get; set; }
    }
}
