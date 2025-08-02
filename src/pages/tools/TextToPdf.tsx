import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextEditor } from "@/components/TextEditor";
import { FileNameInput } from "@/components/FileNameInput";
import { useToast } from "@/hooks/use-toast";
import { generatePdfFile } from "@/utils/fileGenerator";
import { FileText, Download } from "lucide-react";

const TextToPdf = () => {
  const [textContent, setTextContent] = useState("");
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!textContent.trim()) {
      toast({
        title: "No content to download",
        description: "Please enter some text before downloading.",
        variant: "destructive"
      });
      return;
    }

    if (!fileName.trim()) {
      toast({
        title: "Filename required",
        description: "Please enter a filename for your download.",
        variant: "destructive"
      });
      return;
    }

    try {
      generatePdfFile(textContent, fileName);
      
      toast({
        title: "File downloaded successfully!",
        description: `${fileName}.pdf has been saved to your downloads.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Failed to generate PDF file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const canDownload = textContent.trim().length > 0 && fileName.trim().length > 0;

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Text to PDF</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Convert your text into professional PDF documents with proper symbol support.
        </p>
      </div>
      
      <div className="space-y-8">
        <TextEditor 
          value={textContent}
          onChange={setTextContent}
        />
        
        <FileNameInput
          value={fileName}
          onChange={setFileName}
          extension=".pdf"
          placeholder="Enter document name"
        />

        <Button 
          onClick={handleDownload}
          disabled={!canDownload}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-medium py-3"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Generate PDF
        </Button>
      </div>
    </div>
  );
};

export default TextToPdf;