using System;

namespace Web_AccountingSystem.Models.AccountsPayableMovements
{
    public class SelectAccountPayableMovementViewModel
    {
        public int IdAccountPayableMovement { get; set; }
        public int IdAccountPayable { get; set; }
        public int JournalSeatNumber { get; set; }
        public DateTime RegistrationDate { get; set; }
        public decimal AppliedAmount { get; set; }
        public string Details { get; set; }
    }
}
