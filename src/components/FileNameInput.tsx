import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface FileNameInputProps {
  value: string;
  onChange: (value: string) => void;
  extension: string;
  placeholder?: string;
}

export const FileNameInput = ({ value, onChange, extension, placeholder }: FileNameInputProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter file name"}
        className="pr-20 bg-background/60 border-white/20 focus:border-primary/50"
      />
      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-mono">
        {extension}
      </span>
    </motion.div>
  );
};