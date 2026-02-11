import { Button } from "@/components/ui/button";

interface NFCProductCardProps {
  name: string;
  description: string;
  image: string;
  price: string;
  onOrder?: () => void;
}

export const NFCProductCard = ({ name, description, image, price, onOrder }: NFCProductCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] bg-secondary rounded-xl mb-4 flex items-center justify-center overflow-hidden">
        <div className="w-32 h-20 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-semibold text-sm">
          {image}
        </div>
      </div>

      <h3 className="font-semibold text-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">{price}</span>
        <Button variant="outline" size="sm" onClick={onOrder}>
          View
        </Button>
      </div>
    </div>
  );
};
