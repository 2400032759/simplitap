import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PlanCardProps {
  name: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  highlighted?: boolean;
  badge?: string;
}

export const PlanCard = ({
  name,
  description,
  features,
  cta,
  ctaLink,
  highlighted = false,
  badge,
}: PlanCardProps) => {
  return (
    <div
      className={`relative rounded-2xl p-6 transition-all ${
        highlighted
          ? "bg-primary text-primary-foreground shadow-lg scale-105"
          : "bg-card border border-border"
      }`}
    >
      {badge && (
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
            highlighted ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
          }`}
        >
          {badge}
        </span>
      )}

      <div className="mb-6">
        <h3 className={`text-xl font-semibold mb-2 ${highlighted ? "" : "text-foreground"}`}>
          {name}
        </h3>
        <p className={`text-sm ${highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
          {description}
        </p>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlighted ? "text-accent" : "text-primary"}`} />
            <span className={`text-sm ${highlighted ? "" : "text-foreground"}`}>{feature}</span>
          </li>
        ))}
      </ul>

      <Link to={ctaLink}>
        <Button
          variant={highlighted ? "secondary" : "default"}
          className="w-full"
        >
          {cta}
        </Button>
      </Link>
    </div>
  );
};
