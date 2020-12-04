using Entities_AccountingSystem.UserCompanies;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem.Mapping.UserCompanies
{
    public class UserCompanyMap : IEntityTypeConfiguration<UserCompany>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<UserCompany> builder)
        {
            builder.ToTable("T_UserCompanies")
                 .HasKey(uc =>  new { uc.IdUser, uc.IdCompany });

        }
    }
}
