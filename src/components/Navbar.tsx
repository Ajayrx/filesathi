import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { FileText, Image, Merge, Settings, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const tools = [
    { name: "Text to DOCX", path: "/tools/text-to-docx", icon: FileText },
    { name: "Text to PDF", path: "/tools/text-to-pdf", icon: FileText },
    { name: "Text to TXT", path: "/tools/text-to-txt", icon: FileText },
    { name: "Image to PDF", path: "/tools/image-to-pdf", icon: Image },
    { name: "DOCX to PDF", path: "/tools/docx-to-pdf", icon: FileText },
    { name: "PDF Merger", path: "/tools/pdf-merger", icon: Merge },
    { name: "Image Resizer", path: "/tools/image-resizer", icon: Settings },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-glass-light backdrop-blur-xl border-b border-white/10 shadow-glow"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">DocuGen</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-foreground hover:bg-white/10">
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px] grid-cols-2 bg-glass-light backdrop-blur-xl border border-white/20 rounded-xl shadow-warm">
                      {tools.map((tool) => (
                        <NavigationMenuLink key={tool.path} asChild>
                          <Link
                            to={tool.path}
                            className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-200"
                          >
                            <tool.icon className="w-5 h-5 text-saffron-deep group-hover:text-primary transition-colors" />
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {tool.name}
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button 
              variant="gradient" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Start a Project
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-glass-light backdrop-blur-xl border-t border-white/10"
            >
              <div className="py-4 space-y-2">
                <div className="text-sm font-semibold text-saffron-deep px-4 py-2">Tools</div>
                {tools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors"
                  >
                    <tool.icon className="w-5 h-5 text-saffron-deep" />
                    <span className="text-foreground">{tool.name}</span>
                  </Link>
                ))}
                <div className="px-4 pt-4">
                  <Button 
                    variant="gradient" 
                    className="w-full bg-gradient-primary"
                  >
                    Start a Project
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};