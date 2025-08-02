import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export const generateTxtFile = (content: string, fileName: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${fileName}.txt`);
};

export const generatePdfFile = (content: string, fileName: string) => {
  const pdf = new jsPDF();
  
  // Set font to support more characters and symbols
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  
  // Convert content to handle UTF-8 properly
  const processedContent = content
    .replace(/[""]/g, '"')  // Smart quotes to regular quotes
    .replace(/['']/g, "'")  // Smart apostrophes to regular apostrophes
    .replace(/[–—]/g, '-')  // Em/en dashes to regular dash
    .replace(/…/g, '...')   // Ellipsis to three dots
    .replace(/[^\x00-\x7F]/g, (char) => {
      // Handle common symbols that might not render properly
      const symbolMap: { [key: string]: string } = {
        '•': '* ',
        '★': '*',
        '♦': '^',
        '→': '->',
        '←': '<-',
        '↑': '^',
        '↓': 'v',
        '©': '(c)',
        '®': '(R)',
        '™': '(TM)',
        '°': ' deg',
        '±': '+/-',
        '≤': '<=',
        '≥': '>=',
        '≠': '!=',
        '∞': 'infinity'
      };
      return symbolMap[char] || char;
    });
  
  // Split content into lines and add to PDF
  const lines = processedContent.split('\n');
  const pageHeight = pdf.internal.pageSize.height;
  const lineHeight = 7;
  const margin = 20;
  let yPosition = margin;
  
  lines.forEach((line) => {
    // Handle line wrapping for long lines
    const wrappedLines = pdf.splitTextToSize(line || ' ', pdf.internal.pageSize.width - 2 * margin);
    
    wrappedLines.forEach((wrappedLine: string) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      // Use try-catch to handle any remaining problematic characters
      try {
        pdf.text(wrappedLine, margin, yPosition);
      } catch (error) {
        // Fallback: replace any remaining problematic characters
        const cleanLine = wrappedLine.replace(/[^\x00-\x7F]/g, '?');
        pdf.text(cleanLine, margin, yPosition);
      }
      yPosition += lineHeight;
    });
  });
  
  // Save the PDF
  pdf.save(`${fileName}.pdf`);
};

export const generateDocxFile = async (content: string, fileName: string) => {
  // Split content into paragraphs
  const paragraphs = content.split('\n').map(line => 
    new Paragraph({
      children: [
        new TextRun({
          text: line || ' ', // Handle empty lines
          size: 24, // 12pt font (size is in half-points)
        }),
      ],
    })
  );

  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs,
    }],
  });

  // Generate and save the document
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fileName}.docx`);
};

export const generateFile = async (content: string, fileName: string, format: string) => {
  try {
    switch (format) {
      case 'txt':
        generateTxtFile(content, fileName);
        break;
      case 'pdf':
        generatePdfFile(content, fileName);
        break;
      case 'docx':
        await generateDocxFile(content, fileName);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    return true;
  } catch (error) {
    console.error('Error generating file:', error);
    throw error;
  }
};