import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileCheck } from "lucide-react";

interface FileNameInputProps {
  fileName: string;
  onFileNameChange: (name: string) => void;
  selectedFormat: string;
  onDownload: () => void;
  canDownload: boolean;
}

export const FileNameInput = ({ 
  fileName, 
  onFileNameChange, 
  selectedFormat, 
  onDownload,
  canDownload 
}: FileNameInputProps) => {
  const [isValid, setIsValid] = useState(true);

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Basic validation - no special characters that could break file systems
    const isValidName = /^[a-zA-Z0-9\s\-_().]+$/.test(value) || value === "";
    setIsValid(isValidName);
    onFileNameChange(value);
  };

  const getFileExtension = () => {
    switch (selectedFormat) {
      case "docx": return ".docx";
      case "pdf": return ".pdf";
      case "txt": return ".txt";
      default: return ".txt";
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-0 shadow-soft">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground text-[#8B4513]">Name Your File</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <Input
              value={fileName}
              onChange={handleFileNameChange}
              placeholder="Enter file name (like : DSA Module 1 Notes.)"
              className={`pr-20 transition-smooth ${
                !isValid 
                  ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
                  : 'border-border/50 focus:border-primary/50 focus:ring-primary/20'
              }`}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-mono">
              {getFileExtension()}
            </span>
          </div>
          
          {!isValid && (
            <p className="text-sm text-destructive">
              File name can only contain letters, numbers, spaces, hyphens, underscores, and parentheses
            </p>
          )}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileCheck className="w-4 h-4" />
            <span>Final file: {fileName || "untitled"}{getFileExtension()}</span>
          </div>
        </div>

        <Button 
          onClick={onDownload}
          disabled={!canDownload || !isValid || !fileName.trim()}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-medium py-3"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Download {selectedFormat.toUpperCase()} File
        </Button>
      </div>
    </Card>
  );
};