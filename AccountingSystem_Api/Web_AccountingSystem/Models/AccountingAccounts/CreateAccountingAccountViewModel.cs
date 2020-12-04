using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.AccountingAccounts
{
    public class CreateAccountingAccountViewModel
    {
        public int IdCompany { get; set; }
        public int IdAccountFirstCategory { get; set; }
        public int IdAccountSecondCategory { get; set; }
        public int AccountThirdCategory { get; set; }
        public int IdAccountAffectation { get; set; }
        public string Code { get; set; }
        public string AccountName { get; set; }
        public string Description { get; set; }
        public DateTime CreationDate { get; set; }
        public bool DefaultAccount { get; set; }
    }
}
