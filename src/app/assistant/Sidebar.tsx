import Link from "next/link";

interface SidebarProps {
    tenantId: string;
    onChatsClick: () => void;
}

export default function Sidebar({ tenantId, onChatsClick }: SidebarProps) {
    return (
        <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 p-6">
            <h1 className="text-2xl font-bold mb-8">Chatbot App</h1>
            <ul className="space-y-4">
                <li>
                    <Link href="/dashboard" className="hover:text-blue-500 transition">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link href="/about-us" className="hover:text-blue-500 transition">
                        About Us
                    </Link>
                </li>
                <li>
                    <button
                        onClick={onChatsClick}
                        className="hover:text-blue-500 transition"
                    >
                        Chats
                    </button>
                </li>
            </ul>
        </div>
    );
}