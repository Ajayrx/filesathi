import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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

  const handleDownload = () => {
    // Placeholder for DOCX merging functionality
    toast({
      title: "Feature coming soon!",
      description: "DOCX merging will be available soon.",
    });
  };

  const canDownload = selectedFiles.length > 1 && fileName.trim().length > 0;

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">DOCX Merger</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Merge multiple DOCX documents into a single file.
        </p>
      </div>
      
      <div className="space-y-8">
        <Card className="p-6 bg-gradient-card border border-primary/10 shadow-warm">
          <h2 className="text-xl font-bold text-foreground text-[#8B4513] mb-4">Upload DOCX Files</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
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
              >
                Select DOCX Files
              </Button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Selected Files ({selectedFiles.length})</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-background/60 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                        <span className="text-sm text-foreground truncate">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tip: Files will be merged in the order shown above.
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground text-[#8B4513]">Name Your Merged File</h2>
            
            <div className="relative">
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                className="pr-20"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-mono">
                .docx
              </span>
            </div>

            <Button 
              onClick={handleDownload}
              disabled={!canDownload}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-medium py-3"
              size="lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              Merge DOCX Files
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocxMerger;