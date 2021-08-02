using Entities_AccountingSystem.AccountsPayableMovements;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.AccountsPayableMovements
{
    public class AccountsPayableMovementMap : IEntityTypeConfiguration<AccountsPayableMovement>
    {
        public void Configure(EntityTypeBuilder<AccountsPayableMovement> builder)
        {
            builder.ToTable("T_AccountsPayableMovements")
                .HasKey(x => x.IdAccountPayableMovement);
        }
    }
}
