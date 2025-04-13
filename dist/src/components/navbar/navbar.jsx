"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navbar = Navbar;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const utils_1 = require("@/lib/utils");
const navigation = [
    { name: "Products", href: "/products" },
    { name: "Use Cases", href: "/use-cases" },
    { name: "Docs", href: "/docs" },
];
function Navbar() {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [isScrolled, setIsScrolled] = (0, react_1.useState)(false);
    const pathname = (0, navigation_1.usePathname)();
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (<nav className={(0, utils_1.cn)("fixed w-full z-40 transition-all duration-300", isScrolled
            ? "bg-[#252422]/95 backdrop-blur-md shadow-lg"
            : "bg-gradient-to-b from-black/20 to-transparent", "border-b border-white/10")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <link_1.default href="/" className="flex items-center space-x-3 group">
              <lucide_react_1.Flame className="h-9 w-9 text-[#EB6C33] transform transition-transform group-hover:rotate-12"/>
              <span className="text-2xl font-bold text-white tracking-tight">
                DuneFox
              </span>
            </link_1.default>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (<link_1.default key={item.name} href={item.href} className={(0, utils_1.cn)("text-white/90 hover:text-white transition-colors relative group", pathname === item.href && "text-white")}>
                {item.name}
                <span className={(0, utils_1.cn)("absolute inset-x-0 -bottom-1 h-0.5 bg-[#EB6C33] transform transition-transform", pathname === item.href
                ? "scale-x-100"
                : "scale-x-0 group-hover:scale-x-100")}/>
              </link_1.default>))}
            <button_1.Button variant="ghost" className="text-white hover:text-white hover:bg-white/10" onClick={() => router.push('/auth/sign-in')}>
              Sign In
            </button_1.Button>
            <button_1.Button className="bg-[#EB6C33] hover:bg-[#EB6C33]/90 text-white px-6" onClick={() => router.push('/auth/sign-up')}>
              Get Started
            </button_1.Button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white hover:text-[#EB6C33] transition-colors" aria-label="Toggle menu">
            {isOpen ? <lucide_react_1.X className="h-6 w-6"/> : <lucide_react_1.Menu className="h-6 w-6"/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={(0, utils_1.cn)("md:hidden absolute inset-x-0 top-full bg-[#252422]/95 backdrop-blur-md border-b border-white/10 transition-all duration-300", isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none")}>
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (<link_1.default key={item.name} href={item.href} className={(0, utils_1.cn)("block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors", pathname === item.href && "text-white bg-white/10")} onClick={() => setIsOpen(false)}>
              {item.name}
            </link_1.default>))}
          <div className="px-3 py-3 space-y-2">
          <button_1.Button variant="ghost" className="w-full text-white hover:text-white hover:bg-white/10" onClick={() => router.push('/auth/sign-in')}>
              Sign In
            </button_1.Button>
            <button_1.Button className="w-full bg-[#EB6C33] hover:bg-[#EB6C33]/90 text-white" onClick={() => router.push('/auth/sign-up')}>
              Get Started
            </button_1.Button>
          </div>
        </div>
      </div>
    </nav>);
}
