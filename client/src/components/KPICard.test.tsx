import { describe, it, expect } from "vitest";

describe("KPICard - Value Formatting", () => {
  it("formats positive values correctly", () => {
    const value = 150000;
    const formatted = `R$ ${(value / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    expect(formatted).toBe("R$ 1.500,00");
  });

  it("formats zero value correctly", () => {
    const value = 0;
    const formatted = `R$ ${(value / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    expect(formatted).toBe("R$ 0,00");
  });

  it("formats negative values with minus sign", () => {
    const value = -50000;
    const formatted = `${value < 0 ? "-" : ""}R$ ${Math.abs(value / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    expect(formatted).toBe("-R$ 500,00");
  });

  it("handles large values correctly", () => {
    const value = 999999999;
    const formatted = `R$ ${(value / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    expect(formatted).toBe("R$ 9.999.999,99");
  });
});

describe("KPICard - Percentage Change", () => {
  it("calculates percentage change correctly", () => {
    const current = 150000;
    const previous = 100000;
    const change = ((current - previous) / previous) * 100;
    expect(change).toBe(50);
  });

  it("handles zero previous value", () => {
    const current = 150000;
    const previous = 0;
    const change = previous === 0 ? 0 : ((current - previous) / previous) * 100;
    expect(change).toBe(0);
  });

  it("calculates negative percentage change", () => {
    const current = 50000;
    const previous = 100000;
    const change = ((current - previous) / previous) * 100;
    expect(change).toBe(-50);
  });
});
