using Entities_AccountingSystem.AccountsPayable;
using Entities_AccountingSystem.JournalSeats;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities_AccountingSystem.AccountsPayableMovements
{
    public class AccountsPayableMovement
    {
        public int IdAccountPayableMovement { get; set; }
        public int IdAccountPayable { get; set; }
        public int IdJournalSeat { get; set; }
        public DateTime RegistrationDate { get; set; }
        public decimal AppliedAmount { get; set; }
        public string Details { get; set; }

        public AccountPayable AccountPayable { get; set; }
        public JournalSeat JournalSeat { get; set; }
    }
}
