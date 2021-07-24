using Entities_AccountingSystem.Companies;
using Entities_AccountingSystem.Expenses;
using Entities_AccountingSystem.Providers;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities_AccountingSystem.AccountsPayable
{
    public class AccountPayable
    {
        public int IdAccountPayable { get; set; }
        public int IdCompany { get; set; }
        public DateTime RegistrationDate { get; set; }
        public DateTime AccountingDate { get; set; }
        public DateTime ModificationDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public int? IdProvider { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal BalanceAmount { get; set; }
        public string Details { get; set; }
        public bool AccountStatus { get; set; }
        public bool Status { get; set; }
        public int? IdExpense { get; set; }

        public Company Company { get; set; }
        public Provider Provider { get; set; }
        public Expense Expense { get; set; }

    }
}
