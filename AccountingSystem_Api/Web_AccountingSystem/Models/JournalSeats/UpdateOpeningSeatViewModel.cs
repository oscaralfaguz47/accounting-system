using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web_AccountingSystem.Models.JournalMovements;

namespace Web_AccountingSystem.Models.JournalSeats
{
    public class UpdateOpeningSeatViewModel
    {
        public int IdJournalSeat { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }

        public List<UpdateOpeningSeatJournalMovementViewModel> JournalMovements { get; set; }
    }
}
