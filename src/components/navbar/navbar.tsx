"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Products", href: "/products" },
  { name: "Use Cases", href: "/use-cases" },
  { name: "Docs", href: "/docs" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed w-full z-40 transition-all duration-300",
        isScrolled
          ? "bg-[#252422]/95 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-b from-black/20 to-transparent",
        "border-b border-white/10"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <Flame className="h-9 w-9 text-[#EB6C33] transform transition-transform group-hover:rotate-12" />
              <span className="text-2xl font-bold text-white tracking-tight">
                DuneFox
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-white/90 hover:text-white transition-colors relative group",
                  pathname === item.href && "text-white"
                )}
              >
                {item.name}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-1 h-0.5 bg-[#EB6C33] transform transition-transform",
                    pathname === item.href
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            ))}
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={()=>router.push('/auth/sign-in')}
            >
              Sign In
            </Button>
            <Button className="bg-[#EB6C33] hover:bg-[#EB6C33]/90 text-white px-6"
            onClick={()=>router.push('/auth/sign-up')}>
              Get Started
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-[#EB6C33] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden absolute inset-x-0 top-full bg-[#252422]/95 backdrop-blur-md border-b border-white/10 transition-all duration-300",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors",
                pathname === item.href && "text-white bg-white/10"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="px-3 py-3 space-y-2">
          <Button
              variant="ghost"
              className="w-full text-white hover:text-white hover:bg-white/10"
              onClick={()=>router.push('/auth/sign-in')}
            >
              Sign In
            </Button>
            <Button className="w-full bg-[#EB6C33] hover:bg-[#EB6C33]/90 text-white" onClick={()=>router.push('/auth/sign-up')}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
