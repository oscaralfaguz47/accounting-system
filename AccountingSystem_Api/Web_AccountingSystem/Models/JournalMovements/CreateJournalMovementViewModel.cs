using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.JournalMovements
{
    public class CreateJournalMovementViewModel
    {
        public int IdJournalSeat { get; set; }
        public int IdCompany { get; set; }
        public int IdAccountingAccount { get; set; }
        public int IdAccountAffectation { get; set; }
        public DateTime Date { get; set; }
        public decimal TotalAmount { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }
        public int IdOrigin { get; set; }
    }
}
