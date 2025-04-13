"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsSidebar = DocsSidebar;
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const utils_1 = require("@/lib/utils");
const lucide_react_1 = require("lucide-react");
const products = [
    {
        name: "Web Chatbots",
        href: "/docs/web-chatbots",
        icon: lucide_react_1.MessageSquare,
        description: "Implement AI-powered chat on your website",
    },
    {
        name: "WhatsApp Bots",
        href: "/docs/whatsapp-bots",
        icon: lucide_react_1.Bot,
        description: "Automate WhatsApp business messaging",
    },
    {
        name: "Call Bots",
        href: "/docs/call-bots",
        icon: lucide_react_1.Phone,
        description: "Voice automation solutions",
    },
    {
        name: "Analytics Dashboard",
        href: "/docs/analytics",
        icon: lucide_react_1.BarChart,
        description: "Track and analyze performance",
    },
];
function DocsSidebar() {
    const pathname = (0, navigation_1.usePathname)();
    return (<nav className="space-y-2 sticky top-0 h-screen border-r-2 border-[#EB6C33]" // Full height with orange border
    >
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[#403D39] px-2 py-2">
          Products
        </h2>
      </div>
      {products.map((product, index) => {
            const isActive = pathname === product.href;
            return (<div key={product.href}>
            <link_1.default href={product.href} className={(0, utils_1.cn)("flex items-start gap-3 px-3 py-2 rounded-lg transition-colors", "hover:bg-[#EB6C33]/10 hover:text-[#EB6C33]", isActive && "bg-[#EB6C33]/10 text-[#EB6C33]", !isActive && "text-[#403D39]", "w-full" // Ensures all links have equal width
                )} style={{ minHeight: "50 px" }} // Ensures consistent height for all links
            >
              <product.icon className="h-5 w-5 mt-0.5 flex-shrink-0"/>
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-[#403D39]/80">
                  {product.description}
                </div>
              </div>
            </link_1.default>
            {index < products.length - 1 && <br />}{" "}
            {/* Add <br /> after each product except the last */}
          </div>);
        })}
    </nav>);
}
