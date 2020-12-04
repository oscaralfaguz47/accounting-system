using Entities_AccountingSystem.Providers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.Providers
{
    public class ProviderMap : IEntityTypeConfiguration<Provider>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Provider> builder)
        {
            builder.ToTable("T_Providers")
                .HasKey(p => p.IdProvider);
        }
    }
}
