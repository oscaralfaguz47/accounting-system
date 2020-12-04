using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web_AccountingSystem.Models.JournalMovements;

namespace Web_AccountingSystem.Models.JournalSeats
{
    public class UpdateJournalSeatViewModel
    {
        public int IdJournalSeat { get; set; }
        public int IdCompany { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }

        public List<UpdateJournalMovementViewModel> JournalMovements { get; set; }

    }
}
