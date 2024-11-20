import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { AnalysisResults, AnalysisFormData } from '../types/analysis';

// Professional color palette
const colors = {
  primary: [41, 98, 255],      // Primary Blue
  secondary: [45, 55, 72],     // Dark Gray
  accent: [49, 151, 149],      // Teal
  text: [33, 33, 33],         // Dark Text
  subtext: [107, 114, 128],   // Gray Text
  lightBlue: [239, 246, 255], // Light Blue Background
  success: [34, 197, 94],     // Green
  danger: [244, 67, 54],      // Red
  white: [255, 255, 255]      // White
};

// Utility functions
const formatCurrency = (value: number): string => {
  if (!value && value !== 0) return '$0.00M';
  const inMillions = value / 1000;
  return `$${inMillions.toFixed(2)}M`;
};

export const generatePDFReport = (
  results: AnalysisResults,
  formData: AnalysisFormData
) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let yPos = margin;

    // Helper functions
    const addHeader = (text: string, size = 24, color = colors.primary) => {
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, pageWidth, 5, 'F');
      
      doc.setFontSize(size);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...color);
      doc.text(text, margin, yPos);
      return doc.getTextDimensions(text).h + 20;
    };

    const addSection = (text: string, yOffset = 20) => {
      yPos += yOffset;
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.text);
      doc.text(text, margin, yPos);
      return doc.getTextDimensions(text).h + 15;
    };

    const addSubsection = (text: string, yOffset = 15) => {
      yPos += yOffset;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'medium');
      doc.setTextColor(...colors.text);
      doc.text(text, margin, yPos);
      return doc.getTextDimensions(text).h + 10;
    };

    // Title
    yPos += addHeader('Analysis Results');
    yPos += 20;

    // Deal KPIs Section
    yPos += addSection('Deal KPIs');
    
    // KPI Grid
    const kpiData = [
      ['Enterprise Value', formatCurrency(results.enterpriseValue), `${results.dealStructure.multiplePaid.toFixed(1)}x LTM EBITDA`],
      ['LTM EBITDA', formatCurrency(results.ltmEbitda), `Last Twelve Months as of ${new Date().toLocaleDateString()}`],
      ['IRR', `${results.returnMetrics.irr.toFixed(1)}%`, ''],
      ['MOIC', `${results.returnMetrics.moic.toFixed(2)}x`, '']
    ];

    doc.autoTable({
      startY: yPos + 10,
      body: kpiData,
      theme: 'plain',
      styles: {
        fontSize: 12,
        cellPadding: 5,
        lineColor: [240, 240, 240]
      },
      columnStyles: {
        0: { font: 'helvetica', textColor: colors.subtext },
        1: { font: 'helvetica', fontStyle: 'bold', textColor: colors.text, fontSize: 14 },
        2: { font: 'helvetica', textColor: colors.subtext, fontSize: 10 }
      }
    });

    yPos = doc.autoTable.previous.finalY + 30;

    // Deal Summary Section
    yPos += addSection('Deal Summary');

    // Investment Thesis
    yPos += addSubsection('Investment Thesis');
    doc.setFillColor(...colors.lightBlue);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 60, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(...colors.text);
    const thesisText = results.returnMetrics.irr >= 25
      ? `Strong Investment Opportunity: With an IRR of ${results.returnMetrics.irr.toFixed(1)}% and MOIC of ${results.returnMetrics.moic.toFixed(2)}x, this investment presents compelling returns above typical market expectations.`
      : results.returnMetrics.irr >= 15
      ? `Moderate Investment Opportunity: Returns are in line with market expectations, with an IRR of ${results.returnMetrics.irr.toFixed(1)}% and MOIC of ${results.returnMetrics.moic.toFixed(2)}x.`
      : `Cautious Outlook: Returns are below typical market expectations. Consider renegotiating terms or identifying additional value creation opportunities.`;
    
    const thesisLines = doc.splitTextToSize(thesisText, pageWidth - (margin * 2.5));
    doc.text(thesisLines, margin + 10, yPos + 20);
    yPos += 80;

    // Risk Assessment
    yPos += addSubsection('Risk Assessment');
    doc.setFillColor(...colors.lightBlue);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 60, 'F');
    
    const riskText = results.riskMetrics.debtServiceCoverage >= 2
      ? `Strong Financial Position: Debt service coverage ratio of ${results.riskMetrics.debtServiceCoverage.toFixed(2)}x indicates healthy cash flow coverage for debt obligations.`
      : results.riskMetrics.debtServiceCoverage >= 1.5
      ? `Adequate Financial Position: Debt service coverage of ${results.riskMetrics.debtServiceCoverage.toFixed(2)}x provides reasonable cushion for debt obligations.`
      : `Financial Risk Alert: Low debt service coverage of ${results.riskMetrics.debtServiceCoverage.toFixed(2)}x suggests potential difficulty meeting debt obligations.`;
    
    const riskLines = doc.splitTextToSize(riskText, pageWidth - (margin * 2.5));
    doc.text(riskLines, margin + 10, yPos + 20);
    yPos += 80;

    // Key Action Items
    yPos += addSubsection('Key Action Items');
    
    const actionItems = [
      `Value Creation: Focus on operational improvements to maintain ${results.cashConversionRate}% cash conversion rate and support exit multiple expansion.`,
      `Capital Structure: ${results.riskMetrics.debtToEbitda > 4 ? 'Consider reducing leverage to improve financial flexibility.' : 'Current leverage level appears sustainable.'}`,
      `Exit Strategy: ${results.dealStructure.exitMultiple > results.dealStructure.multiplePaid * 1.5 ? 'Exit multiple assumptions may be aggressive. Consider sensitivity analysis.' : 'Exit multiple assumptions appear reasonable based on entry valuation.'}`
    ];

    actionItems.forEach((item, index) => {
      doc.setFillColor(...colors.lightBlue);
      doc.rect(margin, yPos, (pageWidth - (margin * 2)) / actionItems.length - 10, 80, 'F');
      const itemLines = doc.splitTextToSize(item, ((pageWidth - (margin * 2)) / actionItems.length) - 20);
      doc.text(itemLines, margin + 10, yPos + 20);
      yPos += 100;
    });

    // Add new page for Return Calculation Breakdown
    doc.addPage();
    yPos = margin;
    yPos += addHeader('Return Calculation Breakdown', 18);
    yPos += 20;

    // Cash Flow and Returns Summary Table
    yPos += addSubsection('Cash Flow and Returns Summary');

    const cashFlowData = [
      ['Initial Investment', '-', '-', '-', `-${formatCurrency(results.enterpriseValue)}`],
      ...results.cashFlowGeneration.map((cf, index) => {
        const ebitda = results.projectedEbitda[index];
        const operatingCashFlow = ebitda * (results.cashConversionRate / 100);
        const debtService = results.debtService.yearlyPayments[index] || 0;
        return [
          `Year ${index + 1}`,
          formatCurrency(ebitda),
          formatCurrency(operatingCashFlow),
          formatCurrency(debtService),
          formatCurrency(cf)
        ];
      }),
      [
        'Exit Value',
        formatCurrency(results.projectedEbitda[results.projectedEbitda.length - 1]),
        `@ ${results.dealStructure.exitMultiple.toFixed(1)}x Multiple`,
        '-',
        formatCurrency(results.projectedEbitda[results.projectedEbitda.length - 1] * results.dealStructure.exitMultiple)
      ]
    ];

    doc.autoTable({
      startY: yPos + 10,
      head: [['Period', 'EBITDA', 'Operating Cash Flow', 'Debt Service', 'Net Cash Flow']],
      body: cashFlowData,
      foot: [[
        'Total Returns',
        '-',
        `MOIC: ${results.returnMetrics.moic.toFixed(2)}x`,
        '',
        `IRR: ${results.returnMetrics.irr.toFixed(1)}%`
      ]],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 6,
      },
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.white,
        fontStyle: 'bold',
      },
      footStyles: {
        fillColor: [245, 245, 245],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: {
        4: {
          cellCallback: function(cell, data) {
            const value = parseFloat(cell.text.replace(/[^-\d.]/g, '') || '0');
            if (value < 0) {
              cell.styles.textColor = colors.danger;
            } else if (value > 0) {
              cell.styles.textColor = colors.success;
            }
          }
        }
      }
    });

    yPos = doc.autoTable.previous.finalY + 30;

    // NPV Analysis
    yPos += addSubsection('NPV Analysis');

    const npvData = results.cashFlowGeneration.map((cf, index) => {
      const discountFactor = Math.pow(1 + results.dealStructure.discountRate / 100, index + 1);
      const presentValue = cf / discountFactor;
      return [
        `Year ${index + 1}`,
        formatCurrency(cf),
        `${discountFactor.toFixed(3)}x`,
        formatCurrency(presentValue)
      ];
    });

    const exitValue = results.projectedEbitda[results.projectedEbitda.length - 1] * results.dealStructure.exitMultiple;
    const exitDiscountFactor = Math.pow(1 + results.dealStructure.discountRate / 100, results.projectedEbitda.length);
    const exitPV = exitValue / exitDiscountFactor;

    npvData.push([
      'Exit Value',
      formatCurrency(exitValue),
      `${exitDiscountFactor.toFixed(3)}x`,
      formatCurrency(exitPV)
    ]);

    doc.autoTable({
      startY: yPos + 10,
      head: [['Period', 'Cash Flow', 'Discount Factor', 'Present Value']],
      body: npvData,
      foot: [[
        'NPV Summary',
        `Discount Rate: ${results.dealStructure.discountRate.toFixed(1)}%`,
        `Initial: -${formatCurrency(results.enterpriseValue)}`,
        `NPV: ${formatCurrency(results.npv)}`
      ]],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 6,
      },
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.white,
        fontStyle: 'bold',
      },
      footStyles: {
        fillColor: [245, 245, 245],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      }
    });

    // Add Sensitivity Analysis on new page if available
    if (results.sensitivityAnalysis) {
      doc.addPage();
      yPos = margin;
      yPos += addHeader('Sensitivity Analysis', 18);
      yPos += 20;

      // Add Key Metrics
      yPos += addSubsection('Key Metrics');
      const metrics = [
        `Base Valuation: ${formatCurrency(results.valuation)}`,
        `Exit Multiple: ${results.dealStructure.exitMultiple.toFixed(1)}x`,
        `Base EBITDA: ${formatCurrency(results.firstYearEbitda)}`,
        `Base IRR: ${results.returnMetrics.irr.toFixed(1)}%`
      ];

      metrics.forEach((metric, index) => {
        doc.setFontSize(11);
        doc.setTextColor(...colors.text);
        doc.text(`• ${metric}`, margin + 10, yPos + (index + 1) * 20);
      });

      yPos += metrics.length * 20 + 30;

      // Add Analysis Summary
      yPos += addSubsection('Analysis Summary');
      const summaryText = 'This sensitivity analysis shows how changes in the EBITDA multiple and EBITDA value affect the overall valuation. The analysis helps identify the most impactful factors on valuation.';
      const summaryLines = doc.splitTextToSize(summaryText, pageWidth - (margin * 2));
      doc.setFontSize(11);
      doc.setTextColor(...colors.text);
      doc.text(summaryLines, margin, yPos + 20);
    }

    // Save the PDF
    const filename = `${formData.companyOverview.projectName.replace(/\s+/g, '_')}_Analysis_Results.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
