import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { TextEditor } from "@/components/TextEditor";
import { FileFormatSelector } from "@/components/FileFormatSelector";
import { FileNameInput } from "@/components/FileNameInput";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [textContent, setTextContent] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("docx");
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleDownload = () => {
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

    // Simulate file generation and download
    // In a real app, this would send the data to a backend API
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${selectedFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "File downloaded successfully!",
      description: `${fileName}.${selectedFormat} has been saved to your downloads.`,
    });
  };

  const canDownload = textContent.trim().length > 0 && fileName.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-background">
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
            fileName={fileName}
            onFileNameChange={setFileName}
            selectedFormat={selectedFormat}
            onDownload={handleDownload}
            canDownload={canDownload}
          />
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>✨ Files are generated instantly in your browser - no server uploads required!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
