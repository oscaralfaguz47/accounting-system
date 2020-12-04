using Entities_AccountingSystem.Roles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.Roles
{
    public class RollMap : IEntityTypeConfiguration<Roll>
    {
        public void Configure(EntityTypeBuilder<Roll> builder)
        {
            builder.ToTable("T_UserRoles")
                .HasKey(r => r.IdRoll);
        }
    }
}
