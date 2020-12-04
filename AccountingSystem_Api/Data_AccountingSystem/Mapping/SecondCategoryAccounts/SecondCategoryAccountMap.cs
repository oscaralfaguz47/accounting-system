using Entities_AccountingSystem.SecondCategoryAccounts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.SecondCategoryAccounts
{
    public class SecondCategoryAccountMap : IEntityTypeConfiguration<SecondCategoryAccount>
    {
        public void Configure(EntityTypeBuilder<SecondCategoryAccount> builder)
        {
            builder.ToTable("T_AccountSecondCategories")
                .HasKey(a => a.IdAccountSecondCategory);

        }
    }
}
