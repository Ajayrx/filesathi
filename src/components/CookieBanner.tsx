import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("cookie-consent");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "false");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50"
        >
          <div className="bg-glass-light backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-warm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Cookie className="w-6 h-6 text-saffron-deep" />
              </div>
              
              <div className="flex-1 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  We use cookies
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We use cookies to enhance your experience, analyze site traffic, and improve our services. 
                  By continuing to use our site, you consent to our use of cookies.
                </p>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleAccept}
                    size="sm"
                    className="bg-gradient-primary text-white hover:shadow-glow transition-all duration-300"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-foreground hover:bg-white/10"
                  >
                    Decline
                  </Button>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDecline}
                className="flex-shrink-0 h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};