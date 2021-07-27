using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.AccountsPayable
{
    public class PayAccountPayableViewModel
    {
        public int IdAccountPayable { get; set; }
        public decimal AppliedAmount { get; set; }
        public string Details { get; set; }
        public int IdCreditedAccount { get; set; }
    }
}
