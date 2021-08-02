using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web_AccountingSystem.Models.JournalMovements;

namespace Web_AccountingSystem.Models.Expenses
{
    public class CreateExpenseViewModel
    {
        public int IdCompany { get; set; }
        public int IdAccountingAccount { get; set; }
        public int IdJournalSeat { get; set; }
        public string Voucher { get; set; }
        public DateTime RegistrationDate { get; set; }
        public int IdProvider { get; set; }
        public string Details { get; set; }
        public decimal IVA { get; set; }
        public decimal TotalAmount { get; set; }
        public bool Status { get; set; }
        public int IdD151 { get; set; }
        public int IdMovementType { get; set; }
        public int IdOrigin { get; set; }
        public int creditDays { get; set; } 

        public List<CreateJournalMovementViewModel> JournalMovements { get; set; }
    }
}
