using Entities_AccountingSystem.FirstCategoryAccounts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.FirstCategoryAccounts
{
    public class FirstCategoryAccountMap : IEntityTypeConfiguration<FirstCategoryAccount>
    {
        public void Configure(EntityTypeBuilder<FirstCategoryAccount> builder)
        {
            builder.ToTable("T_AccountFirstCategories")
                .HasKey(a => a.IdAccountFirstCategory);
        }
    }
}
