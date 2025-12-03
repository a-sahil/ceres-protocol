import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Warehouse, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext"; 
import { UserCircle, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth(); 

  const navItems = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "For Warehouses", path: "/#warehouses" },
    { name: "Browse Warehouses", path: "/listings" },
     { name: "Register Warehouse", path: "/register" },
      { name: "DAO", path: "/dao" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative">
              {/* <Warehouse className="h-8 w-8 text-primary" />
              <Leaf className="h-4 w-4 text-secondary absolute -bottom-1 -right-1" /> */}
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ceres Protocol
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors link-underline",
                  isActive(item.path)
                    ? "text-secondary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* --- MODIFIED DESKTOP CTAs --- */}
          <div className="hidden md:flex items-center gap-3">
            <ConnectButton />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    <span>{user?.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/listings">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline" size="default">
                  <Link to="/login">Farmer Login</Link>
                </Button>
                <Button asChild variant="hero" size="default">
                  <Link to="/register">Register Warehouse</Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border animate-fade-in">
              <div className="container mx-auto px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    className={cn(
                      "block py-2 text-base font-medium transition-colors",
                      isActive(item.path)
                        ? "text-secondary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 space-y-2">
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Farmer Login
                    </Link>
                  </Button>
                  <Button asChild variant="hero" size="lg" className="w-full">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      Register Warehouse
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;