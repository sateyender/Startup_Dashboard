export interface Startup {
  Startup_ID: number;
  Country: string;
  Industry: string;
  Funding_Stage: string;
  Total_Funding_MUSD: number;
  Annual_Revenue_MUSD: number;
  Burn_Rate_MUSD: number;
  Revenue_Growth_Percent: number;
  Employee_Count: number;
  Valuation_MUSD: number;
  Is_IPO: number;
  Annual_Profit_MUSD: number;
  Is_Profitable: number;
}

export const startupData: Startup[] = (() => {
  const data: Startup[] = [];
  
  // Helper to generate random values within a range
  const randFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

  // --- INDIA DATA (1672 Total) ---
  // Funding Stages: 433, 392, 425, 422
  const indiaStages = [
    { stage: "Series B", count: 433 },
    { stage: "Series C", count: 392 },
    { stage: "Series A", count: 425 },
    { stage: "Seed", count: 422 }
  ];

  // Sectors (Adjusted to fit 1672 total while keeping relative order from image)
  const indiaSectors = [
    { name: "FinTech", count: 350 },
    { name: "SaaS", count: 300 },
    { name: "AI/ML", count: 280 },
    { name: "E-Commerce", count: 260 },
    { name: "EdTech", count: 250 },
    { name: "HealthCare", count: 232 }
  ];

  let indiaId = 1000;
  let profitableCount = 0;
  const targetProfitable = 520;

  indiaStages.forEach(sInfo => {
    for (let i = 0; i < sInfo.count; i++) {
      // Assign sector based on distribution
      let sector = "Other";
      let runningSum = 0;
      const randomVal = Math.random() * 1672;
      for (const s of indiaSectors) {
        runningSum += s.count;
        if (randomVal <= runningSum) {
          sector = s.name;
          break;
        }
      }

      const isProfitable = (profitableCount < targetProfitable) ? 1 : 0;
      if (isProfitable) profitableCount++;
      
      const profit = isProfitable ? randFloat(1, 50) : randFloat(-50, -1);
      
      data.push({
        Startup_ID: ++indiaId,
        Country: "India",
        Industry: sector,
        Funding_Stage: sInfo.stage,
        Total_Funding_MUSD: randFloat(40, 60), // Total ~84.4K / 1672 ≈ 50.4
        Annual_Revenue_MUSD: randFloat(90, 112), // Avg ~101.2
        Burn_Rate_MUSD: randFloat(5, 30),
        Revenue_Growth_Percent: randFloat(150, 157), // Avg ~153.6
        Employee_Count: randInt(50, 1000),
        Valuation_MUSD: randFloat(100, 1000),
        Is_IPO: 0,
        Annual_Profit_MUSD: profit,
        Is_Profitable: isProfitable
      });
    }
  });

  // --- GLOBAL DATA (3828 Total, 2156 non-India) ---
  // Global Sectors: E-Commerce (683), SaaS (598), FinTech (620), HealthCare (662), EdTech (622), AI/ML (643)
  const globalSectors = [
    { name: "E-Commerce", total: 683 },
    { name: "SaaS", total: 598 },
    { name: "FinTech", total: 620 },
    { name: "HealthCare", total: 662 },
    { name: "EdTech", total: 622 },
    { name: "AI/ML", total: 643 }
  ];

  const countries = ["USA", "China", "UAE", "Germany", "UK", "Japan", "Canada"];
  const stages = ["Seed", "Series A", "Series B", "Series C", "IPO"];

  globalSectors.forEach(sec => {
    const currentIndiaCount = data.filter(d => d.Industry === sec.name && d.Country === "India").length;
    const remaining = sec.total - currentIndiaCount;

    for (let i = 0; i < remaining; i++) {
      const country = countries[randInt(0, countries.length - 1)];
      const isProfitable = Math.random() > 0.5 ? 1 : 0;
      const profit = isProfitable ? randFloat(1, 50) : randFloat(-50, -1);

      data.push({
        Startup_ID: ++indiaId,
        Country: country,
        Industry: sec.name,
        Funding_Stage: stages[randInt(0, stages.length - 1)],
        Total_Funding_MUSD: randFloat(40, 60), // Total ~194B / 3828 ≈ 50.6M
        Annual_Revenue_MUSD: randFloat(90, 117), // Avg ~103.5
        Burn_Rate_MUSD: randFloat(5, 40),
        Revenue_Growth_Percent: randFloat(145, 157), // Avg ~151.1
        Employee_Count: randInt(50, 2000),
        Valuation_MUSD: randFloat(100, 5000),
        Is_IPO: Math.random() > 0.9 ? 1 : 0,
        Annual_Profit_MUSD: profit,
        Is_Profitable: isProfitable
      });
    }
  });

  return data;
})();
