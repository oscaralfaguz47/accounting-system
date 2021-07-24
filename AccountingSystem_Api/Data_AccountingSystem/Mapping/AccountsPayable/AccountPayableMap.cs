using Entities_AccountingSystem.AccountsPayable;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.AccountsPayable
{
    public class AccountPayableMap : IEntityTypeConfiguration<AccountPayable>
    {
        public void Configure(EntityTypeBuilder<AccountPayable> builder)
        {
            builder.ToTable("T_AccountsPayable")
                 .HasKey(x => x.IdAccountPayable);
        }
    }
}
