import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type BackToTopButtonProps = {
  show: boolean;
  onClick: () => void;
};

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ show, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg z-40",
      show ? "opacity-100" : "opacity-0 pointer-events-none",
    )}
    aria-label="Back to top"
  >
    <ArrowUp size={20} />
  </button>
);

export default BackToTopButton;
