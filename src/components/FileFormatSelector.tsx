import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileText, FileType, Download } from "lucide-react";

interface FileFormat {
  id: string;
  name: string;
  extension: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const formats: FileFormat[] = [
  {
    id: "docx",
    name: "Microsoft Word",
    extension: ".docx",
    description: "Rich text with formatting support",
    icon: <FileText className="w-6 h-6" />,
    color: "text-blue-600"
  },
  {
    id: "pdf",
    name: "PDF Document", 
    extension: ".pdf",
    description: "Printable, professional format",
    icon: <FileType className="w-6 h-6" />,
    color: "text-red-600"
  },
  {
    id: "txt",
    name: "Plain Text",
    extension: ".txt",
    description: "Simple, universal text file",
    icon: <FileText className="w-6 h-6" />,
    color: "text-gray-600"
  }
];

interface FileFormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
}

export const FileFormatSelector = ({ selectedFormat, onFormatChange }: FileFormatSelectorProps) => {
  return (
    <Card className="p-6 bg-gradient-card border-0 shadow-soft">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Choose File Format</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formats.map((format) => (
            <div
              key={format.id}
              onClick={() => onFormatChange(format.id)}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${selectedFormat === format.id 
                  ? 'border-primary bg-accent shadow-soft transform scale-105' 
                  : 'border-border/50 bg-background/50 hover:border-primary/50 hover:bg-accent/50 hover:shadow-soft'
                }
              `}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`${format.color} ${selectedFormat === format.id ? 'animate-pulse-glow' : ''}`}>
                  {format.icon}
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground">{format.name}</h3>
                  <p className="text-sm text-primary font-mono">{format.extension}</p>
                  <p className="text-xs text-muted-foreground mt-1">{format.description}</p>
                </div>
              </div>
              
              {selectedFormat === format.id && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Download className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};