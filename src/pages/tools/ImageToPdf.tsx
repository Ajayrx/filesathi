import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, X, GripVertical, Move } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ImageToPdf = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [fileName, setFileName] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...selectedImages];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setSelectedImages(updatedImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      moveImage(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDownload = () => {
    toast({
      title: "Feature coming soon!",
      description: "Image to PDF conversion will be available soon.",
    });
  };

  const canDownload = selectedImages.length > 0 && fileName.trim().length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-24 max-w-4xl"
    >
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-4 mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
          <Image className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Image to PDF</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Convert multiple images into a single PDF document with preview and reordering.
        </p>
      </motion.div>
      
      <div className="space-y-8">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-card border border-primary/10 shadow-warm">
            <h2 className="text-xl font-bold text-foreground text-[#8B4513] mb-4">Upload Images</h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-all duration-300 hover:bg-primary/5">
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

              <AnimatePresence>
                {selectedImages.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <h3 className="font-medium text-foreground">Selected Images ({selectedImages.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                      {selectedImages.map((image, index) => (
                        <motion.div
                          key={`${image.name}-${index}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center justify-between bg-background/60 p-3 rounded-lg cursor-move hover:bg-background/80 transition-all ${
                            draggedIndex === index ? 'opacity-50 scale-105' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <div className="w-12 h-12 bg-background/40 rounded-lg flex items-center justify-center overflow-hidden">
                              <img 
                                src={URL.createObjectURL(image)} 
                                alt={image.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-foreground truncate block">{image.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {(image.size / (1024 * 1024)).toFixed(1)} MB
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="text-destructive hover:text-destructive flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-muted-foreground flex items-center space-x-1"
                    >
                      <Move className="w-3 h-3" />
                      <span>Drag images to reorder them in the final PDF</span>
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-card border-0 shadow-soft">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground text-[#8B4513]">Name Your PDF</h2>
              
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
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ImageToPdf;