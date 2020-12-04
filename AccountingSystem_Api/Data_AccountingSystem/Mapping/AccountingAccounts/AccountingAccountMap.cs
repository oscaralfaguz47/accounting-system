using Entities_AccountingSystem.AccountingAccounts;
using Entities_AccountingSystem.Companies;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.AccountingAccounts
{
    public class AccountingAccountMap : IEntityTypeConfiguration<AccountingAccount>
    {
        public void Configure(EntityTypeBuilder<AccountingAccount> builder)
        {
            builder.ToTable("T_AccountingAccounts")
                .HasKey(a => a.IdAccountingAccount);
            builder.HasOne(a => a.Company)
                .WithMany()
                .HasForeignKey(s => s.IdCompany);
       
                
        }
    }
}
