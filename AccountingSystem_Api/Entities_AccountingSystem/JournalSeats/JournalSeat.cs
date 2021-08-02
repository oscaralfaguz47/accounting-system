using Entities_AccountingSystem.AccountsPayable;
using Entities_AccountingSystem.Companies;
using Entities_AccountingSystem.JournalMovements;
using Entities_AccountingSystem.MonthlyClosings;
using Entities_AccountingSystem.Origins;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities_AccountingSystem.JournalSeats
{
    public class JournalSeat
    {
        public int IdJournalSeat { get; set; }
        public int IdOrigin { get; set; }
        public int IdCompany { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public bool Status { get; set; }
        [ForeignKey("IdMonthlyClosing")]
        public int? IdMonthlyClosing { get; set; }
        public int SeatNumber { get; set; }
        public int? IdAccountPayable { get; set; }

        public ICollection<JournalMovement> JournalMovements { get; set; }
        public Origin Origin { get; set; }
        public Company Company { get; set; }
        public MonthlyClosing MonthlyClosing { get; set; }
        public AccountPayable AccountPayable { get; set; }
    }
}
