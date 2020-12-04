using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web_AccountingSystem.Models.JournalMovements;

namespace Web_AccountingSystem.Models.JournalSeats
{
    public class CreateJournalSeatViewModel
    {
        public int IdOrigin { get; set; }
        public int IdCompany { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public bool Status { get; set; }
        public int SeatNumber { get; set; }

        public List<CreateJournalMovementViewModel> JournalMovements { get; set; }
    }
}
