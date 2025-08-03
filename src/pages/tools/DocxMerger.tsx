import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { mergeDocxFiles } from "@/utils/conversionUtils";
import { FileText, Upload, X, GripVertical } from "lucide-react";

const DocxMerger = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const docxFiles = files.filter(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    if (docxFiles.length !== files.length) {
      toast({
        title: "Invalid files detected",
        description: "Only DOCX files are allowed.",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(prev => [...prev, ...docxFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    const updatedFiles = [...selectedFiles];
    const [movedFile] = updatedFiles.splice(fromIndex, 1);
    updatedFiles.splice(toIndex, 0, movedFile);
    setSelectedFiles(updatedFiles);
  };

  const handleDownload = async () => {
    if (selectedFiles.length < 2 || !fileName.trim()) {
      toast({
        title: "Missing information",
        description: "Please select at least 2 DOCX files and enter a filename.",
        variant: "destructive"
      });
      return;
    }

    try {
      await mergeDocxFiles(selectedFiles, fileName);
      toast({
        title: "Success!",
        description: `${fileName}_merged.docx has been generated and downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Merge failed",
        description: "Failed to merge DOCX files. Please try again.",
        variant: "destructive"
      });
    }
  };

  const canDownload = selectedFiles.length > 1 && fileName.trim().length > 0;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-16 sm:py-24 max-w-4xl">
      <div className="text-center space-y-2 sm:space-y-4 mb-6 sm:mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-2xl mb-2 sm:mb-4">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">DOCX Merger</h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          Merge multiple DOCX documents into a single file.
        </p>
      </div>
      
      <div className="space-y-4 sm:space-y-8">
        <Card className="p-3 sm:p-6 bg-gradient-card border border-primary/10 shadow-warm">
          <h2 className="text-lg sm:text-xl font-bold text-foreground text-[brown] mb-3 sm:mb-4">Upload DOCX Files</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 sm:p-8 text-center hover:border-primary/40 transition-colors">
              <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2 sm:mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 px-2">
                Drag and drop DOCX files here, or click to select
              </p>
              <Input
                type="file"
                multiple
                accept=".docx"
                onChange={handleFileUpload}
                className="hidden"
                id="docx-upload"
              />
              <Button 
                variant="outline"
                onClick={() => document.getElementById('docx-upload')?.click()}
                className="text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                Select DOCX Files
              </Button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-medium text-foreground">Selected Files ({selectedFiles.length})</h3>
                <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-background/60 p-2 sm:p-3 rounded-lg">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <GripVertical className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground cursor-move flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-foreground truncate">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-destructive hover:text-destructive p-1 sm:p-2 flex-shrink-0"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground px-1">
                  Tip: Files will be merged in the order shown above.
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-3 sm:p-6 bg-gradient-card border-0 shadow-soft">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-foreground text-[brown]">Name Your Merged File</h2>
            
            <div className="relative">
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                className="pr-16 sm:pr-20 text-sm sm:text-base"
              />
              <span className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-muted-foreground font-mono">
                .docx
              </span>
            </div>

            <Button 
              onClick={handleDownload}
              disabled={!canDownload}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-medium py-2 sm:py-3 text-sm sm:text-base"
              size="lg"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Merge DOCX Files
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocxMerger;