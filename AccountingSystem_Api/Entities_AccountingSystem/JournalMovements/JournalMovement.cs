using Entities_AccountingSystem.AccountAffectations;
using Entities_AccountingSystem.AccountingAccounts;
using Entities_AccountingSystem.Companies;
using Entities_AccountingSystem.JournalSeats;
using Entities_AccountingSystem.MonthlyClosings;
using Entities_AccountingSystem.Origins;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities_AccountingSystem.JournalMovements
{
    public class JournalMovement
    {
        public int IdJounalMovement { get; set; }
        public int IdJournalSeat { get; set; }
        public int IdCompany { get; set; }
        public int IdAccountingAccount { get; set; }
        public int IdAccountAffectation { get; set; }
        public DateTime Date { get; set; }
        public decimal TotalAmount { get; set; }
        public string Description { get; set; }
        [ForeignKey("IdMonthlyClosing")]
        public int? IdMonthlyClosing { get; set; }
        public bool Status { get; set; }
        public int IdOrigin { get; set; }

        public JournalSeat JournalSeat { get; set; }
        public Company Company { get; set; }
        public AccountingAccount AccountingAccount { get; set; }
        public AccountAffectation AccountAffectation { get; set; }
        public MonthlyClosing MonthlyClosing { get; set; }
        public Origin Origin { get; set; }
    }
}
