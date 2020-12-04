using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_AccountingSystem.Models.MonthlyClosings
{
    public class SelectMonthlyClosingViewModel
    {
        public int IdMonthlyClosing { get; set; }
        public DateTime Date { get; set; }
        public string Details { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal ProfitOrLoss { get; set; }

    }
}
