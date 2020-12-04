using Entities_AccountingSystem.AccountAffectations;
using Entities_AccountingSystem.Companies;
using Entities_AccountingSystem.FirstCategoryAccounts;
using Entities_AccountingSystem.SecondCategoryAccounts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities_AccountingSystem.AccountingAccounts
{
    public class AccountingAccount
    {
        public int IdAccountingAccount { get; set; }
        [ForeignKey("IdCompany")]
        public int? IdCompany { get; set; }
        public int IdAccountFirstCategory { get; set; }
        public int IdAccountSecondCategory { get; set; }
        public int AccountThirdCategory { get; set; }
        public int IdAccountAffectation { get; set; }
        public string Code { get; set; }
        public string AccountName { get; set; }
        public string Description { get; set; }
        public DateTime CreationDate { get; set; }
        public bool DefaultAccount { get; set; }

        public Company Company { get; set; }
        public FirstCategoryAccount FirstCategoryAccount { get; set; }
       public SecondCategoryAccount SecondCategoryAccount { get; set; }
       public AccountAffectation AccountAffectation { get; set; }

    }
}
