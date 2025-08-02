import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { TextEditor } from "@/components/TextEditor";
import { FileFormatSelector } from "@/components/FileFormatSelector";
import { FileNameInput } from "@/components/FileNameInput";
import { useToast } from "@/hooks/use-toast";
import { generateFile } from "@/utils/fileGenerator";

const Index = () => {
  const [textContent, setTextContent] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("docx");
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
      await generateFile(textContent, fileName, selectedFormat);
      
      toast({
        title: "File downloaded successfully!",
        description: `${fileName}.${selectedFormat} has been saved to your downloads.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: `Failed to generate ${selectedFormat.toUpperCase()} file. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const canDownload = textContent.trim().length > 0 && fileName.trim().length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <HeroSection />
      
      <div className="space-y-8">
        <TextEditor 
          value={textContent}
          onChange={setTextContent}
        />
        
        <FileFormatSelector 
          selectedFormat={selectedFormat}
          onFormatChange={setSelectedFormat}
        />
        
        <FileNameInput
          value={fileName}
          onChange={setFileName}
          extension=".docx"
          placeholder="Enter document name"
        />
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>✨ Files are generated instantly in your browser - no server uploads required!</p>
      </div>
    </div>
  );
};

export default Index;
