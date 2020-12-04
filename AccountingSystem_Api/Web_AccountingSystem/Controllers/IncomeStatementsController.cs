using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data_AccountingSystem;
using Entities_AccountingSystem.JournalMovements;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_AccountingSystem.Models.IncomeStatements;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class IncomeStatementsController : ControllerBase
    {
        private readonly DbContextApi _context;

        public IncomeStatementsController(DbContextApi context)
        {
            _context = context;
        }
        List<JournalMovement> journalMovement { get; set; }


        // GET: api/IncomeStatement/GetIncomeStatement
        [HttpGet("[action]")]
        public async Task<IEnumerable<GetIncomeStatementViewModel>> GetIncomeStatement(int idCompany, string searchType, DateTime initialDate, DateTime finalDate,
            int month, int year)
        {
            // 1- GET INCOMES Ventas 
            var accountIncomeFirstCategory = await _context.FirstCategoryAccounts.FirstOrDefaultAsync(a => a.Number == 4);
            int idAccountIncomeFirsCategory = accountIncomeFirstCategory.IdAccountFirstCategory;
            // Get INCOMES second categoty 1 = Ventas 
            var accountIncomeSecondCategory1 = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(a => a.IdAccountFirstCategory == idAccountIncomeFirsCategory && a.Number == 1);
            int idAccountIncomeSecondCategory1 = accountIncomeSecondCategory1.IdAccountSecondCategory;

            // Get INCOMES second categoty 2 = Otros Ingresos 
            var accountIncomeSecondCategory2 = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(a => a.IdAccountFirstCategory == idAccountIncomeFirsCategory && a.Number == 2);
            int idAccountIncomeSecondCategory2 = accountIncomeSecondCategory2.IdAccountSecondCategory;

            // 1- GET EXPENSES = GASTOS ------//////////////
            var accountExpenseFirstCategory = await _context.FirstCategoryAccounts.FirstOrDefaultAsync(a => a.Number == 5);
            int idAccountExpenseFirsCategory = accountExpenseFirstCategory.IdAccountFirstCategory;

            // Get EXPENSES second categoty 1 = Gastos de ventas  
            var accountExpenseSecondCategory1 = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(a => a.IdAccountFirstCategory == idAccountExpenseFirsCategory && a.Number == 1);
            int idAccountExpenseSecondCategory1 = accountExpenseSecondCategory1.IdAccountSecondCategory;

            // Get EXPENSES second categoty 2 = Gastos administrativos
            var accountExpenseSecondCategory2 = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(a => a.IdAccountFirstCategory == idAccountExpenseFirsCategory && a.Number == 2);
            int idAccountExpenseSecondCategory2 = accountExpenseSecondCategory2.IdAccountSecondCategory;

            // Get EXPENSES second categoty 3 = Gastos financieros
            var accountExpenseSecondCategory3 = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(a => a.IdAccountFirstCategory == idAccountExpenseFirsCategory && a.Number == 3);
            int idAccountExpenseSecondCategory3 = accountExpenseSecondCategory3.IdAccountSecondCategory;

            int i;
            decimal totalIncomesSalesAmount;
            decimal totalIncomesOtherIAmount;
            decimal totalIncomesAmount;
            decimal totalExpensesSalesAmount;
            decimal totalExpensesAdministrativeAmount;
            decimal totalExpensesFinancialAmount;
            decimal totalExpensesAmount;
            decimal profitOrLossAmount;
            decimal debitAmount;
            decimal creditAmount;
            decimal totalAmount;

            initialDate = Convert.ToDateTime("" + initialDate.Month + "/" + initialDate.Day + "/" + initialDate.Year + " 00:00:00 am");
            finalDate = Convert.ToDateTime("" + finalDate.Month + "/" + finalDate.Day + "/" + finalDate.Year + " 11:59:59 pm");


            // Get all incomes and Expenses accounts
            var accountingAccountAllIncomes = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountIncomeFirsCategory || a.IdAccountFirstCategory == idAccountExpenseFirsCategory)
                .OrderBy(a => a.Code).ToListAsync();

            GetIncomeStatementViewModel[] accountingAccount = new GetIncomeStatementViewModel[accountingAccountAllIncomes.Count + 15]; // +15 that are the titles and subtitles


                // Get incomes Ventas/Ventas
                var accountingAccountIncomeSales = await _context.AccountingAccounts
                    .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                    .Where(a => a.IdAccountFirstCategory == idAccountIncomeFirsCategory)
                    .Where(a => a.IdAccountSecondCategory == idAccountIncomeSecondCategory1)
                    .OrderBy(a => a.Code).ToListAsync();

            // Get incomes Ventas/Otros Ingresos
            var accountingAccountIncomeOtherIncomes = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountIncomeFirsCategory)
                .Where(a => a.IdAccountSecondCategory == idAccountIncomeSecondCategory2)
                .OrderBy(a => a.Code).ToListAsync();

            // Get Expenses Gastos/Gastos de ventas
            var accountingAccountExpenseSalesE = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountExpenseFirsCategory)
                .Where(a => a.IdAccountSecondCategory == idAccountExpenseSecondCategory1)
                .OrderBy(a => a.Code).ToListAsync();

            // Get Expenses Gastos/Gastos Administrativos
            var accountingAccountExpenseAdmin = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountExpenseFirsCategory)
                .Where(a => a.IdAccountSecondCategory == idAccountExpenseSecondCategory2)
                .OrderBy(a => a.Code).ToListAsync();

            // Get Expenses Gastos/Gastos Financieros
            var accountingAccountExpenseFin = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountExpenseFirsCategory)
                .Where(a => a.IdAccountSecondCategory == idAccountExpenseSecondCategory3)
                .OrderBy(a => a.Code).ToListAsync();

            i = 0;
            totalIncomesSalesAmount = 0;
            totalIncomesOtherIAmount = 0;
            totalIncomesAmount = 0;
            totalExpensesSalesAmount = 0;
            totalExpensesAdministrativeAmount = 0;
            totalExpensesFinancialAmount = 0;
            totalExpensesAmount = 0;
            profitOrLossAmount = 0;

            // INCOME STATEMENT INCOMES/SALES INCOMES
                accountingAccount[i] = new GetIncomeStatementViewModel("", "INGRESOS", 0);
                
            if (accountingAccountIncomeSales.Count == 0)
            {
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Ingresos de ventas", 0);
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Total Ingresos de Ventas", totalIncomesSalesAmount);
            } else
            {
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Ingresos de ventas", 0);
                foreach (var account in accountingAccountIncomeSales)
                {
                    if(searchType == "period")
                    {
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                    && j.Date.Month == month && j.Date.Year == year && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                    } else
                    {
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                   && j.Date >= initialDate && j.Date <= finalDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                    }
                    
                    debitAmount = 0;
                    creditAmount = 0;
                    totalAmount = 0;
                    foreach (var movement in journalMovement)
                    {
                        if (movement.AccountAffectation.Name == "Débito")
                        {
                            debitAmount = debitAmount + movement.TotalAmount;
                        }
                        else
                        {
                            creditAmount = creditAmount + movement.TotalAmount;
                        }
                    }
                    totalAmount = creditAmount - debitAmount;
                    totalIncomesSalesAmount = totalIncomesSalesAmount + totalAmount;
                    i = i + 1;
                    accountingAccount[i] = new GetIncomeStatementViewModel(account.Code, account.AccountName, totalAmount);
                }
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Total Ingresos de Ventas", totalIncomesSalesAmount);
            }

            // INCOME STATEMENT INCOMES/SALES OTHER INCOMES
          

            if (accountingAccountIncomeOtherIncomes.Count == 0)
            {
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Otros ingresos", 0);
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Total otros ingresos", totalIncomesOtherIAmount);
                totalIncomesAmount = totalIncomesSalesAmount + totalIncomesOtherIAmount;
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "TOTAL INGRESOS", totalIncomesAmount);
            }
            else
            {
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Otros ingresos", 0);
                foreach (var account in accountingAccountIncomeOtherIncomes)
                {
                    if (searchType == "period")
                    {
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                    && j.Date.Month == month && j.Date.Year == year && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                    }
                    else
                    {
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                   && j.Date >= initialDate && j.Date <= finalDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                    }

                    debitAmount = 0;
                    creditAmount = 0;
                    totalAmount = 0;
                    foreach (var movement in journalMovement)
                    {
                        if (movement.AccountAffectation.Name == "Débito")
                        {
                            debitAmount = debitAmount + movement.TotalAmount;
                        }
                        else
                        {
                            creditAmount = creditAmount + movement.TotalAmount;
                        }
                    }
                    totalAmount = creditAmount - debitAmount;
                    totalIncomesOtherIAmount = totalIncomesOtherIAmount + totalAmount;
                    i = i + 1;
                    accountingAccount[i] = new GetIncomeStatementViewModel(account.Code, account.AccountName, totalAmount);
                }
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Total otros ingresos", totalIncomesOtherIAmount);
                totalIncomesAmount = totalIncomesSalesAmount + totalIncomesOtherIAmount;
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "TOTAL INGRESOS", totalIncomesAmount);
            }

            // INCOME STATEMENT EXPENSES/SALES EXPENSES


            if (accountingAccountExpenseSalesE.Count == 0)
            {
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "GASTOS", 0);
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Gastos de ventas", totalExpensesSalesAmount);
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Total gastos de ventas", totalExpensesSalesAmount);
            }
            else
            {
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "GASTOS", 0);
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Gastos de ventas", totalExpensesSalesAmount);
                foreach (var account in accountingAccountExpenseSalesE)
                {
                    if (searchType == "period")
                    {
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                    && j.Date.Month == month && j.Date.Year == year && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                    }
                    else
                    {
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                   && j.Date >= initialDate && j.Date <= finalDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                    }

                    debitAmount = 0;
                    creditAmount = 0;
                    totalAmount = 0;
                    foreach (var movement in journalMovement)
                    {
                        if (movement.AccountAffectation.Name == "Débito")
                        {
                            debitAmount = debitAmount + movement.TotalAmount;
                        }
                        else
                        {
                            creditAmount = creditAmount + movement.TotalAmount;
                        }
                    }
                    totalAmount = debitAmount - creditAmount;
                    totalExpensesSalesAmount = totalExpensesSalesAmount + totalAmount;
                    i = i + 1;
                    accountingAccount[i] = new GetIncomeStatementViewModel(account.Code, account.AccountName, totalAmount);
                }
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Total gastos de ventas", totalExpensesSalesAmount);

            }

            // INCOME STATEMENT EXPENSES/ADMINISTRATIVE EXPENSES


            if (accountingAccountExpenseAdmin.Count == 0)
            {
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Gastos administrativos", 0);
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Total gastos administrativos", totalExpensesAdministrativeAmount);
            }
            else
            {
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Gastos administrativos", 0);

                foreach (var account in accountingAccountExpenseAdmin)
                {
                    if (searchType == "period")
                    {
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                    && j.Date.Month == month && j.Date.Year == year && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                    }
                    else
                    {
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                   && j.Date >= initialDate && j.Date <= finalDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                    }

                    debitAmount = 0;
                    creditAmount = 0;
                    totalAmount = 0;
                    foreach (var movement in journalMovement)
                    {
                        if (movement.AccountAffectation.Name == "Débito")
                        {
                            debitAmount = debitAmount + movement.TotalAmount;
                        }
                        else
                        {
                            creditAmount = creditAmount + movement.TotalAmount;
                        }
                    }
                    totalAmount = debitAmount - creditAmount;
                    totalExpensesAdministrativeAmount = totalExpensesAdministrativeAmount + totalAmount;
                    i = i + 1;
                    accountingAccount[i] = new GetIncomeStatementViewModel(account.Code, account.AccountName, totalAmount);
                }
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Total gastos administrativos", totalExpensesAdministrativeAmount);
            }

            // INCOME STATEMENT EXPENSES/FINANCIAL EXPENSES


            if (accountingAccountExpenseFin.Count == 0)
            {
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Gastos financieros", 0);
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Total gastos financieros", totalExpensesFinancialAmount);
                totalExpensesAmount = totalExpensesSalesAmount + totalExpensesAdministrativeAmount + totalExpensesFinancialAmount;
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "TOTAL GASTOS", totalExpensesAmount);
                profitOrLossAmount = totalIncomesAmount - totalExpensesAmount;
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "UTILIDAD / PERDIDA", profitOrLossAmount);
            }
            else
            {
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Gastos financieros", 0);

                foreach (var account in accountingAccountExpenseFin)
                {
                    if (searchType == "period")
                    {
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                    && j.Date.Month == month && j.Date.Year == year && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                    }
                    else
                    {
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                   && j.Date >= initialDate && j.Date <= finalDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                    }
                    debitAmount = 0;
                    creditAmount = 0;
                    totalAmount = 0;
                    foreach (var movement in journalMovement)
                    {
                        if (movement.AccountAffectation.Name == "Débito")
                        {
                            debitAmount = debitAmount + movement.TotalAmount;
                        }
                        else
                        {
                            creditAmount = creditAmount + movement.TotalAmount;
                        }
                    }
                    totalAmount = debitAmount - creditAmount;
                    totalExpensesFinancialAmount = totalExpensesFinancialAmount + totalAmount;
                    i = i + 1;
                    accountingAccount[i] = new GetIncomeStatementViewModel(account.Code, account.AccountName, totalAmount);
                }
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "Total gastos financieros", totalExpensesFinancialAmount);
                totalExpensesAmount = totalExpensesSalesAmount + totalExpensesAdministrativeAmount + totalExpensesFinancialAmount;
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "TOTAL GASTOS", totalExpensesAmount);
                profitOrLossAmount = totalIncomesAmount - totalExpensesAmount;
                i = i + 1;
                accountingAccount[i] = new GetIncomeStatementViewModel("", "UTILIDAD / PERDIDA", profitOrLossAmount);
            }

            return accountingAccount;
        }

    }
}
