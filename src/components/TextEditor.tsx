import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Bold, Italic, Type, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextEditor = ({ value, onChange, placeholder }: TextEditorProps) => {
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onChange(text);
    
    // Update word and character counts
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(text.trim() ? words.length : 0);
    setCharCount(text.length);
  };

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));

  const formatButtonClass = (isActive: boolean) => 
    `p-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-primary text-primary-foreground shadow-md' 
        : 'bg-background/60 hover:bg-background/80 text-foreground'
    }`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
    >
      <Card className="p-4 sm:p-6 bg-gradient-card border border-primary/10 shadow-warm relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-8 h-8 border-2 border-primary rounded rotate-45"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-saffron-light rounded-full"></div>
        </div>
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-foreground text-[brown]">✍️ Content Editor / Paste Here</h2>
            <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground bg-saffron-light/20 px-2 sm:px-3 py-1 rounded-full">
              <span className="font-medium">{wordCount} words</span>
              <span className="font-medium">{charCount} characters</span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 sm:space-x-3 p-2 sm:p-3 bg-glass-light backdrop-blur-sm border border-white/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBold(!isBold)}
                className={formatButtonClass(isBold)}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsItalic(!isItalic)}
                className={formatButtonClass(isItalic)}
              >
                <Italic className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={decreaseFontSize}
                className="p-2 bg-background/60 hover:bg-background/80 text-foreground rounded-lg"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-1 px-3 py-1 bg-background/60 rounded-lg">
                <Type className="w-4 h-4" />
                <span className="text-sm font-medium">{fontSize}px</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={increaseFontSize}
                className="p-2 bg-background/60 hover:bg-background/80 text-foreground rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Textarea
            value={value}
            onChange={handleTextChange}
            placeholder={placeholder || `📚 Perfect for:
    • ChatGPT Notes into PDF
    • Make Exam PDFs, DOCX
    • Research Papers
    • Assignments & More`}
            rows={8}
            className="min-h-[200px] resize-none border-primary/20 focus:border-primary focus:ring-primary/20 bg-background/40 text-foreground placeholder:text-muted-foreground/80 transition-smooth shadow-inner"
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: isBold ? 'bold' : 'normal',
              fontStyle: isItalic ? 'italic' : 'normal',
            }}
          />
          
          <div className="text-xs text-muted-foreground">
            Supports special characters: ₹ • ° • µ • © • ® • ™ • → • ← • ↑ • ↓
          </div>
        </div>
      </Card>
    </motion.div>
  );
};