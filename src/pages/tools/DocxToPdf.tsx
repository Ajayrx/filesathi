import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { convertDocxToPdf } from "@/utils/conversionUtils";
import { FileText, Upload } from "lucide-react";

const DocxToPdf = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setSelectedFile(file);
        setFileName(file.name.replace('.docx', ''));
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a DOCX file.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDownload = async () => {
    if (!selectedFile || !fileName.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter a filename.",
        variant: "destructive"
      });
      return;
    }

    try {
      await convertDocxToPdf(selectedFile, fileName);
      toast({
        title: "Success!",
        description: `${fileName}.pdf has been generated and downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "Failed to convert DOCX to PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const canDownload = selectedFile && fileName.trim().length > 0;

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">DOCX to PDF</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Convert your Word documents to PDF format while preserving formatting.
        </p>
      </div>
      
      <div className="space-y-8">
        <Card className="p-6 bg-gradient-card border border-primary/10 shadow-warm">
          <h2 className="text-xl font-bold text-foreground text-[#8B4513] mb-4">Upload DOCX File</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Select a DOCX file to convert
              </p>
              <Input
                type="file"
                accept=".docx"
                onChange={handleFileUpload}
                className="hidden"
                id="docx-upload"
              />
              <Button 
                variant="outline"
                onClick={() => document.getElementById('docx-upload')?.click()}
              >
                Select DOCX File
              </Button>
            </div>

            {selectedFile && (
              <div className="bg-background/60 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-saffron-deep" />
                  <span className="text-foreground font-medium">{selectedFile.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground text-[#8B4513]">Name Your PDF</h2>
            
            <div className="relative">
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                className="pr-20"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-mono">
                .pdf
              </span>
            </div>

            <Button 
              onClick={handleDownload}
              disabled={!canDownload}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-medium py-3"
              size="lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              Convert to PDF
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocxToPdf;