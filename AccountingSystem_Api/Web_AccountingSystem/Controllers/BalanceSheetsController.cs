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
using Web_AccountingSystem.Models.BalanceSheets;

namespace Web_AccountingSystem.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class BalanceSheetsController : ControllerBase
    {
        private readonly DbContextApi _context;

        public BalanceSheetsController(DbContextApi context)
        {
            _context = context;
        }

        List<JournalMovement> journalMovement { get; set; }

        // GET: api/BalanceSheets/GetBalanceSheet
        [HttpGet("[action]")]
        public async Task<IEnumerable<GetBalanceSheetViewModel>> GetBalanceSheet(int idCompany, string searchType, DateTime initialDate, DateTime finalDate,
            int month, int year)
        {
            // 1- GET ASSET account type where number is equals to 1
            var accountAssetFirstCategory = await _context.FirstCategoryAccounts.FirstOrDefaultAsync(a => a.Number == 1);
            int idAccountAssetFirsCategory = accountAssetFirstCategory.IdAccountFirstCategory;
            // 2 Get ASSET account type where second category is equals to 1
            var accountAssetSecondCategory1 = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(a => a.IdAccountFirstCategory == idAccountAssetFirsCategory && a.Number == 1);
            int idAccountAssetSecondCategory1 = accountAssetSecondCategory1.IdAccountSecondCategory;
            // 3 Get ASSET account type where second category is equals to 2
            var accountAssetSecondCategory2 = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(a => a.IdAccountFirstCategory == idAccountAssetFirsCategory && a.Number == 2);
            int idAccountAssetSecondCategory2 = accountAssetSecondCategory2.IdAccountSecondCategory;
            // 4 Get ASSET account type where second category is equals to 3
            var accountAssetSecondCategory3 = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(a => a.IdAccountFirstCategory == idAccountAssetFirsCategory && a.Number == 3);
            int idAccountAssetSecondCategory3 = accountAssetSecondCategory3.IdAccountSecondCategory;


            // 1- GET LIABILITIES account type where number is equals to 2
            var accountLiabilityFirstCategory = await _context.FirstCategoryAccounts.FirstOrDefaultAsync(a => a.Number == 2);
            int idAccountLiabilityFirsCategory = accountLiabilityFirstCategory.IdAccountFirstCategory;
            // 2 Get LIABILITIES account type where second category is equals to 1
            var accountLiabilitySecondCategory1 = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(a => a.IdAccountFirstCategory == idAccountLiabilityFirsCategory && a.Number == 1);
            int idAccountLiabilitySecondCategory1 = accountLiabilitySecondCategory1.IdAccountSecondCategory;
            // 3 Get LIABILITIES account type where second category is equals to 2
            var accountLiabilitySecondCategory2 = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(a => a.IdAccountFirstCategory == idAccountLiabilityFirsCategory && a.Number == 2);
            int idAccountLiabilitySecondCategory2 = accountLiabilitySecondCategory2.IdAccountSecondCategory;
            // 3 Get LIABILITIES account type where second category is equals to 3
            var accountLiabilitySecondCategory3 = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(a => a.IdAccountFirstCategory == idAccountLiabilityFirsCategory && a.Number == 3);
            int idAccountLiabilitySecondCategory3 = accountLiabilitySecondCategory3.IdAccountSecondCategory;

            // 1- GET PATRIMONY account type where number is equals to 3
            var accountPatrimonyFirstCategory = await _context.FirstCategoryAccounts.FirstOrDefaultAsync(a => a.Number == 3);
            int idAccountPatrimonyFirsCategory = accountPatrimonyFirstCategory.IdAccountFirstCategory;
            // 2 Get PATRIMONY account type where second category is equals to 1
            var accountPatrimonySecondCategory1 = await _context.SecondCategoryAccounts.FirstOrDefaultAsync(a => a.IdAccountFirstCategory == idAccountPatrimonyFirsCategory && a.Number == 1);
            int idAccountPatrimonySecondCategory1 = accountPatrimonySecondCategory1.IdAccountSecondCategory;


            // 1- GET INCOMES Ventas 
            var accountIncomeFirstCategory = await _context.FirstCategoryAccounts.FirstOrDefaultAsync(a => a.Number == 4);
            int idAccountIncomeFirsCategory = accountIncomeFirstCategory.IdAccountFirstCategory;

            // Get incomes Ventas/Ventas
            var accountingAccountIncomes = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountIncomeFirsCategory)
                .OrderBy(a => a.Code).ToListAsync();

            // 1- GET EXPENSES = GASTOS ------//////////////
            var accountExpenseFirstCategory = await _context.FirstCategoryAccounts.FirstOrDefaultAsync(a => a.Number == 5);
            int idAccountExpenseFirsCategory = accountExpenseFirstCategory.IdAccountFirstCategory;

            // Get Expenses Gastos
            var accountingAccountExpense = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountExpenseFirsCategory)
                .OrderBy(a => a.Code).ToListAsync();

            int i;
            decimal totalCurrenAssetsA;
            decimal totalNoCurrentAssetsA;
            decimal totalOtherAssetsA;
            decimal totalAssetsAmount;
            decimal totalCurrentLiabilitiesA;
            decimal totalNoCurrentLiabilitiesA;
            decimal totalOtherLiabilitiesA;
            decimal totalLiabilitiesAmount;
            decimal totalPatrimonyAmount;
            decimal totalLiabilityAndPatrimony;
            DateTime initialMonthDate;
            DateTime finalMonthDate = DateTime.Parse("01/01/2020");

            decimal debitAmount;
            decimal creditAmount;
            decimal totalAmount;

            decimal totalIncomesAmount;
            decimal totalExpensesAmount;
            decimal profitOrLossAmount;

            initialDate = Convert.ToDateTime(""+initialDate.Month+"/"+initialDate.Day+"/"+initialDate.Year+" 00:00:00 am");
            finalDate = Convert.ToDateTime("" + finalDate.Month + "/" + finalDate.Day + "/" + finalDate.Year + " 11:59:59 pm");
            initialMonthDate = DateTime.Parse("" + finalDate.Month + "/01/" + finalDate.Year);
            if(searchType == "period")
            {
                finalMonthDate = DateTime.Parse("" + month + "/01/" + year);
            }
          

            // Get all Assets, Liabilities and Patrimony accounts
            var accountingAccountAll = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountAssetFirsCategory || a.IdAccountFirstCategory == idAccountLiabilityFirsCategory 
                || a.IdAccountFirstCategory == idAccountPatrimonyFirsCategory)
                .OrderBy(a => a.Code).ToListAsync();

            GetBalanceSheetViewModel[] accountingAccount = new GetBalanceSheetViewModel[accountingAccountAll.Count + 19]; // +19 that are the titles and subtitles

            // Get Assets assets/Current Assets
            var accountCurrentAssets = await _context.AccountingAccounts
                .Include(a => a.AccountAffectation)
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountAssetFirsCategory)
                .Where(a => a.IdAccountSecondCategory == idAccountAssetSecondCategory1)
                .OrderBy(a => a.Code).ToListAsync();

            // Get Assets assets/Non Aurrent Assets
            var accountNoCurrentAssets = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountAssetFirsCategory)
                .Where(a => a.IdAccountSecondCategory == idAccountAssetSecondCategory2)
                .OrderBy(a => a.Code).ToListAsync();

            // Get Assets assets/Other Assets
            var accountOtherAssets = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountAssetFirsCategory)
                .Where(a => a.IdAccountSecondCategory == idAccountAssetSecondCategory3)
                .OrderBy(a => a.Code).ToListAsync();

            // Get Liabilities / Current Liabilities
            var accountCurrentLiability = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountLiabilityFirsCategory)
                .Where(a => a.IdAccountSecondCategory == idAccountLiabilitySecondCategory1)
                .OrderBy(a => a.Code).ToListAsync();

            // Get Liabilities / Non Current Liabilities
            var accountNoCurrentLiability = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountLiabilityFirsCategory)
                .Where(a => a.IdAccountSecondCategory == idAccountLiabilitySecondCategory2)
                .OrderBy(a => a.Code).ToListAsync();

            // Get Liabilities / Other Liabilities
            var accountOtherLiability = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountLiabilityFirsCategory)
                .Where(a => a.IdAccountSecondCategory == idAccountLiabilitySecondCategory3)
                .OrderBy(a => a.Code).ToListAsync();

            // Get Patrimony / Patrimony
            var accountPatrimony = await _context.AccountingAccounts
                .Where(a => a.IdCompany == idCompany || a.IdCompany == null)
                .Where(a => a.IdAccountFirstCategory == idAccountPatrimonyFirsCategory)
                .Where(a => a.IdAccountSecondCategory == idAccountPatrimonySecondCategory1)
                .OrderBy(a => a.Code).ToListAsync();

            i = 0;
            totalCurrenAssetsA = 0;
            totalNoCurrentAssetsA = 0;
            totalOtherAssetsA = 0;
            totalAssetsAmount = 0;
            totalCurrentLiabilitiesA = 0;
            totalNoCurrentLiabilitiesA = 0;
            totalOtherLiabilitiesA = 0;
            totalLiabilitiesAmount = 0;
            totalPatrimonyAmount = 0;
            totalLiabilityAndPatrimony = 0;
            totalIncomesAmount = 0;
            totalExpensesAmount = 0;
            profitOrLossAmount = 0;

            // BALANCE SHEET ASSETS/CURRENT ASSETS
            accountingAccount[i] = new GetBalanceSheetViewModel("", "ACTIVO", 0);

            if (accountCurrentAssets.Count == 0)
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Activo Circulante", 0);
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total activo circulante", totalCurrenAssetsA);
            }
            else
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Activo Circulante", 0);
                foreach (var account in accountCurrentAssets)
                {
                    if (searchType == "period")
                    {
                        int daysInMonth = System.DateTime.DaysInMonth(year, month);
                        finalMonthDate = DateTime.Parse("" +month+ "/"+daysInMonth+"/" + year + " 11:59:59 pm");
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                    && j.Date >= initialDate && j.Date <= finalMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
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

                    if (account.AccountAffectation.Name == "Débito")
                    {
                        totalAmount = debitAmount - creditAmount;
                        totalCurrenAssetsA = totalCurrenAssetsA + totalAmount;
                    } else
                    {
                        totalAmount = creditAmount - debitAmount;
                        totalCurrenAssetsA = totalCurrenAssetsA - totalAmount;
                    }

                    i = i + 1;
                    accountingAccount[i] = new GetBalanceSheetViewModel(account.Code, account.AccountName, totalAmount);
                }
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total activo circulante", totalCurrenAssetsA);
            }

            // BALANCE SHEET ASSETS/NON CURRENT ASSETS

            if (accountNoCurrentAssets.Count == 0)
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Activo No Circulante", 0);
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total activo no circulante", totalNoCurrentAssetsA);
            }
            else
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Activo No Circulante", 0);
                foreach (var account in accountNoCurrentAssets)
                {
                    if (searchType == "period")
                    {
                        int daysInMonth = System.DateTime.DaysInMonth(year, month);
                        finalMonthDate = DateTime.Parse("" + month + "/" + daysInMonth + "/" + year + " 11:59:59 pm");
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                    && j.Date >= initialDate && j.Date <= finalMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
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

                    if (account.AccountAffectation.Name == "Débito")
                    {
                        totalAmount = debitAmount - creditAmount;
                        totalNoCurrentAssetsA = totalNoCurrentAssetsA + totalAmount;
                    }
                    else
                    {
                        totalAmount = creditAmount - debitAmount;
                        totalNoCurrentAssetsA = totalNoCurrentAssetsA - totalAmount;
                    }

                    i = i + 1;
                    accountingAccount[i] = new GetBalanceSheetViewModel(account.Code, account.AccountName, totalAmount);
                }
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total activo no circulante", totalNoCurrentAssetsA);
            }

            // BALANCE SHEET ASSETS/OTHER ASSETS

            if (accountOtherAssets.Count == 0)
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Otros Activos", 0);
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total otros activos", totalOtherAssetsA);
                totalAssetsAmount = totalCurrenAssetsA + totalNoCurrentAssetsA + totalOtherAssetsA;
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total Activos", totalAssetsAmount);
            }
            else
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Otros Activos", 0);
                foreach (var account in accountOtherAssets)
                {
                    if (searchType == "period")
                    {
                        int daysInMonth = System.DateTime.DaysInMonth(year, month);
                        finalMonthDate = DateTime.Parse("" + month + "/" + daysInMonth + "/" + year + " 11:59:59 pm");
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                    && j.Date >= initialDate && j.Date <= finalMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
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

                    if (account.AccountAffectation.Name == "Débito")
                    {
                        totalAmount = debitAmount - creditAmount;
                        totalOtherAssetsA = totalOtherAssetsA + totalAmount;
                    }
                    else
                    {
                        totalAmount = creditAmount - debitAmount;
                        totalOtherAssetsA = totalOtherAssetsA - totalAmount;
                    }

                    i = i + 1;
                    accountingAccount[i] = new GetBalanceSheetViewModel(account.Code, account.AccountName, totalAmount);
                }
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total otros activos", totalOtherAssetsA);
                totalAssetsAmount = totalCurrenAssetsA + totalNoCurrentAssetsA + totalOtherAssetsA;
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total Activos", totalAssetsAmount);
            }

            // BALANCE SHEET LIABILITIES/CURRENT LIABILITIES

            if (accountCurrentLiability.Count == 0)
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "PASIVO", 0);
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Pasivo circulante", 0);
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total pasivo circulante", totalCurrentLiabilitiesA);
            }
            else
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "PASIVO", 0);
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Pasivo circulante", 0);
                foreach (var account in accountCurrentLiability)
                {
                    if (searchType == "period")
                    {
                        int daysInMonth = System.DateTime.DaysInMonth(year, month);
                        finalMonthDate = DateTime.Parse("" + month + "/" + daysInMonth + "/" + year + " 11:59:59 pm");
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                    && j.Date >= initialDate && j.Date <= finalMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
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

                    if (account.AccountAffectation.Name == "Crédito")
                    {
                        totalAmount = creditAmount - debitAmount;
                        totalCurrentLiabilitiesA = totalCurrentLiabilitiesA + totalAmount;
                    }
                    else
                    {
                        totalAmount = debitAmount - creditAmount;
                        totalCurrentLiabilitiesA = totalCurrentLiabilitiesA - totalAmount;
                    }

                    i = i + 1;
                    accountingAccount[i] = new GetBalanceSheetViewModel(account.Code, account.AccountName, totalAmount);
                }
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total pasivo circulante", totalCurrentLiabilitiesA);
            }

            // BALANCE SHEET LIABILITIES/NON CURRENT LIABILITIES

            if (accountNoCurrentLiability.Count == 0)
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Pasivo No Circulante", 0);
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total pasivo no circulante", totalNoCurrentLiabilitiesA);
            }
            else
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Pasivo No Circulante", 0);
                foreach (var account in accountNoCurrentLiability)
                {
                    if (searchType == "period")
                    {
                        int daysInMonth = System.DateTime.DaysInMonth(year, month);
                        finalMonthDate = DateTime.Parse("" + month + "/" + daysInMonth + "/" + year + " 11:59:59 pm");
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                    && j.Date >= initialDate && j.Date <= finalMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
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

                    if (account.AccountAffectation.Name == "Crédito")
                    {
                        totalAmount = creditAmount - debitAmount;
                        totalNoCurrentLiabilitiesA = totalNoCurrentLiabilitiesA + totalAmount;
                    }
                    else
                    {
                        totalAmount = debitAmount - creditAmount;
                        totalNoCurrentLiabilitiesA = totalNoCurrentLiabilitiesA - totalAmount;
                    }

                    i = i + 1;
                    accountingAccount[i] = new GetBalanceSheetViewModel(account.Code, account.AccountName, totalAmount);
                }
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total pasivo no circulante", totalNoCurrentLiabilitiesA);
            }

            // BALANCE SHEET LIABILITIES/OTHER LIABILITIES

            if (accountOtherLiability.Count == 0)
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Otros Pasivos", 0);
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total otros pasivos", totalOtherLiabilitiesA);
                totalLiabilitiesAmount = totalCurrentLiabilitiesA + totalNoCurrentLiabilitiesA + totalOtherLiabilitiesA;
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total Pasivos", totalLiabilitiesAmount);
            }
            else
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Otros Pasivos", 0);
                foreach (var account in accountOtherLiability)
                {
                    if (searchType == "period")
                    {
                        int daysInMonth = System.DateTime.DaysInMonth(year, month);
                        finalMonthDate = DateTime.Parse("" + month + "/" + daysInMonth + "/" + year + " 11:59:59 pm");
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                    && j.Date >= initialDate && j.Date <= finalMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
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

                    if (account.AccountAffectation.Name == "Crédito")
                    {
                        totalAmount = creditAmount - debitAmount;
                        totalOtherLiabilitiesA = totalOtherLiabilitiesA + totalAmount;
                    }
                    else
                    {
                        totalAmount = debitAmount - creditAmount;
                        totalOtherLiabilitiesA = totalOtherLiabilitiesA - totalAmount;
                    }

                    i = i + 1;
                    accountingAccount[i] = new GetBalanceSheetViewModel(account.Code, account.AccountName, totalAmount);
                }
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total otros pasivos", totalOtherLiabilitiesA);
                totalLiabilitiesAmount = totalCurrentLiabilitiesA + totalNoCurrentLiabilitiesA + totalOtherLiabilitiesA;
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total Pasivos", totalLiabilitiesAmount);
            }

            // BALANCE SHEET PATRIMONY/PATRIMONY

            if (accountPatrimony.Count == 0)
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "PATRIMONIO", 0);
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total patrimonio", totalPatrimonyAmount);
                totalLiabilityAndPatrimony = totalLiabilitiesAmount + totalPatrimonyAmount;
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total Pasivo y Patrimonio", totalLiabilityAndPatrimony);
            }
            else
            {
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "PATRIMONIO", 0);
                foreach (var account in accountPatrimony)
                {
                    if (searchType == "period")
                    {
                        int daysInMonth = System.DateTime.DaysInMonth(year, month);
                        finalMonthDate = DateTime.Parse("" + month + "/" + daysInMonth + "/" + year + " 11:59:59 pm");
                        journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == account.IdAccountingAccount
                    && j.Date >= initialDate && j.Date <= finalMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
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

                    if (account.AccountAffectation.Name == "Crédito")
                    {
                        totalAmount = creditAmount - debitAmount;
                       
 
                        // GET INCOMES
                        if (account.AccountName == "Utilidad del periodo")
                        {
                            foreach (var accountIncome in accountingAccountIncomes)
                            {
                                if (searchType == "period")
                                {
                                    int daysInMonth = System.DateTime.DaysInMonth(year, month);
                                    initialMonthDate = DateTime.Parse(""+month+"/"+"01/"+year + " 12:00:00 am");
                                    finalMonthDate = DateTime.Parse("" +month + "/"+daysInMonth+"/" + year + " 11:59:59 pm");
                                    journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == accountIncome.IdAccountingAccount
                                && j.Date >= initialMonthDate && j.Date <= finalMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                                }
                                else
                                {
                                    initialMonthDate = DateTime.Parse(""+finalDate.Month+"/01/"+finalDate.Year + " 00:00:00 am");
                                    journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == accountIncome.IdAccountingAccount
                             && j.Date >= initialMonthDate && j.Date <= finalDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                                }

                                decimal incomeDebitAmount = 0;
                                decimal incomeCreditAmount = 0;
                                decimal incomeTotalAmount = 0;
                                foreach (var movement in journalMovement)
                                {
                                    if (movement.AccountAffectation.Name == "Débito")
                                    {
                                        incomeDebitAmount = incomeDebitAmount + movement.TotalAmount;
                                    }
                                    else
                                    {
                                        incomeCreditAmount = incomeCreditAmount + movement.TotalAmount;
                                    }
                                }
                                incomeTotalAmount = incomeCreditAmount - incomeDebitAmount;
                                totalIncomesAmount = totalIncomesAmount + incomeTotalAmount;
                            }
                            // GET EXPENSES
                            foreach (var accountExpense in accountingAccountExpense)
                            {
                                if (searchType == "period")
                                {
                                    int daysInMonth = System.DateTime.DaysInMonth(year, month);
                                    initialMonthDate = DateTime.Parse("" + month + "/" + "01/" + year + " 12:00:00 pm");
                                    finalMonthDate = DateTime.Parse("" +month + "/"+daysInMonth+"/" + year + " 11:59:59 pm");
                                    journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == accountExpense.IdAccountingAccount
                                && j.Date >= initialMonthDate && j.Date <= finalMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                                }
                                else
                                {
                                    initialMonthDate = DateTime.Parse("" + finalDate.Month + "/01/" + finalDate.Year + " 12:00:00 pm");
                                    journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == accountExpense.IdAccountingAccount
                             && j.Date >= initialMonthDate && j.Date <= finalDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                                }

                                decimal expenseDebitAmount = 0;
                                decimal expenseCreditAmount = 0;
                                decimal expenseTotalAmount = 0;
                                foreach (var movement in journalMovement)
                                {
                                    if (movement.AccountAffectation.Name == "Débito")
                                    {
                                        expenseDebitAmount = expenseDebitAmount + movement.TotalAmount;
                                    }
                                    else
                                    {
                                        expenseCreditAmount = expenseCreditAmount + movement.TotalAmount;
                                    }
                                }
                                expenseTotalAmount = expenseDebitAmount - expenseCreditAmount;
                                totalExpensesAmount = totalExpensesAmount + expenseTotalAmount;
                            }
                            profitOrLossAmount = totalIncomesAmount - totalExpensesAmount;
                            totalAmount = totalAmount + profitOrLossAmount;

                        }

                        // If acumulated profits

                        // GET INCOMES
                        if (account.AccountName == "Utilidades acumuladas")
                        {
                            totalIncomesAmount = 0;
                            totalExpensesAmount = 0;
                            foreach (var accountIncome in accountingAccountIncomes)
                            {
                                if (searchType == "period")
                                {
                                    initialMonthDate = DateTime.Parse("" + month + "/" + "01/" + year);
                                    journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == accountIncome.IdAccountingAccount
                                && j.Date < initialMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                                }
                                else
                                {
                             
                                    initialMonthDate = DateTime.Parse("" + finalDate.Month + "/" + "01/" + finalDate.Year + " 11:59:59 pm").AddDays(-1);
                                    journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == accountIncome.IdAccountingAccount
                              && j.Date < initialMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                                }

                                decimal incomeDebitAmount = 0;
                                decimal incomeCreditAmount = 0;
                                decimal incomeTotalAmount = 0;
                                foreach (var movement in journalMovement)
                                {
                                    if (movement.AccountAffectation.Name == "Débito")
                                    {
                                        incomeDebitAmount = incomeDebitAmount + movement.TotalAmount;
                                    }
                                    else
                                    {
                                        incomeCreditAmount = incomeCreditAmount + movement.TotalAmount;
                                    }
                                }
                                incomeTotalAmount = incomeCreditAmount - incomeDebitAmount;
                                totalIncomesAmount = totalIncomesAmount + incomeTotalAmount;
                            }
                            // GET EXPENSES
                            foreach (var accountExpense in accountingAccountExpense)
                            {
                                if (searchType == "period")
                                {
                                    initialMonthDate = DateTime.Parse("" + month + "/" + "01/" + year);
                                    journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == accountExpense.IdAccountingAccount
                                && j.Date < initialMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                                }
                                else
                                {
                                    initialMonthDate = DateTime.Parse("" + finalDate.Month + "/" + "01/" + finalDate.Year + " 11:59:59 pm").AddDays(-1);
                                    journalMovement = await _context.JournalMovements.Include(j => j.AccountAffectation).Where(j => j.IdAccountingAccount == accountExpense.IdAccountingAccount
                              && j.Date < initialMonthDate && j.IdCompany == idCompany && j.Status == true).ToListAsync();
                                }

                                decimal expenseDebitAmount = 0;
                                decimal expenseCreditAmount = 0;
                                decimal expenseTotalAmount = 0;
                                foreach (var movement in journalMovement)
                                {
                                    if (movement.AccountAffectation.Name == "Débito")
                                    {
                                        expenseDebitAmount = expenseDebitAmount + movement.TotalAmount;
                                    }
                                    else
                                    {
                                        expenseCreditAmount = expenseCreditAmount + movement.TotalAmount;
                                    }
                                }
                                expenseTotalAmount = expenseDebitAmount - expenseCreditAmount;
                                totalExpensesAmount = totalExpensesAmount + expenseTotalAmount;
                            }
                            profitOrLossAmount = totalIncomesAmount - totalExpensesAmount;
                            totalAmount = totalAmount + profitOrLossAmount;

                        }

                        totalPatrimonyAmount = totalPatrimonyAmount + totalAmount;
                    }
                    else
                    {
                        totalAmount = debitAmount - creditAmount;
                        totalPatrimonyAmount = totalPatrimonyAmount- totalAmount;
                    }

                    i = i + 1;
                    accountingAccount[i] = new GetBalanceSheetViewModel(account.Code, account.AccountName, totalAmount);
                }
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total patrimonio", totalPatrimonyAmount);
                totalLiabilityAndPatrimony = totalLiabilitiesAmount + totalPatrimonyAmount;
                i = i + 1;
                accountingAccount[i] = new GetBalanceSheetViewModel("", "Total Pasivo y Patrimonio", totalLiabilityAndPatrimony);
            }



            return accountingAccount;
        }

    }
}
