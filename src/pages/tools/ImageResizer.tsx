import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { resizeImage } from "@/utils/conversionUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Upload, Download } from "lucide-react";

const ImageResizer = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quality, setQuality] = useState("80");
  const [targetSize, setTargetSize] = useState("");
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setFileName(file.name.split('.')[0]);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive"
        });
      }
    }
  };

  const handleResize = async () => {
    if (!selectedImage || !fileName.trim()) {
      toast({
        title: "Missing information",
        description: "Please select an image and enter a filename.",
        variant: "destructive"
      });
      return;
    }

    const widthNum = width ? parseInt(width) : undefined;
    const heightNum = height ? parseInt(height) : undefined;
    const qualityNum = parseInt(quality);
    const targetSizeKB = targetSize && targetSize !== "none" ? parseInt(targetSize) : undefined;

    try {
      await resizeImage(selectedImage, fileName, widthNum, heightNum, qualityNum, targetSizeKB);
      toast({
        title: "Success!",
        description: `${fileName}.jpg has been resized and downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Resize failed",
        description: "Failed to resize image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const canResize = selectedImage && fileName.trim().length > 0;

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Image Resizer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Resize and compress your images to the perfect dimensions and quality.
        </p>
      </div>
      
      <div className="space-y-8">
        <Card className="p-6 bg-gradient-card border border-primary/10 shadow-warm">
          <h2 className="text-xl font-bold text-foreground text-[brown] mb-4">Upload Image</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Select an image to resize
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button 
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                Select Image
              </Button>
            </div>

            {selectedImage && (
              <div className="bg-background/60 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-saffron-deep" />
                  <span className="text-foreground font-medium">{selectedImage.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border border-primary/10 shadow-warm">
          <h2 className="text-xl font-bold text-foreground text-[brown] mb-4">Resize Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Enter width"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter height"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quality">Quality (%)</Label>
              <Input
                id="quality"
                type="number"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                placeholder="Image quality (1-100)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetSize">Target File Size</Label>
              <Select value={targetSize} onValueChange={setTargetSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target size (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No size limit</SelectItem>
                  <SelectItem value="50">50 KB</SelectItem>
                  <SelectItem value="100">100 KB</SelectItem>
                  <SelectItem value="200">200 KB</SelectItem>
                  <SelectItem value="500">500 KB</SelectItem>
                  <SelectItem value="1000">1 MB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            Leave width or height empty to maintain aspect ratio. Quality affects file size.
          </p>
        </Card>

        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground text-[brown]">Output File Name</h2>
            
            <div className="relative">
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                className="pr-20"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-mono">
                .jpg
              </span>
            </div>

            <Button 
              onClick={handleResize}
              disabled={!canResize}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-medium py-3"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Resize & Download
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ImageResizer;