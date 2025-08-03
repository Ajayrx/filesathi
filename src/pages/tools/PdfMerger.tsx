import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { mergePdfFiles } from "@/utils/conversionUtils";
import { Merge, Upload, X, ArrowUp, ArrowDown } from "lucide-react";

const PdfMerger = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      toast({
        title: "Invalid files detected",
        description: "Only PDF files are allowed.",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(prev => [...prev, ...pdfFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...selectedFiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      setSelectedFiles(newFiles);
    }
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2 || !fileName.trim()) {
      toast({
        title: "Missing information",
        description: "Please select at least 2 PDF files and enter a filename.",
        variant: "destructive"
      });
      return;
    }

    try {
      await mergePdfFiles(selectedFiles, fileName);
      toast({
        title: "Success!",
        description: `${fileName}.pdf has been merged and downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Merge failed",
        description: "Failed to merge PDF files. Please try again.",
        variant: "destructive"
      });
    }
  };

  const canMerge = selectedFiles.length >= 2 && fileName.trim().length > 0;

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
          <Merge className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">PDF Merger</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Combine multiple PDF files into a single document.
        </p>
      </div>
      
      <div className="space-y-8">
        <Card className="p-6 bg-gradient-card border border-primary/10 shadow-warm">
          <h2 className="text-xl font-bold text-foreground text-[#8B4513] mb-4">Upload PDF Files</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Select multiple PDF files to merge
              </p>
              <Input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <Button 
                variant="outline"
                onClick={() => document.getElementById('pdf-upload')?.click()}
              >
                Select PDF Files
              </Button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">
                  Selected Files ({selectedFiles.length}) - Merge Order:
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-background/60 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}.
                        </span>
                        <span className="text-sm text-foreground truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveFile(index, 'up')}
                          disabled={index === 0}
                          className="p-1 h-8 w-8"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveFile(index, 'down')}
                          disabled={index === selectedFiles.length - 1}
                          className="p-1 h-8 w-8"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-destructive hover:text-destructive p-1 h-8 w-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground text-[#8B4513]">Name Your Merged PDF</h2>
            
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
              onClick={handleMerge}
              disabled={!canMerge}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-medium py-3"
              size="lg"
            >
              <Merge className="w-5 h-5 mr-2" />
              Merge PDF Files
            </Button>
            
            {selectedFiles.length < 2 && (
              <p className="text-sm text-muted-foreground text-center">
                Please select at least 2 PDF files to merge
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PdfMerger;