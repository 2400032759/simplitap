import { Lock } from "lucide-react";

interface LockedFeatureProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

export const LockedFeature = ({ title, description, onClick }: LockedFeatureProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-xl border-2 border-dashed border-accent/30 bg-accent/5 hover:bg-accent/10 transition-colors group text-left"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            <span className="font-medium text-foreground">{title}</span>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <span className="text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Upgrade
        </span>
      </div>
    </button>
  );
};
