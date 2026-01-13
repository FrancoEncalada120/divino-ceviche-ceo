import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FixedCosts, ProfitRampRow, ProfitResults, SalesData, VariableCosts } from '../../core/models/calculator.models';


@Component({
  selector: 'app-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
  profitRampBE: ProfitRampRow[] = [];
  profitRampCurrent: ProfitRampRow[] = [];

  levels = [0.8, 0.9, 1.0, 1.1, 1.2, 1.5];

  fixedCosts: FixedCosts = {
    rent: 0,
    insurance: 0,
    propertyTax: 0,
    phoneInternet: 0,
    marketing: 0,
    licenses: 0,
    utilities: 0,
    salaries: 0,
    otherFixed: 0
  };

  variableCosts: VariableCosts = {
    foodPct: 0,
    laborPct: 0,
    otherPct: 0
  };

  sales: SalesData = {
    totalSales: 0,
    avgTicket: 0,
    days: 30
  };

  results: ProfitResults = {
    breakEvenSales: 0,
    dailyBreakEven: 0,
    ticketsPerDay: 0,
    profit: 0,
    profitMargin: 0
  };

  calculate(): void {

    const totalFixed =
      this.fixedCosts.rent +
      this.fixedCosts.insurance +
      this.fixedCosts.propertyTax +
      this.fixedCosts.phoneInternet +
      this.fixedCosts.marketing +
      this.fixedCosts.licenses +
      this.fixedCosts.utilities +
      this.fixedCosts.salaries +
      this.fixedCosts.otherFixed;

    const variablePct =
      Number(this.variableCosts.foodPct) +
      Number(this.variableCosts.laborPct) +
      Number(this.variableCosts.otherPct);

    const variableRate = variablePct / 100;

    console.log('variablePct', variablePct);

    // BREAK EVEN
    this.results.breakEvenSales =
      variableRate < 1
        ? totalFixed / (1 - variableRate)
        : 0;

    // DAILY BREAK EVEN
    this.results.dailyBreakEven =
      this.sales.days > 0
        ? this.results.breakEvenSales / this.sales.days
        : 0;

    // TICKETS PER DAY
    this.results.ticketsPerDay =
      this.sales.avgTicket > 0
        ? this.results.dailyBreakEven / this.sales.avgTicket
        : 0;

    // PROFIT
    const variableCostsValue =
      this.sales.totalSales * variableRate;

    this.results.profit =
      this.sales.totalSales -
      totalFixed -
      variableCostsValue;

    // PROFIT MARGIN
    this.results.profitMargin =
      this.sales.totalSales > 0
        ? (this.results.profit / this.sales.totalSales) * 100
        : 0;


    // PROFIT RAMP vs BREAK EVEN
    this.profitRampBE = this.generateProfitRamp(
      this.results.breakEvenSales,
      totalFixed,
      variableRate,
      'BE'
    );

    // PROFIT RAMP vs CURRENT SALES
    this.profitRampCurrent = this.generateProfitRamp(
      this.sales.totalSales,
      totalFixed,
      variableRate,
      'Current'
    );

  }

  private generateProfitRamp(
    baseSales: number,
    fixedCosts: number,
    variableRate: number,
    labelSuffix: string
  ): ProfitRampRow[] {

    return this.levels.map(level => {
      const sales = baseSales * level;

      const profit =
        sales -
        fixedCosts -
        (sales * variableRate);

      const profitPct =
        sales !== 0
          ? (profit / sales) * 100
          : 0;

      return {
        label: `${Math.round(level * 100)}% of ${labelSuffix}`,
        sales,
        profit,
        profitPct
      };
    });
  }
}
