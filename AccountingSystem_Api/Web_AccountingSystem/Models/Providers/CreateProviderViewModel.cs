using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.Providers
{
    public class CreateProviderViewModel
    {
        public string Identification { get; set; }
        public string Name { get; set; }
        public int IdCompany { get; set; }
        public string Telephone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public DateTime CreationDate { get; set; }
        public bool Status { get; set; }
    }
}
