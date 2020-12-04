using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.Expenses
{
    public class SelectExpenseViewModel
    {
        public int IdExpense { get; set; }
        public int IdAccountingAccount { get; set; }
        public string AccountName { get; set; }
        public int IdJournalSeat { get; set; }
        public int SeatNumber { get; set; }
        public string Voucher { get; set; }
        public DateTime RegistrationDate { get; set; }
        public int? IdProvider { get; set; }
        public string ProviderName { get; set; }
        public string Details { get; set; }
        public decimal IVA { get; set; }
        public decimal TotalAmount { get; set; }
        public int IdD151 { get; set; }
        public string D151Name { get; set; }
        public int IdMovementType { get; set; }
        public string MovementTypeName { get; set; }
        public int? IdMonthlyClosing { get; set; }
    }
}
