using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.AccountingAccounts
{
    public class SelectDefaultAccountsViewModel
    {
        public int IdAccountingAccount { get; set; }
        public string AccountName { get; set; }
        public int IdAccountAffectation { get; set; }
        public string Code { get; set; }
    }
}
