using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.IncomeStatements
{
    public class GetIncomeStatementViewModel
    {
        private string Name;
        private decimal Amount;
        private string Code;

        public GetIncomeStatementViewModel(string Code, string AccountingAccountName, decimal Amount)
        {
            this.Name = AccountingAccountName;
            this.Amount = Amount;
            this.Code = Code; 
        }
        public string name
        {
            get { return Name; }
            set { Name = value; }
        }
        public decimal amount
        {
            get { return Amount; }
            set { Amount = value; }
        }
        public string code
        {
            get { return Code; }
            set { Code = value; }
        }
    }
}
