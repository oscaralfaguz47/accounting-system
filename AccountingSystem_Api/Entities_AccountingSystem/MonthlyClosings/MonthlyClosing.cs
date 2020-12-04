using Entities_AccountingSystem.Companies;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities_AccountingSystem.MonthlyClosings
{
    public class MonthlyClosing
    {
        public int IdMonthlyClosing { get; set; }
        public DateTime Date { get; set; }
        public string Details { get; set; }
        public int IdCompany { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal ProfitOrLoss { get; set; }
        public bool Status { get; set; }
        public Company Company { get; set; }
    }
}
