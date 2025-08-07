import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { convertPdfToDocx, convertPdfToText } from "@/utils/conversionUtils";
import { FileText, Upload } from "lucide-react";

const PdfToDocx = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [outputFormat, setOutputFormat] = useState<"docx" | "txt">("docx");
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setFileName(file.name.replace('.pdf', ''));
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file.",
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
      if (outputFormat === "docx") {
        await convertPdfToDocx(selectedFile, fileName);
        toast({
          title: "Success!",
          description: `${fileName}.docx has been generated and downloaded.`,
        });
      } else {
        await convertPdfToText(selectedFile, fileName);
        toast({
          title: "Success!",
          description: `${fileName}.txt has been generated and downloaded.`,
        });
      }
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: `Failed to convert PDF to ${outputFormat.toUpperCase()}. Please try again.`,
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
        <h1 className="text-4xl font-bold text-foreground">PDF to DOCX/Text</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Extract text from PDF files and convert to Word documents or plain text files.
        </p>
      </div>
      
      <div className="space-y-8">
        <Card className="p-6 bg-gradient-card border border-primary/10 shadow-warm">
          <h2 className="text-xl font-bold text-foreground text-[brown] mb-4">Upload PDF File</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Select a PDF file to convert
              </p>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <Button 
                variant="outline"
                onClick={() => document.getElementById('pdf-upload')?.click()}
              >
                Select PDF File
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
            <h2 className="text-xl font-bold text-foreground text-[brown]">Output Format & Name</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Output Format
                </label>
                <Select value={outputFormat} onValueChange={(value: "docx" | "txt") => setOutputFormat(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select output format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="docx">DOCX (Word Document)</SelectItem>
                    <SelectItem value="txt">TXT (Plain Text)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter file name"
                  className="pr-24"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-mono">
                  .{outputFormat}
                </span>
              </div>
            </div>

            <Button 
              onClick={handleDownload}
              disabled={!canDownload}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-medium py-3"
              size="lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              Convert to {outputFormat.toUpperCase()}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PdfToDocx;