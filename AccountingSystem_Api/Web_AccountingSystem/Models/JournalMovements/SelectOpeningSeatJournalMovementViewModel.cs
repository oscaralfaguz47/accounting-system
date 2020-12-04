using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.JournalMovements
{
    public class SelectOpeningSeatJournalMovementViewModel
    {
        public int IdJounalMovement { get; set; }
        public int IdJournalSeat { get; set; }
        public int IdAccountAffectation { get; set; }
        public decimal TotalAmount { get; set; }
        public int? IdMonthlyClosing { get; set; }
        public DateTime Date { get; set; }
    }
}
