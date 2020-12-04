using Entities_AccountingSystem.Companies;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities_AccountingSystem.Customers
{
    public class Customer
    {
        public int IdCustomer { get; set; }
        public string Identification { get; set; }
        public string Name { get; set; }
        public int IdCompany { get; set; }
        public string Telephone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; } 
        public DateTime CreationDate { get; set; }
        public bool Status { get; set; }

        public Company Company { get; set; }

    }
}
