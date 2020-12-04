using Entities_AccountingSystem.MonthlyClosings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.MonthlyClosings
{
    public class MonthlyClosingMap : IEntityTypeConfiguration<MonthlyClosing>
    {
        public void Configure(EntityTypeBuilder<MonthlyClosing> builder)
        {
            builder.ToTable("T_MonthlyClosings")
                .HasKey(m => m.IdMonthlyClosing);
        }
    }
}
