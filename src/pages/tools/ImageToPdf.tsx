import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, X } from "lucide-react";

const ImageToPdf = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        title: "Invalid files detected",
        description: "Only image files are allowed.",
        variant: "destructive"
      });
    }
    
    setSelectedImages(prev => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownload = () => {
    // Placeholder for image to PDF conversion
    toast({
      title: "Feature coming soon!",
      description: "Image to PDF conversion will be available soon.",
    });
  };

  const canDownload = selectedImages.length > 0 && fileName.trim().length > 0;

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
          <Image className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Image to PDF</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Convert multiple images into a single PDF document.
        </p>
      </div>
      
      <div className="space-y-8">
        <Card className="p-6 bg-gradient-card border border-primary/10 shadow-warm">
          <h2 className="text-xl font-bold text-foreground text-[#8B4513] mb-4">Upload Images</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Drag and drop images here, or click to select
              </p>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button 
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                Select Images
              </Button>
            </div>

            {selectedImages.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Selected Images ({selectedImages.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="flex items-center justify-between bg-background/60 p-3 rounded-lg">
                      <span className="text-sm text-foreground truncate">{image.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground text-[#8B4513]">Name Your File</h2>
            
            <div className="relative">
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                className="pr-20"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-mono">
                .pdf
              </span>
            </div>

            <Button 
              onClick={handleDownload}
              disabled={!canDownload}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-medium py-3"
              size="lg"
            >
              <Image className="w-5 h-5 mr-2" />
              Create PDF from Images
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ImageToPdf;