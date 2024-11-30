import type { AnalysisResults, AnalysisFormData } from '../types/analysis';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
};

const createPDFDocument = async (formData: AnalysisFormData, results: AnalysisResults): Promise<any> => {
  // Import modules
  const jsPDFModule = await import('jspdf');
  await import('jspdf-autotable');
  
  // Create new document
  const doc = new jsPDFModule.default();
  
  // Set initial position
  let y = 20;
  
  // Add title
  doc.setFontSize(20);
  doc.text('M&A Analysis Report', 105, y, { align: 'center' });
  y += 10;
  
  // Add project name
  doc.setFontSize(16);
  doc.text(formData.companyOverview.projectName, 105, y, { align: 'center' });
  y += 20;

  // Company Overview
  doc.setFontSize(14);
  doc.text('Company Overview', 20, y);
  y += 10;
  
  doc.setFontSize(12);
  doc.text(`Project Name: ${formData.companyOverview.projectName}`, 20, y);
  y += 7;
  doc.text(`Industry: ${formData.companyOverview.industry}`, 20, y);
  y += 7;
  doc.text(`Location: ${formData.companyOverview.location}`, 20, y);
  y += 15;

  // Financial Details
  doc.setFontSize(14);
  doc.text('Financial Details', 20, y);
  y += 10;

  const tableData = [
    ['Enterprise Value', formatCurrency(results.enterpriseValue)],
    ['LTM EBITDA', formatCurrency(results.ltmEbitda)],
    ['First Year EBITDA', formatCurrency(results.firstYearEbitda)],
    ['Multiple Paid', `${results.dealStructure.multiplePaid.toFixed(2)}x`],
    ['Exit Multiple', `${results.dealStructure.exitMultiple.toFixed(2)}x`],
    ['IRR', formatPercent(results.returnMetrics.irr)],
    ['MOIC', `${results.returnMetrics.moic.toFixed(2)}x`],
    ['NPV', formatCurrency(results.npv)]
  ];

  try {
    (doc as any).autoTable({
      startY: y,
      head: [['Metric', 'Value']],
      body: tableData,
      theme: 'plain',
      headStyles: { fillColor: [200, 200, 200] },
      margin: { left: 20 }
    });
  } catch (tableError) {
    console.error('Error creating table:', tableError);
    throw new Error('Failed to create table in PDF');
  }

  return doc;
};

export const generatePDFReport = async (formData: AnalysisFormData, results: AnalysisResults): Promise<void> => {
  try {
    const doc = await createPDFDocument(formData, results);
    const filename = `${formData.companyOverview.projectName.replace(/\s+/g, '_')}_Analysis.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw new Error('Failed to generate PDF. Please check console for details.');
  }
};

export const printPDFReport = async (formData: AnalysisFormData, results: AnalysisResults): Promise<void> => {
  try {
    const doc = await createPDFDocument(formData, results);
    doc.autoPrint();
    doc.output('dataurlnewwindow');
  } catch (error) {
    console.error('Error printing PDF:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw new Error('Failed to print PDF. Please check console for details.');
  }
};