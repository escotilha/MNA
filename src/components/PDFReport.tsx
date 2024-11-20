import { AnalysisResults, AnalysisFormData } from '../types/analysis';

export const generatePDFReport = (
  results: AnalysisResults,
  formData: AnalysisFormData
) => {
  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window');
    }

    // Get all stylesheets from the current document
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          if (!styleSheet.href) {
            // For inline styles
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          }
          // For external stylesheets
          return `@import url("${styleSheet.href}");`;
        } catch (e) {
          console.warn('Error processing stylesheet:', e);
          return '';
        }
      })
      .filter(Boolean)
      .join('\n');

    // Clone the Analysis Results content
    const content = document.querySelector('.space-y-6')?.cloneNode(true) as HTMLElement;
    if (!content) {
      throw new Error('Could not find Analysis Results content');
    }

    // Remove the Export PDF button from the cloned content
    const exportButton = content.querySelector('button');
    if (exportButton) {
      exportButton.parentElement?.removeChild(exportButton);
    }

    // Write the HTML content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${formData.companyOverview.projectName} - Analysis Results</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            ${styles}
            
            @media print {
              body {
                padding: 20px;
                background: white !important;
                color: black !important;
              }
              
              .no-print {
                display: none !important;
              }
              
              .print-break-after {
                page-break-after: always;
              }
              
              /* Force background colors and text colors to be visible */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* Ensure backgrounds are printed */
              .bg-white\\/90,
              .backdrop-blur-glass,
              .shadow-glass {
                background: white !important;
                box-shadow: none !important;
                border: 1px solid #eee !important;
              }
              
              /* Override text colors for better visibility */
              .text-white {
                color: #000 !important;
              }
              
              h2.text-white {
                color: #000 !important;
                font-size: 24px !important;
                margin-bottom: 1rem !important;
              }
              
              /* Ensure proper spacing */
              .space-y-6 > * + * {
                margin-top: 1.5rem !important;
              }
              
              /* Table styles */
              table {
                break-inside: avoid;
                width: 100%;
                margin-bottom: 1rem;
              }
              
              /* Chart styles */
              .recharts-wrapper {
                page-break-inside: avoid;
                margin-bottom: 1rem;
              }
              
              /* Card styles */
              .rounded-xl {
                border-radius: 0.75rem !important;
                border: 1px solid #e5e7eb !important;
                padding: 1.5rem !important;
                margin-bottom: 1.5rem !important;
              }
              
              /* Text styles */
              .text-gray-600 {
                color: #4b5563 !important;
              }
              
              .text-gray-900 {
                color: #111827 !important;
              }
              
              .text-blue-800 {
                color: #1e40af !important;
              }
              
              .bg-blue-50 {
                background-color: #eff6ff !important;
              }
            }
          </style>
        </head>
        <body class="bg-white">
          ${content.outerHTML}
          <script>
            window.onload = () => {
              // Wait for Tailwind to initialize
              setTimeout(() => {
                window.print();
                setTimeout(() => window.close(), 500);
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
