using Entities_AccountingSystem.AccountAffectations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.AccountAffectations
{
    public class AccountAffectationMap : IEntityTypeConfiguration<AccountAffectation>
    {
        public void Configure(EntityTypeBuilder<AccountAffectation> builder)
        {
            builder.ToTable("T_AccountAffectations")
                .HasKey(a => a.IdAccountAffectation);
        }
    }
}
