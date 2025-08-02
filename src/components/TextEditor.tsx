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
    <Card className="p-6 bg-gradient-card border-0 shadow-soft">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Write Your Content</h2>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
        </div>
        
        <Textarea
          value={value}
          onChange={handleTextChange}
          placeholder="Paste or type your content here... 
          
✍️ Meeting notes, lecture content, chat logs, or any text you want to convert into a downloadable file format.

This text editor supports multiple lines and will preserve your formatting when exported."
          className="min-h-[400px] resize-none border-border/50 focus:border-primary/50 focus:ring-primary/20 bg-background/50 text-foreground placeholder:text-muted-foreground/70 transition-smooth"
        />
      </div>
    </Card>
  );
};