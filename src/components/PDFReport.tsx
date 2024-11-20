import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { AnalysisResults, AnalysisFormData } from '../types/analysis';

// Professional color palette
const colors = {
  primary: [0, 71, 187],      // Deep Blue
  secondary: [2, 136, 209],   // Light Blue
  accent: [38, 166, 154],     // Teal
  warning: [255, 152, 0],     // Orange
  danger: [244, 67, 54],      // Red
  success: [76, 175, 80],     // Green
  text: [33, 33, 33],         // Dark Gray
  subtext: [117, 117, 117],   // Medium Gray
  light: [245, 245, 245],     // Light Gray
  white: [255, 255, 255],     // White
};

// Utility functions
const formatCurrency = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatMillions = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) return '$0M';
  const millions = value / 1000000;
  if (millions < 1) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${millions.toFixed(1)}M`;
};

const formatPercent = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  // Convert decimal to percentage (e.g., 0.15 to 15%)
  const percentage = value < 1 ? value * 100 : value;
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(percentage / 100);
};

export const generatePDFReport = (
  results: AnalysisResults,
  formData: AnalysisFormData
) => {
  try {
    // Initialize PDF with professional settings
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 50;
    let yPos = margin;

    // Helper functions
    const addPageHeader = (text: string) => {
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, pageWidth, 5, 'F');
      doc.setTextColor(...colors.primary);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(text, margin, margin);
      doc.setDrawColor(...colors.primary);
      doc.line(margin, margin + 10, pageWidth - margin, margin + 10);
      return margin + 40;
    };

    const addSection = (title: string, yPosition: number) => {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text(title, margin, yPosition);
      return yPosition + 25;
    };

    const addSubsection = (title: string, yPosition: number) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.text);
      doc.text(title, margin + 15, yPosition);
      return yPosition + 20;
    };

    const addParagraph = (text: string, yPosition: number) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.text);
      const maxWidth = pageWidth - (margin * 2);
      const lines = doc.splitTextToSize(text, maxWidth - 30);
      doc.text(lines, margin + 30, yPosition);
      return yPosition + (lines.length * 15);
    };

    const addBulletPoint = (text: string, yPosition: number) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.text);
      doc.text('•', margin + 30, yPosition);
      const maxWidth = pageWidth - (margin * 2) - 45;
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin + 45, yPosition);
      return yPosition + (lines.length * 15);
    };

    // Cover Page
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 150, 'F');
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text("M&A Investment Analysis", margin, 80);
    
    doc.setFontSize(24);
    doc.text(formData.companyOverview.projectName, margin, 120);
    
    doc.setFontSize(14);
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(currentDate, margin, 180);

    // 1. Executive Summary
    doc.addPage();
    yPos = addPageHeader("1. Executive Summary");

    yPos = addSubsection("Deal Rationale and Strategic Fit", yPos);
    yPos = addParagraph(
      `${formData.companyOverview.projectName} presents a compelling acquisition opportunity with strong market positioning and growth potential. ` +
      `Founded in ${formData.companyOverview.yearFounded} and headquartered in ${formData.companyOverview.location}, the company has demonstrated consistent growth and operational excellence.`,
      yPos
    );

    yPos = addSubsection("Key Findings and Recommendations", yPos + 15);
    yPos = addBulletPoint(`Enterprise Value: ${formatMillions(results.valuation)}`, yPos);
    yPos = addBulletPoint(`Strong financial performance with EBITDA of ${formatMillions(results.firstYearEbitda)}`, yPos);
    yPos = addBulletPoint(`Attractive returns with IRR of ${formatPercent(results.returnMetrics.irr)} and MOIC of ${results.returnMetrics.moic.toFixed(2)}x`, yPos);
    yPos = addBulletPoint(
      results.returnMetrics.paybackPeriod.isAchieved
        ? `Payback period of ${results.returnMetrics.paybackPeriod.years.toFixed(1)} years`
        : `Payback period extends beyond projection period (>${results.returnMetrics.paybackPeriod.years.toFixed(1)} years)`,
      yPos
    );

    yPos = addSubsection("Critical Risks and Mitigation Strategies", yPos + 15);
    yPos = addBulletPoint(`Financial Risk: Debt service coverage ratio of ${results.riskMetrics.debtServiceCoverage.toFixed(2)}x with mitigation through structured payment schedule`, yPos);
    yPos = addBulletPoint(`Operational Risk: Interest coverage ratio of ${results.riskMetrics.interestCoverage.toFixed(2)}x supported by strong cash flow generation`, yPos);
    yPos = addBulletPoint(`Market Risk: Diversified customer base with ${formatPercent(formData.kpis.recurringRevenue)} recurring revenue`, yPos);

    yPos = addSubsection("Timeline and Next Steps", yPos + 15);
    formData.dealStructure.acquisitionSchedule.forEach((milestone, index) => {
      yPos = addBulletPoint(`${milestone.date}: ${milestone.milestone} (${formatMillions(milestone.amount)})`, yPos);
    });

    // 2. Strategic Rationale
    doc.addPage();
    yPos = addPageHeader("2. Strategic Rationale");

    yPos = addSubsection("Market Context and Industry Trends", yPos);
    yPos = addParagraph(
      `The company operates in a dynamic market environment with strong growth potential. Key market indicators suggest continued expansion opportunities.`,
      yPos
    );

    yPos = addSubsection("Strategic Objectives Alignment", yPos + 15);
    yPos = addBulletPoint(`Strong market position with ${formData.kpis.employeeCount} employees`, yPos);
    yPos = addBulletPoint(`High customer retention with churn rate of only ${formatPercent(formData.kpis.churnRate)}`, yPos);
    yPos = addBulletPoint(`Efficient operations with ${formatPercent(formData.kpis.cashConversionRate)} cash conversion rate`, yPos);

    yPos = addSubsection("Growth Opportunities", yPos + 15);
    yPos = addParagraph(
      `Historical growth analysis shows consistent expansion with projected EBITDA growth:`,
      yPos
    );
    
    const growthData = results.projectedEbitda.map((ebitda, index) => [
      `Year ${index + 1}`,
      formatMillions(ebitda),
      formatPercent((ebitda - (index > 0 ? results.projectedEbitda[index-1] : results.firstYearEbitda)) / 
        (index > 0 ? results.projectedEbitda[index-1] : results.firstYearEbitda))
    ]);

    doc.autoTable({
      startY: yPos + 10,
      head: [['Period', 'EBITDA', 'Growth']],
      body: growthData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.white,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: colors.light,
      }
    });

    // 3. Financial Analysis
    doc.addPage();
    yPos = addPageHeader("3. Financial Analysis");

    yPos = addSubsection("Historical Financial Performance", yPos);
    const historicalData = formData.historicalData.map(data => [
      data.year.toString(),
      formatMillions(data.metrics.grossRevenue),
      formatMillions(data.metrics.ebitda),
      formatPercent(data.metrics.ebitda / data.metrics.grossRevenue)
    ]);

    doc.autoTable({
      startY: yPos + 10,
      head: [['Year', 'Revenue', 'EBITDA', 'Margin']],
      body: historicalData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.white,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: colors.light,
      }
    });

    yPos = doc.autoTable.previous.finalY + 30;

    yPos = addSubsection("Working Capital Analysis", yPos);
    yPos = addParagraph(
      `Working capital efficiency is demonstrated by the strong cash conversion cycle and robust cash flow generation:`,
      yPos
    );

    const cashFlowData = results.cashFlowGeneration.map((cf, index) => [
      `Year ${index + 1}`,
      formatMillions(cf),
      formatMillions(results.debtService[index] || 0),
      formatPercent(cf / results.valuation)
    ]);

    doc.autoTable({
      startY: yPos + 10,
      head: [['Period', 'Free Cash Flow', 'Debt Service', 'FCF Yield']],
      body: cashFlowData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.white,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: colors.light,
      }
    });

    // 4. Deal Structure and Valuation
    doc.addPage();
    yPos = addPageHeader("4. Deal Structure and Valuation");

    yPos = addSubsection("Transaction Structure", yPos);
    yPos = addBulletPoint(`Total Enterprise Value: ${formatMillions(results.valuation)}`, yPos);
    yPos = addBulletPoint(`Equity Component: ${formatPercent(results.dealStructure.equityComponent)} (${formatMillions(results.valuation * results.dealStructure.equityComponent)})`, yPos);
    yPos = addBulletPoint(`Debt Component: ${formatPercent(results.dealStructure.debtComponent)} (${formatMillions(results.valuation * results.dealStructure.debtComponent)})`, yPos);

    yPos = addSubsection("Financing Details", yPos + 15);
    yPos = addBulletPoint(`Cash Component: ${formatPercent(formData.financingDetails.cashComponent)}`, yPos);
    yPos = addBulletPoint(`Stock Component: ${formatPercent(formData.financingDetails.stockComponent)}`, yPos);
    yPos = addBulletPoint(`Interest Rate: ${formatPercent(formData.financingDetails.interestRate)}`, yPos);
    yPos = addBulletPoint(`Term: ${formData.financingDetails.termYears} years`, yPos);

    yPos = addSubsection("Valuation Methodology", yPos + 15);
    yPos = addParagraph(
      `The valuation analysis incorporates multiple approaches including comparable company analysis, ` +
      `precedent transactions, and DCF analysis. Key valuation metrics include:`,
      yPos
    );
    yPos = addBulletPoint(`Entry Multiple: ${formData.dealStructure.multiplePaid.toFixed(2)}x EBITDA`, yPos);
    yPos = addBulletPoint(`Exit Multiple: ${results.dealStructure.exitMultiple.toFixed(2)}x EBITDA`, yPos);
    yPos = addBulletPoint(`Implied IRR: ${formatPercent(results.returnMetrics.irr)}`, yPos);

    // Save the PDF
    const filename = `${formData.companyOverview.projectName.replace(/\s+/g, '_')}_MA_Analysis.pdf`;
    doc.save(filename);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};
