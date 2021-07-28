using Entities_AccountingSystem.AccountingAccounts;
using Entities_AccountingSystem.Companies;
using Entities_AccountingSystem.D151Options;
using Entities_AccountingSystem.JournalSeats;
using Entities_AccountingSystem.MonthlyClosings;
using Entities_AccountingSystem.MovementsType;
using Entities_AccountingSystem.Providers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities_AccountingSystem.Expenses
{
    public class Expense
    {
        public int IdExpense { get; set; }
        public int IdCompany { get; set; }
        public int IdAccountingAccount { get; set; }
        public int IdJournalSeat { get; set; } 
        public string Voucher { get; set; }
        public DateTime RegistrationDate { get; set; }
        [ForeignKey("IdProvider")]
        public int? IdProvider { get; set; }
        public string Details { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal IVA { get; set; }
        public bool Status { get; set; }
        public int IdD151 { get; set; }
        public int IdMovementType { get; set; }
        [ForeignKey("IdMonthlyClosing")]
        public int? IdMonthlyClosing { get; set; }
        public bool? AccountPayablePaid { get; set; }

        public Company Company { get; set; }
        public AccountingAccount AccountingAccount { get; set; }
        public JournalSeat JournalSeat { get; set; }
        public Provider Provider { get; set; }
        public D151Option D151Option { get; set; }
        public MovementType MovementType { get; set; }
        public MonthlyClosing MonthlyClosing { get; set; }

    }
}
