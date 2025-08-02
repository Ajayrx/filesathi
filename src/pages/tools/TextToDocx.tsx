import { useState } from "react";
import { TextEditor } from "@/components/TextEditor";
import { FileNameInput } from "@/components/FileNameInput";
import { useToast } from "@/hooks/use-toast";
import { generateDocxFile } from "@/utils/fileGenerator";
import { FileText } from "lucide-react";

const TextToDocx = () => {
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
      await generateDocxFile(textContent, fileName);
      
      toast({
        title: "File downloaded successfully!",
        description: `${fileName}.docx has been saved to your downloads.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Failed to generate DOCX file. Please try again.",
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
        <h1 className="text-4xl font-bold text-foreground">Text to DOCX</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Convert your text into professional Microsoft Word documents instantly.
        </p>
      </div>
      
      <div className="space-y-8">
        <TextEditor 
          value={textContent}
          onChange={setTextContent}
        />
        
        <FileNameInput
          fileName={fileName}
          onFileNameChange={setFileName}
          selectedFormat="docx"
          onDownload={handleDownload}
          canDownload={canDownload}
        />
      </div>
    </div>
  );
};

export default TextToDocx;