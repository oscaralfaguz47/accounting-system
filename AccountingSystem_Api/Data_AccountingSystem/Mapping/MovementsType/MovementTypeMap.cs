using Entities_AccountingSystem.MovementsType;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.MovementsType
{
    public class MovementTypeMap : IEntityTypeConfiguration<MovementType>
    {
        public void Configure(EntityTypeBuilder<MovementType> builder)
        {
            builder.ToTable("T_MovementType")
                .HasKey(m => m.IdMovementType);
        }
    }
}
