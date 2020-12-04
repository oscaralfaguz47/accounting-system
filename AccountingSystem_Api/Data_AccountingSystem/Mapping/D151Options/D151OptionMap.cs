using Entities_AccountingSystem.D151Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.D151Options
{
    public class D151OptionMap : IEntityTypeConfiguration<D151Option>
    {
        public void Configure(EntityTypeBuilder<D151Option> builder)
        {
            builder.ToTable("T_D151")
                .HasKey(d => d.IdD151);
        }
    }
}
