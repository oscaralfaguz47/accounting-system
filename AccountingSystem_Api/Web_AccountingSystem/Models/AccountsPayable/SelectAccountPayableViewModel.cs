using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.AccountsPayable
{
    public class SelectAccountPayableViewModel
    {
        public int IdAccountPayable { get; set; }
        public DateTime AccountingDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Provider { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal BalanceAmount { get; set; }
        public string Details { get; set; }
        public int? IdExpense { get; set; }
        public bool AccountStatus { get; set; }
        public int creditDays { get; set; }
        public int daysToExpire { get; set; }

    }
}
