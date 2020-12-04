using Entities_AccountingSystem.JournalMovements;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.JournalMovements
{
    public class JournalMovementMap : IEntityTypeConfiguration<JournalMovement>
    {
        public void Configure(EntityTypeBuilder<JournalMovement> builder)
        {
            builder.ToTable("T_JournalMovements")
                .HasKey(j => j.IdJounalMovement);
            builder.HasOne(j => j.MonthlyClosing)
                .WithMany()
                .HasForeignKey(f => f.IdMonthlyClosing);
        }
    }
}
