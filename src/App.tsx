import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { CookieBanner } from "@/components/CookieBanner";
import Index from "./pages/Index";
import TextToDocx from "./pages/tools/TextToDocx";
import TextToPdf from "./pages/tools/TextToPdf";
import TextToTxt from "./pages/tools/TextToTxt";
import ImageToPdf from "./pages/tools/ImageToPdf";
import DocxToPdf from "./pages/tools/DocxToPdf";
import PdfMerger from "./pages/tools/PdfMerger";
import DocxMerger from "./pages/tools/DocxMerger";
import ImageResizer from "./pages/tools/ImageResizer";
import PdfToDocx from "./pages/tools/PdfToDocx";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools/text-to-docx" element={<TextToDocx />} />
            <Route path="/tools/text-to-pdf" element={<TextToPdf />} />
            <Route path="/tools/text-to-txt" element={<TextToTxt />} />
            <Route path="/tools/image-to-pdf" element={<ImageToPdf />} />
            <Route path="/tools/docx-to-pdf" element={<DocxToPdf />} />
            <Route path="/tools/pdf-merger" element={<PdfMerger />} />
            <Route path="/tools/docx-merger" element={<DocxMerger />} />
            <Route path="/tools/image-resizer" element={<ImageResizer />} />
            <Route path="/tools/pdf-to-docx" element={<PdfToDocx />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieBanner />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
