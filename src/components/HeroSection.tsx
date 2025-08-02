import { FileText, Download, Zap } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="text-center space-y-2 mb-10 relative">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-saffron-light/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-1/3 w-24 h-24 bg-primary/15 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-primary-glow/10 rounded-full blur-2xl"></div>
      </div>

      {/* Hero Content */}
      <div className="space-y-2">
        {/* Top Badges with Icons */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 bg-card px-5 py-3 rounded-xl shadow-md text-saffron-deep font-medium text-sm">
            <FileText className="w-5 h-5 text-saffron-deep" />
            Academic Support
          </div>
          <div className="flex items-center gap-2 bg-card px-5 py-3 rounded-xl shadow-md text-saffron-deep font-medium text-sm">
            <Download className="w-5 h-5 text-saffron-deep" />
            Instant Export
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
          <span className="inline text-primary">WE</span>{" "}
          <span className="inline text-saffron-deep">MAKE</span>{" "}
          <span className="inline bg-gradient-education bg-clip-text text-transparent">LEARNING</span>{" "}
          <span className="inline text-muted-foreground">SPECIAL</span>
        </h1>

        {/* Description */}
        <p className="text-xl text-muted-foreground max-w-5xl font-bold mx-auto leading-relaxed">
          Copy any text—like from ChatGPT or AI tools—and paste it here to quickly convert into DOCX, PDF, or TXT files.
        </p>
      </div>
    </div>
  );
};
