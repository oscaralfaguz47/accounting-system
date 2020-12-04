using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.JournalMovements
{
    public class SelectDetailedJournalMovementViewModel
    {
        public string AccountingAccountName { get; set; }
        public string AccountAffectationName { get; set; }
        public decimal TotalAmount { get; set; }
        public string Description { get; set; }
    }
}
