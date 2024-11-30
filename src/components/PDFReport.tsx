import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AnalysisResults, AnalysisFormData } from '../types/analysis';

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: any) => any;
}

// Enhanced professional color palette with refined opacity variants
const colors = {
  primary: {
    dark: [0, 51, 153] as [number, number, number],      // Darker Blue for contrast
    main: [0, 71, 187] as [number, number, number],      // Deep Blue
    light: [0, 71, 187, 0.1] as [number, number, number, number], // Light Blue background
    lighter: [0, 71, 187, 0.05] as [number, number, number, number] // Very Light Blue
  },
  accent: {
    main: [38, 166, 154] as [number, number, number],     // Teal
    light: [38, 166, 154, 0.1] as [number, number, number, number]
  },
  text: {
    primary: [33, 33, 33] as [number, number, number],    // Dark Gray
    secondary: [117, 117, 117] as [number, number, number], // Medium Gray
    light: [255, 255, 255] as [number, number, number]    // White text
  },
  background: {
    paper: [255, 255, 255] as [number, number, number],   // Pure White
    light: [248, 249, 250] as [number, number, number],   // Very Light Gray
    highlight: [0, 71, 187, 0.04] as [number, number, number, number] // Subtle highlight
  }
};

// Document constants for consistent spacing
const spacing = {
  margin: 50,
  headerHeight: 12,
  sectionPadding: 25,
  paragraphSpacing: 18,
  lineHeight: 1.5
};

// Enhanced formatting utilities
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
    const thousands = value / 1000;
    return thousands < 1 ? formatCurrency(value) : `$${thousands.toFixed(1)}K`;
  }
  return `$${millions.toFixed(1)}M`;
};

const formatPercent = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  const percentage = value < 1 ? value * 100 : value;
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(percentage / 100);
};

export const generatePDFReport = async (formData: AnalysisFormData, results: AnalysisResults): Promise<void> => {
  try {
    // Initialize jsPDF with proper settings
    const doc = new jsPDF('p', 'pt', 'a4') as jsPDFWithPlugin;
    
    if (!doc.autoTable) {
      throw new Error('autoTable plugin not initialized properly');
    }

    console.log('Starting PDF generation...'); // Debug log

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - (spacing.margin * 2);
    let yPos = spacing.margin;

    // Enhanced helper functions with better typography and spacing
    const addPageHeader = (text: string, pageNumber: number) => {
      // Thick header bar
      doc.setFillColor(...colors.primary.main);
      doc.rect(0, 0, pageWidth, spacing.headerHeight, 'F');
      
      // Main header text with increased size
      doc.setTextColor(...colors.primary.dark);
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold', 'normal');
      doc.text(text, spacing.margin, spacing.margin + 15);
      
      // Subtle divider with gradient effect
      doc.setDrawColor(...colors.primary.main);
      doc.setLineWidth(0.75);
      doc.line(spacing.margin, spacing.margin + 25, pageWidth - spacing.margin, spacing.margin + 25);
      
      // Professional page numbering
      doc.setFontSize(10);
      doc.setTextColor(...colors.text.secondary);
      doc.text(`Page ${pageNumber}`, pageWidth - spacing.margin - 20, pageHeight - 25, { align: 'right' });
      
      return spacing.margin + 45;
    };

    const addSection = (title: string, yPosition: number) => {
      // Section background with subtle gradient
      doc.setFillColor(...colors.primary.lighter);
      doc.rect(spacing.margin - 15, yPosition - 15, contentWidth + 30, 40, 'F');
      
      // Section title with enhanced typography
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold', 'normal');
      doc.setTextColor(...colors.primary.dark);
      doc.text(title, spacing.margin, yPosition + 5);
      
      return yPosition + spacing.sectionPadding;
    };

    const addSubsection = (title: string, yPosition: number) => {
      // Subsection background
      doc.setFillColor(...colors.background.highlight);
      doc.rect(spacing.margin, yPosition - 12, contentWidth, 30, 'F');
      
      // Subsection title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold', 'normal');
      doc.setTextColor(...colors.primary.main);
      doc.text(title, spacing.margin + 15, yPosition + 5);
      
      return yPosition + spacing.sectionPadding - 5;
    };

    const addParagraph = (text: string, yPosition: number) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal', 'normal');
      doc.setTextColor(...colors.text.primary);
      
      const lines = doc.splitTextToSize(text, contentWidth - 40);
      doc.text(lines, spacing.margin + 20, yPosition);
      
      return yPosition + (lines.length * spacing.paragraphSpacing);
    };

    const addBulletPoint = (text: string, yPosition: number, highlighted: boolean = false) => {
      // Optional highlight for important points
      if (highlighted) {
        doc.setFillColor(...colors.primary.lighter);
        doc.rect(spacing.margin + 10, yPosition - 10, contentWidth - 20, 25, 'F');
      }
      
      // Enhanced bullet point design
      doc.setFillColor(...colors.primary.main);
      doc.circle(spacing.margin + 25, yPosition + 2, 2, 'F');
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal', 'normal');
      doc.setTextColor(...colors.text.primary);
      
      const lines = doc.splitTextToSize(text, contentWidth - 60);
      doc.text(lines, spacing.margin + 40, yPosition + 5);
      
      return yPosition + (lines.length * spacing.paragraphSpacing);
    };

    // Enhanced table styling
    const tableStyles = {
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 8,
        lineWidth: 0.1,
        lineColor: [220, 220, 220],
        textColor: colors.text.primary
      },
      headStyles: {
        fillColor: colors.primary.main,
        textColor: colors.text.light,
        fontStyle: 'bold',
        lineWidth: 0,
        fontSize: 11
      },
      alternateRowStyles: {
        fillColor: colors.background.light
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      },
      margin: { top: 15, bottom: 15 }
    };

    // Add custom fonts with proper style arguments
    doc.addFont('helvetica', 'normal', 'normal');
    doc.addFont('helvetica', 'bold', 'bold');

    // Cover Page
    doc.setFillColor(...colors.primary.main);
    doc.rect(0, 0, pageWidth, 200, 'F');
    
    // Company logo placeholder
    doc.setFillColor(...colors.background.paper);
    doc.circle(pageWidth / 2, 80, 40, 'F');
    
    // Title
    doc.setTextColor(...colors.background.paper);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold', 'normal');
    doc.text("M&A Investment Analysis", spacing.margin, 180, { align: 'left' });
    
    // Project name
    doc.setFontSize(28);
    doc.text(formData.companyOverview.projectName, spacing.margin, 220, { align: 'left' });
    
    // Date and confidentiality
    doc.setFontSize(14);
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(currentDate, spacing.margin, 260);
    doc.text('CONFIDENTIAL', pageWidth - spacing.margin - 100, 260);

    // Executive Summary
    doc.addPage();
    yPos = addPageHeader("Executive Summary", 1);

    yPos = addSection("Deal Overview", yPos);
    yPos = addParagraph(
      `${formData.companyOverview.projectName} presents a compelling acquisition opportunity in the ${formData.companyOverview.industry} sector. ` +
      `Founded in ${formData.companyOverview.yearFounded} and headquartered in ${formData.companyOverview.location}, ` +
      `the company has demonstrated strong market presence and growth potential.`,
      yPos
    );

    yPos = addSection("Key Financial Metrics", yPos);
    yPos = addBulletPoint(`Enterprise Value: ${formatMillions(results.valuation)}`, yPos, true);
    yPos = addBulletPoint(`EBITDA: ${formatMillions(results.firstYearEbitda)}`, yPos);
    yPos = addBulletPoint(`IRR: ${formatPercent(results.returnMetrics.irr)}`, yPos);
    yPos = addBulletPoint(`MOIC: ${results.returnMetrics.moic.toFixed(2)}x`, yPos);

    // Financial Analysis
    doc.addPage();
    yPos = addPageHeader("Financial Analysis", 2);

    yPos = addSection("Historical Performance", yPos);
    const tableHead = [['Year', 'Revenue', 'EBITDA', 'Margin']];
    const tableBody = formData.historicalData.map(data => [
      data.year.toString(),
      formatMillions(data.metrics.grossRevenue),
      formatMillions(data.metrics.ebitda),
      formatPercent(data.metrics.ebitda / data.metrics.grossRevenue)
    ]);

    doc.autoTable({
      startY: yPos + 10,
      head: tableHead,
      body: tableBody,
      ...tableStyles
    });

    yPos = doc.autoTable.previous.finalY + 20;

    // Deal Structure
    yPos = addSection("Deal Structure", yPos);
    yPos = addSubsection("Financing", yPos);
    yPos = addBulletPoint(`Equity: ${formatPercent(results.dealStructure.equityComponent)}`, yPos);
    yPos = addBulletPoint(`Debt: ${formatPercent(results.dealStructure.debtComponent)}`, yPos);
    yPos = addBulletPoint(`Interest Rate: ${formatPercent(formData.financingDetails.interestRate)}`, yPos);

    // Save the PDF with a professional filename
    const getFormattedDate = () => {
      const date = new Date();
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    };

    console.log('Saving PDF...'); // Debug log
    const filename = `${formData.companyOverview.projectName.replace(/\s+/g, '_')}_MA_Analysis_${getFormattedDate()}.pdf`;
    doc.save(filename);
    console.log('PDF saved successfully!'); // Debug log

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error; // Re-throw to be handled by the component
  }
};