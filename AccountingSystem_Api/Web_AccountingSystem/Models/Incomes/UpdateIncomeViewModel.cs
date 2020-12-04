using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web_AccountingSystem.Models.JournalMovements;

namespace Web_AccountingSystem.Models.Incomes
{
    public class UpdateIncomeViewModel
    {
        public int IdIncome { get; set; }
        public int IdAccountingAccount { get; set; }
        public string Voucher { get; set; }
        public DateTime RegistrationDate { get; set; }
        public int? IdCustomer { get; set; }
        public string Details { get; set; }
        public decimal IVA { get; set; }
        public decimal TotalAmount { get; set; }
        public int IdD151 { get; set; }
        public int IdMovementType { get; set; }
        public int IdOrigin { get; set; }

        public List<UpdateJournalMovementViewModel> JournalMovements { get; set; }
    }
}
