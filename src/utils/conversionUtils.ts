import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

// DOCX to PDF conversion using basic approach
export const convertDocxToPdf = async (file: File, fileName: string): Promise<void> => {
  try {
    // For now, we'll create a basic PDF with file info
    // In a real implementation, you'd need a proper DOCX parser
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('DOCX to PDF Conversion', 20, 30);
    pdf.setFontSize(12);
    pdf.text(`Original file: ${file.name}`, 20, 50);
    pdf.text(`File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`, 20, 70);
    pdf.text('Note: This is a placeholder conversion.', 20, 90);
    pdf.text('For full functionality, server-side processing is required.', 20, 110);
    
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

// DOCX Merger function (basic implementation)
export const mergeDocxFiles = async (files: File[], fileName: string): Promise<void> => {
  try {
    // This is a simplified implementation
    // In a real app, you'd need proper DOCX parsing and merging
    let combinedContent = '';
    
    for (let i = 0; i < files.length; i++) {
      combinedContent += `\n\n--- Document ${i + 1}: ${files[i].name} ---\n\n`;
      combinedContent += `[Content from ${files[i].name} would be extracted here]\n`;
      combinedContent += `File size: ${(files[i].size / 1024 / 1024).toFixed(2)} MB\n`;
    }
    
    // Create a simple text file for now
    const blob = new Blob([combinedContent], { type: 'text/plain' });
    saveAs(blob, `${fileName}_merged.txt`);
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