import { Link } from "react-router-dom";
const logo = "https://image2url.com/images/1766048702496-c162cdbc-a508-4446-afbc-21e8ac31403a.jpg";

export const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Simplify Tap" className="h-8 w-auto rounded" />
              <span className="font-semibold text-foreground">Simplify Tap</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              One Tap. One Identity.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/create" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Create Card
                </Link>
              </li>
              <li>
                <Link to="/plus" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Plus
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Teams
                </Link>
              </li>
              <li>
                <Link to="/nfc" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  NFC Cards
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Simplify Tap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
