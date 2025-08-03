import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// DOCX to PDF conversion with actual text extraction
export const convertDocxToPdf = async (file: File, fileName: string): Promise<void> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Extract text from DOCX using mammoth
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;
    
    const pdf = new jsPDF();
    
    // Split text into lines that fit the page width
    const pageWidth = pdf.internal.pageSize.getWidth() - 40; // 20px margin on each side
    const lines = pdf.splitTextToSize(text, pageWidth);
    
    let currentY = 30;
    const lineHeight = 10;
    const pageHeight = pdf.internal.pageSize.getHeight() - 40; // 20px margin top/bottom
    
    // Add text to PDF with proper pagination
    for (let i = 0; i < lines.length; i++) {
      if (currentY > pageHeight) {
        pdf.addPage();
        currentY = 30;
      }
      
      pdf.text(lines[i], 20, currentY);
      currentY += lineHeight;
    }
    
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('DOCX to PDF conversion error:', error);
    throw new Error('Failed to convert DOCX to PDF');
  }
};

// PDF Merger function
export const mergePdfFiles = async (files: File[], fileName: string): Promise<void> => {
  try {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }
    
    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, `${fileName}.pdf`);
  } catch (error) {
    console.error('PDF merge error:', error);
    throw new Error('Failed to merge PDF files');
  }
};

// DOCX Merger function - creates actual merged DOCX file
export const mergeDocxFiles = async (files: File[], fileName: string): Promise<void> => {
  try {
    const allParagraphs: Paragraph[] = [];
    
    // Extract text from each DOCX file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      
      // Add document separator
      if (i > 0) {
        allParagraphs.push(new Paragraph({
          children: [new TextRun({ text: '\n\n--- Document Separator ---\n\n', bold: true })]
        }));
      }
      
      // Add document title
      allParagraphs.push(new Paragraph({
        children: [new TextRun({ text: `Document ${i + 1}: ${file.name}`, bold: true, size: 28 })]
      }));
      
      allParagraphs.push(new Paragraph({
        children: [new TextRun({ text: '\n' })]
      }));
      
      try {
        // Extract text content using mammoth
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        
        // Split text into paragraphs and add to document
        const paragraphs = text.split('\n').filter(line => line.trim() !== '');
        
        for (const paragraphText of paragraphs) {
          allParagraphs.push(new Paragraph({
            children: [new TextRun({ text: paragraphText })]
          }));
        }
      } catch (extractError) {
        // If text extraction fails, add error message
        allParagraphs.push(new Paragraph({
          children: [new TextRun({ text: 'Error: Could not extract text from this document.', italics: true })]
        }));
      }
    }
    
    // Create new DOCX document with merged content
    const doc = new Document({
      sections: [{
        properties: {},
        children: allParagraphs
      }]
    });
    
    // Generate and download the merged DOCX
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    saveAs(blob, `${fileName}_merged.docx`);
    
  } catch (error) {
    console.error('DOCX merge error:', error);
    throw new Error('Failed to merge DOCX files');
  }
};

// Image to PDF conversion
export const convertImagesToPdf = async (images: File[], fileName: string): Promise<void> => {
  try {
    const pdf = new jsPDF();
    let firstImage = true;
    
    for (const imageFile of images) {
      if (!firstImage) {
        pdf.addPage();
      }
      
      const imageDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(imageFile);
      });
      
      // Get image dimensions and calculate scaling
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = imageDataUrl;
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth() - 20;
      const pageHeight = pdf.internal.pageSize.getHeight() - 20;
      
      let imgWidth = img.width;
      let imgHeight = img.height;
      
      // Scale image to fit page while maintaining aspect ratio
      if (imgWidth > pageWidth) {
        imgHeight = (imgHeight * pageWidth) / imgWidth;
        imgWidth = pageWidth;
      }
      
      if (imgHeight > pageHeight) {
        imgWidth = (imgWidth * pageHeight) / imgHeight;
        imgHeight = pageHeight;
      }
      
      // Center the image on the page
      const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
      const y = (pdf.internal.pageSize.getHeight() - imgHeight) / 2;
      
      pdf.addImage(imageDataUrl, 'JPEG', x, y, imgWidth, imgHeight);
      firstImage = false;
    }
    
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Image to PDF conversion error:', error);
    throw new Error('Failed to convert images to PDF');
  }
};

// Image resizing function
export const resizeImage = async (
  file: File, 
  fileName: string, 
  width?: number, 
  height?: number, 
  quality: number = 80
): Promise<void> => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
    
    // Calculate dimensions
    let newWidth = width || img.width;
    let newHeight = height || img.height;
    
    // If only one dimension is provided, maintain aspect ratio
    if (width && !height) {
      newHeight = (img.height * width) / img.width;
    } else if (height && !width) {
      newWidth = (img.width * height) / img.height;
    }
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Draw resized image
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${fileName}.jpg`);
      }
    }, 'image/jpeg', quality / 100);
    
    URL.revokeObjectURL(img.src);
  } catch (error) {
    console.error('Image resize error:', error);
    throw new Error('Failed to resize image');
  }
};