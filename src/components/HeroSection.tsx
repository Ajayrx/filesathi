import { FileText, Zap, Download } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="text-center space-y-6 mb-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 bg-accent/50 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium border border-border/50">
          <Zap className="w-4 h-4 text-primary" />
          No Installation Required
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
          Text to Any File
          <span className="block bg-gradient-primary bg-clip-text text-transparent">
            Instantly
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Paste any text and download it as DOCX, PDF, or TXT files. 
          Perfect for meeting notes, reports, and quick document creation.
        </p>
      </div>

      <div className="flex justify-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span>Rich Text Support</span>
        </div>
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-primary" />
          <span>Instant Download</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span>Browser-Based</span>
        </div>
      </div>
    </div>
  );
};