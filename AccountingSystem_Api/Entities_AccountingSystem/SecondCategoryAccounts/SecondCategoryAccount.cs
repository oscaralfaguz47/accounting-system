using Entities_AccountingSystem.FirstCategoryAccounts;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities_AccountingSystem.SecondCategoryAccounts
{
    public class SecondCategoryAccount
    {
        public int IdAccountSecondCategory { get; set;}
        public int IdAccountFirstCategory { get; set; }
        public string Name { get; set; }
        public int Number { get; set; }

        public FirstCategoryAccount FirstCategoryAccount { get; set; }
    }
}
