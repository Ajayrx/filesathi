import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as pdfjsLib from 'pdfjs-dist';

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
    const allChildren: any[] = [];
    
    // Process each DOCX file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      
      // Add document separator if not first file
      if (i > 0) {
        allChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `\n--- End of ${files[i-1].name} ---\n`,
                bold: true,
                color: "666666"
              })
            ]
          })
        );
        allChildren.push(
          new Paragraph({
            children: [new TextRun({ text: "" })] // Empty paragraph for spacing
          })
        );
      }
      
      // Add document header
      allChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Document ${i + 1}: ${file.name}`,
              bold: true,
              size: 32,
              color: "000000"
            })
          ]
        })
      );
      
      allChildren.push(
        new Paragraph({
          children: [new TextRun({ text: "" })] // Empty paragraph for spacing
        })
      );
      
      try {
        // Extract text content using mammoth
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        const text = result.value;
        
        if (text.trim()) {
          // Split into paragraphs and preserve line breaks
          const lines = text.split('\n');
          
          for (const line of lines) {
            if (line.trim() === '') {
              // Add empty paragraph for blank lines
              allChildren.push(
                new Paragraph({
                  children: [new TextRun({ text: "" })]
                })
              );
            } else {
              // Add paragraph with content
              allChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.trim(),
                      size: 24
                    })
                  ]
                })
              );
            }
          }
        } else {
          // If no text extracted, add placeholder
          allChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "[This document appears to be empty or contains only images/tables]",
                  italics: true,
                  color: "888888"
                })
              ]
            })
          );
        }
      } catch (extractError) {
        console.error(`Error extracting text from ${file.name}:`, extractError);
        allChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `[Error reading ${file.name}: ${extractError instanceof Error ? extractError.message : 'Unknown error'}]`,
                italics: true,
                color: "FF0000"
              })
            ]
          })
        );
      }
      
      // Add spacing after each document
      allChildren.push(
        new Paragraph({
          children: [new TextRun({ text: "" })]
        })
      );
    }
    
    // Create the merged document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,    // 1 inch
                right: 1440,  // 1 inch  
                bottom: 1440, // 1 inch
                left: 1440    // 1 inch
              }
            }
          },
          children: allChildren
        }
      ]
    });
    
    // Generate and save the document using browser-compatible method
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}_merged.docx`);
    
  } catch (error) {
    console.error('DOCX merge error:', error);
    throw new Error(`Failed to merge DOCX files: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  quality: number = 80,
  targetSizeKB?: number
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
    
    if (targetSizeKB) {
      // Iteratively compress to reach target file size
      let currentQuality = quality;
      let blob: Blob | null = null;
      
      while (currentQuality > 5) {
        blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', currentQuality / 100);
        });
        
        if (blob && blob.size <= targetSizeKB * 1024) {
          break;
        }
        
        currentQuality -= 5;
      }
      
      // If still too large, try reducing dimensions
      if (blob && blob.size > targetSizeKB * 1024) {
        let scaleFactor = 0.9;
        
        while (scaleFactor > 0.3) {
          const scaledWidth = Math.floor(newWidth * scaleFactor);
          const scaledHeight = Math.floor(newHeight * scaleFactor);
          
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
          
          blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg', 80 / 100);
          });
          
          if (blob && blob.size <= targetSizeKB * 1024) {
            break;
          }
          
          scaleFactor -= 0.1;
        }
      }
      
      if (blob) {
        saveAs(blob, `${fileName}.jpg`);
      }
    } else {
      // Convert to blob and download without size constraint
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${fileName}.jpg`);
        }
      }, 'image/jpeg', quality / 100);
    }
    
    URL.revokeObjectURL(img.src);
  } catch (error) {
    console.error('Image resize error:', error);
    throw new Error('Failed to resize image');
  }
};

// Set up PDF.js worker using CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.54/build/pdf.worker.min.js`;

// PDF to DOCX conversion
export const convertPdfToDocx = async (file: File, fileName: string): Promise<void> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@latest/cmaps/',
      cMapPacked: true,
    }).promise;
    
    let extractedText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Better text extraction with positioning
      let pageText = '';
      let lastY = null;
      
      for (const item of textContent.items as any[]) {
        // Add line breaks for different y positions (new lines)
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        }
        
        pageText += item.str + ' ';
        lastY = item.transform[5];
      }
      
      extractedText += `Page ${pageNum}:\n${pageText.trim()}\n\n`;
    }
    
    // Create DOCX document with better formatting
    const paragraphs = extractedText.split('\n').filter(line => line.trim()).map(line => 
      new Paragraph({
        children: [
          new TextRun({
            text: line.trim(),
            size: 24
          })
        ],
        spacing: {
          after: 120
        }
      })
    );
    
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,    // 1 inch
                right: 1440,  // 1 inch  
                bottom: 1440, // 1 inch
                left: 1440    // 1 inch
              }
            }
          },
          children: paragraphs
        }
      ]
    });
    
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);
    
  } catch (error) {
    console.error('PDF to DOCX conversion error:', error);
    throw new Error('Failed to convert PDF to DOCX');
  }
};

// PDF to Text conversion
export const convertPdfToText = async (file: File, fileName: string): Promise<void> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@latest/cmaps/',
      cMapPacked: true,
    }).promise;
    
    let extractedText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Better text extraction with positioning
      let pageText = '';
      let lastY = null;
      
      for (const item of textContent.items as any[]) {
        // Add line breaks for different y positions (new lines)
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        }
        
        pageText += item.str + ' ';
        lastY = item.transform[5];
      }
      
      extractedText += `--- Page ${pageNum} ---\n${pageText.trim()}\n\n`;
    }
    
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${fileName}.txt`);
    
  } catch (error) {
    console.error('PDF to Text conversion error:', error);
    throw new Error('Failed to convert PDF to text');
  }
};