using Data_AccountingSystem.Mapping.AccountAffectations;
using Data_AccountingSystem.Mapping.AccountingAccounts;
using Data_AccountingSystem.Mapping.AccountsPayable;
using Data_AccountingSystem.Mapping.AccountsPayableMovements;
using Data_AccountingSystem.Mapping.Companies;
using Data_AccountingSystem.Mapping.Customes;
using Data_AccountingSystem.Mapping.D151Options;
using Data_AccountingSystem.Mapping.Expenses;
using Data_AccountingSystem.Mapping.FirstCategoryAccounts;
using Data_AccountingSystem.Mapping.Incomes;
using Data_AccountingSystem.Mapping.JournalMovements;
using Data_AccountingSystem.Mapping.JournalSeats;
using Data_AccountingSystem.Mapping.MonthlyClosings;
using Data_AccountingSystem.Mapping.MovementsType;
using Data_AccountingSystem.Mapping.Origins;
using Data_AccountingSystem.Mapping.Providers;
using Data_AccountingSystem.Mapping.Roles;
using Data_AccountingSystem.Mapping.SecondCategoryAccounts;
using Data_AccountingSystem.Mapping.UserCompanies;
using Data_AccountingSystem.Mapping.Users;
using Entities_AccountingSystem.AccountAffectations;
using Entities_AccountingSystem.AccountingAccounts;
using Entities_AccountingSystem.AccountsPayable;
using Entities_AccountingSystem.AccountsPayableMovements;
using Entities_AccountingSystem.Companies;
using Entities_AccountingSystem.Customers;
using Entities_AccountingSystem.D151Options;
using Entities_AccountingSystem.Expenses;
using Entities_AccountingSystem.FirstCategoryAccounts;
using Entities_AccountingSystem.Incomes;
using Entities_AccountingSystem.JournalMovements;
using Entities_AccountingSystem.JournalSeats;
using Entities_AccountingSystem.MonthlyClosings;
using Entities_AccountingSystem.MovementsType;
using Entities_AccountingSystem.Origins;
using Entities_AccountingSystem.Providers;
using Entities_AccountingSystem.Roles;
using Entities_AccountingSystem.SecondCategoryAccounts;
using Entities_AccountingSystem.UserCompanies;
using Entities_AccountingSystem.Users;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data_AccountingSystem
{
    public class DbContextApi : DbContext
    {

        public DbSet<User> User { get; set; }
        public DbSet<Roll> Roles { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<UserCompany> UserCompanies { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<SecondCategoryAccount> SecondCategoryAccounts { get; set; }
        public DbSet<FirstCategoryAccount> FirstCategoryAccounts { get; set; }
        public DbSet<AccountAffectation> AccountAffectations { get; set; }
        public DbSet<AccountingAccount> AccountingAccounts { get; set; }
        public DbSet<JournalSeat> JournalSeats { get; set; }
        public DbSet<Origin> Origins { get; set; }
        public DbSet<MonthlyClosing> MonthlyClosings { get; set; }
        public DbSet<JournalMovement> JournalMovements { get; set; }
        public DbSet<Income> Incomes { get; set; }
        public DbSet<D151Option> D151Options { get; set; }
        public DbSet<MovementType> MovementsType { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<AccountPayable> AccountsPayable { get; set; }
        public DbSet<AccountsPayableMovement> AccountsPayableMovements { get; set; }

        public DbContextApi(DbContextOptions<DbContextApi> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new UserMap());
            modelBuilder.ApplyConfiguration(new RollMap());
            modelBuilder.ApplyConfiguration(new CompanyMap());
            modelBuilder.ApplyConfiguration(new UserCompanyMap());
            modelBuilder.ApplyConfiguration(new CustomerMap());
            modelBuilder.ApplyConfiguration(new ProviderMap());
            modelBuilder.ApplyConfiguration(new SecondCategoryAccountMap());
            modelBuilder.ApplyConfiguration(new FirstCategoryAccountMap());
            modelBuilder.ApplyConfiguration(new AccountAffectationMap());
            modelBuilder.ApplyConfiguration(new AccountingAccountMap());
            modelBuilder.ApplyConfiguration(new JournalSeatMap());
            modelBuilder.ApplyConfiguration(new OriginMap());
            modelBuilder.ApplyConfiguration(new MonthlyClosingMap());
            modelBuilder.ApplyConfiguration(new JournalMovementMap());
            modelBuilder.ApplyConfiguration(new IncomeMap());
            modelBuilder.ApplyConfiguration(new D151OptionMap());
            modelBuilder.ApplyConfiguration(new MovementTypeMap());
            modelBuilder.ApplyConfiguration(new ExpenseMap());
            modelBuilder.ApplyConfiguration(new AccountPayableMap());
            modelBuilder.ApplyConfiguration(new AccountsPayableMovementMap());
        }

    }
}
