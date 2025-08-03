import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  Home as HomeIcon,
  FileText,
  Image,
  Merge,
  Settings,
  Menu,
  X,
  BookText,
  FileDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Text to DOCX", path: "/tools/text-to-docx", icon: BookText },
    { name: "Text to TXT", path: "/tools/text-to-txt", icon: BookText },
    { name: "DOCX to PDF", path: "/tools/docx-to-pdf", icon: FileDown },
    { name: "PDF Merger", path: "/tools/pdf-merger", icon: Merge },
    { name: "DOCX Merger", path: "/tools/docx-merger", icon: Merge },
    { name: "Image Resizer", path: "/tools/image-resizer", icon: Settings },
    { name: "Image to PDF (Multi-image)", path: "/tools/image-to-pdf-multi", icon: Image },
    { name: "Img to PDF", path: "/tools/image-to-pdf", icon: Image },
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
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Study.io</span>
          </Link>

          {/* Desktop Navigation - Justified to fill space */}
          <div className="hidden md:flex flex-1 justify-end items-center">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-1">
                {navItems.map((item) => (
                  // CORRECTED PART: Use NavigationMenuLink with asChild pointing to Link
                  <li key={item.path}> {/* Wrap in an li as NavigationMenuList expects li children */}
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link to={item.path}>
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
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
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-saffron-deep" />
                    <span className="text-foreground">{item.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};