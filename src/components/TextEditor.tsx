import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextEditor = ({ value, onChange }: TextEditorProps) => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onChange(text);
    
    // Update word and character counts
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(text.length);
  };

  return (
    <Card className="p-6 bg-gradient-card border border-primary/10 shadow-warm relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-8 h-8 border-2 border-primary rounded rotate-45"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-saffron-light rounded-full"></div>
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground text-[#8B4513]">✍️ Paste Here</h2>
          <div className="flex gap-4 text-sm text-muted-foreground bg-saffron-light/20 px-3 py-1 rounded-full">
            <span className="font-medium">{wordCount} words</span>
            <span className="font-medium">{charCount} characters</span>
          </div>
        </div>
        
        <Textarea
          value={value}
          onChange={handleTextChange}
          placeholder={`📚 Perfect for:
    • ChatGPT Notes into PDF
    • Make Exam PDFs, DOCX
    • Research Papers
    • Assignments & More`}
          rows={8}
          className="min-h-[200px] resize-none border-primary/20 focus:border-primary focus:ring-primary/20 bg-background/60 text-foreground placeholder:text-muted-foreground/80 transition-smooth shadow-inner"
        />

      </div>
    </Card>
  );
};