import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class YearsMonthsService {

  constructor() { }

  selectMonths() {
    const months = [
      {'id': 1, 'name' : 'Enero'},
      {'id': 2, 'name' : 'Febrero'},
      {'id': 3, 'name' : 'Marzo'},
      {'id': 4, 'name' : 'Abril'},
      {'id': 5, 'name' : 'Mayo'},
      {'id': 6, 'name' : 'Junio'},
      {'id': 7, 'name' : 'Julio'},
      {'id': 8, 'name' : 'Agosto'},
      {'id': 9, 'name' : 'Septiembre'},
      {'id': 10, 'name' : 'Octubre'},
      {'id': 11, 'name' : 'Noviembre'},
      {'id': 12, 'name' : 'Diciembre'}
    ];
    return months;
  }

  selectYears() {
    const years = [
      {'id': 1, 'value' : 2000},
      {'id': 2, 'value' : 2001},
      {'id': 3, 'value' : 2002},
      {'id': 4, 'value' : 2003},
      {'id': 5, 'value' : 2004},
      {'id': 6, 'value' : 2005},
      {'id': 7, 'value' : 2006},
      {'id': 8, 'value' : 2007},
      {'id': 9, 'value' : 2008},
      {'id': 10, 'value' : 2009},
      {'id': 11, 'value' : 2010},
      {'id': 12, 'value' : 2011},
      {'id': 13, 'value' : 2012},
      {'id': 14, 'value' : 2013},
      {'id': 15, 'value' : 2014},
      {'id': 16, 'value' : 2015},
      {'id': 17, 'value' : 2016},
      {'id': 18, 'value' : 2017},
      {'id': 19, 'value' : 2018},
      {'id': 20, 'value' : 2019},
      {'id': 21, 'value' : 2020},
      {'id': 22, 'value' : 2021},
      {'id': 23, 'value' : 2022},
      {'id': 24, 'value' : 2023},
      {'id': 25, 'value' : 2024},
      {'id': 26, 'value' : 2025},
      {'id': 27, 'value' : 2026},
      {'id': 28, 'value' : 2027},
      {'id': 29, 'value' : 2028},
      {'id': 30, 'value' : 2029},
      {'id': 31, 'value' : 2030},
      {'id': 32, 'value' : 2031},
      {'id': 33, 'value' : 2032},
      {'id': 34, 'value' : 2033},
      {'id': 35, 'value' : 2034},
      {'id': 36, 'value' : 2035},
      {'id': 37, 'value' : 2036},
      {'id': 38, 'value' : 2037},
      {'id': 39, 'value' : 2038},
      {'id': 40, 'value' : 2039},
      {'id': 41, 'value' : 2040},
      {'id': 42, 'value' : 2041},
      {'id': 43, 'value' : 2042},
      {'id': 44, 'value' : 2043},
      {'id': 45, 'value' : 2044},
      {'id': 46, 'value' : 2045},
      {'id': 47, 'value' : 2046},
      {'id': 48, 'value' : 2047},
      {'id': 49, 'value' : 2048},
      {'id': 50, 'value' : 2049},
      {'id': 51, 'value' : 2050},
      {'id': 52, 'value' : 2051},
      {'id': 53, 'value' : 2052},
      {'id': 54, 'value' : 2053},
      {'id': 55, 'value' : 2054},
      {'id': 56, 'value' : 2055},
      {'id': 57, 'value' : 2056},
      {'id': 58, 'value' : 2057},
      {'id': 59, 'value' : 2058},
      {'id': 60, 'value' : 2059},
      {'id': 61, 'value' : 2060},
      {'id': 62, 'value' : 2061},
      {'id': 63, 'value' : 2062},
      {'id': 64, 'value' : 2063},
      {'id': 65, 'value' : 2064},
      {'id': 66, 'value' : 2065}
    ];
    return years;
  }
}
