using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.JournalSeats
{
    public class GetJournalSeatViewModel
    {
        public int IdJournalSeat { get; set; }
        public string OriginName { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public bool Status { get; set; }
        public int? idMonthlyClosing { get; set; }
        public int SeatNumber { get; set; }
    }
}
