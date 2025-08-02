import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextEditor } from "@/components/TextEditor";
import { FileNameInput } from "@/components/FileNameInput";
import { useToast } from "@/hooks/use-toast";
import { generateDocxFile } from "@/utils/fileGenerator";
import { FileText, Download } from "lucide-react";
import { motion } from "framer-motion";

const TextToDocx = () => {
  const [textContent, setTextContent] = useState("");
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!textContent.trim()) {
      toast({
        title: "No content to convert",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    if (!fileName.trim()) {
      toast({
        title: "File name required",
        description: "Please enter a file name.",
        variant: "destructive"
      });
      return;
    }

    try {
      await generateDocxFile(textContent, fileName);
      toast({
        title: "Success!",
        description: `${fileName}.docx has been generated and downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate DOCX file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const canDownload = textContent.trim().length > 0 && fileName.trim().length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-24 max-w-4xl"
    >
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-4 mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Text to DOCX</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Convert your text into professional Microsoft Word documents with formatting support.
        </p>
      </motion.div>
      
      <div className="space-y-8">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TextEditor
            value={textContent}
            onChange={setTextContent}
            placeholder="Enter your content here... Supports special characters like ₹, °, µ, etc."
          />
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-card border-0 shadow-soft">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground text-[#8B4513]">Export Settings</h2>
              
              <FileNameInput 
                value={fileName}
                onChange={setFileName}
                extension=".docx"
                placeholder="Enter document name"
              />

              <Button 
                onClick={handleDownload}
                disabled={!canDownload}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-medium py-3"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Generate DOCX Document
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TextToDocx;