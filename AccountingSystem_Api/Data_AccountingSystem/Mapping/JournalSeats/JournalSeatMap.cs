using Entities_AccountingSystem.JournalSeats;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.JournalSeats
{
    public class JournalSeatMap : IEntityTypeConfiguration<JournalSeat>
    {
        public void Configure(EntityTypeBuilder<JournalSeat> builder)
        {
            builder.ToTable("T_JournalSeats")
                .HasKey(j => j.IdJournalSeat);
            builder.HasOne(j => j.MonthlyClosing)
                .WithMany()
                .HasForeignKey(f => f.IdMonthlyClosing);
        }
    }
}
