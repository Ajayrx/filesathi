import { FileText, Zap, Download } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="text-center space-y-8 mb-12 relative">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-saffron-light/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-1/3 w-24 h-24 bg-primary/15 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-primary-glow/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="space-y-6">
        <div className="inline-flex items-center gap-3 bg-gradient-education/10 text-primary px-6 py-3 rounded-full text-sm font-semibold border border-primary/20 shadow-warm">
          <Zap className="w-5 h-5" />
          Transform Learning Materials Instantly
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
          WE MAKE
          <span className="block bg-gradient-education bg-clip-text text-transparent">
            LEARNING
          </span>
          <span className="block text-saffron-deep">
            SPECIAL
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Convert your educational content, lecture notes, research papers, and study materials 
          into professional DOCX, PDF, or TXT files. Perfect for educators, students, and researchers.
        </p>
      </div>

      <div className="flex justify-center gap-12 text-sm text-muted-foreground flex-wrap">
        <div className="flex items-center gap-3 bg-card/80 px-4 py-2 rounded-lg shadow-soft">
          <FileText className="w-5 h-5 text-primary" />
          <span className="font-medium">Academic Support</span>
        </div>
        <div className="flex items-center gap-3 bg-card/80 px-4 py-2 rounded-lg shadow-soft">
          <Download className="w-5 h-5 text-primary" />
          <span className="font-medium">Instant Export</span>
        </div>
        <div className="flex items-center gap-3 bg-card/80 px-4 py-2 rounded-lg shadow-soft">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-medium">No Software Needed</span>
        </div>
      </div>
    </div>
  );
};