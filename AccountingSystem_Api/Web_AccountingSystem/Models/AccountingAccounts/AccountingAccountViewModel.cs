using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.AccountingAccounts
{
    public class AccountingAccountViewModel
    {
        public int IdAccountingAccount { get; set; }
        public int IdAccountFirstCategory { get; set; }
        public string FirstCategoryName { get; set; }
        public int IdAccountSecondCategory { get; set; }
        public string SecondCategoryName { get; set; }
        public int IdAccountAffectation { get; set; }
        public string AccountAffectationName { get; set; }
        public string Code { get; set; }
        public string AccountName { get; set; }
        public string Description { get; set; }
    }
}
