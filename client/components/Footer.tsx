import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main footer */}
      <div className="px-4 md:px-8 py-12 md:py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4">Optics</h3>
              <p className="text-sm opacity-75 mb-4">
                Premium eyewear for every style and vision.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/shop" className="opacity-75 hover:opacity-100">
                    All Eyewear
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="opacity-75 hover:opacity-100">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="opacity-75 hover:opacity-100">
                    Featured Frames
                  </Link>
                </li>
                <li>
                  <Link to="/sale" className="opacity-75 hover:opacity-100">
                    Sale
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/login" className="opacity-75 hover:opacity-100">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="opacity-75 hover:opacity-100">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="opacity-75 hover:opacity-100">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="opacity-75 hover:opacity-100">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-semibold mb-4">Help</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/contact" className="opacity-75 hover:opacity-100">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/size-guide" className="opacity-75 hover:opacity-100">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="opacity-75 hover:opacity-100">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="opacity-75 hover:opacity-100">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Need a hand?</h4>
              <p className="text-sm opacity-75 mb-4">
                Get help choosing a frame or with an existing order.
              </p>
              <Link to="/contact">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                  Contact support
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t border-secondary-foreground/20 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Contact Info */}
              <div>
                <h4 className="font-semibold mb-4">Get in Touch</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>123 Vision Street, New York, NY 10001</span>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>1-800-OPTICS-1</span>
                  </div>
                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>support@optics.com</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Checkout</h4>
                <p className="text-sm opacity-75 max-w-md">
                  Checkout is in preview mode. Payment processing is not enabled yet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-foreground/20 px-4 md:px-8 py-6">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-75">
          <p>&copy; 2024 Optics. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/accessibility" className="hover:opacity-100">
              Accessibility
            </Link>
            <Link to="/security" className="hover:opacity-100">
              Security
            </Link>
            <Link to="/sitemap" className="hover:opacity-100">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
