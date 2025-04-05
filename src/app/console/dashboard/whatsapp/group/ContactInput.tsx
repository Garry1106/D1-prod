'use client'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ContactInputProps {
    contact: { name: string; phone: string };
    onChange: (field: 'name' | 'phone', value: string) => void;
    onRemove: () => void;
}

export function ContactInput({ contact, onChange, onRemove }: ContactInputProps) {
    return (
        <div className="flex gap-2">
            <Input
                type="text"
                value={contact.name}
                onChange={(e) => onChange('name', e.target.value)} // Pass field and value
                placeholder="Name"
                className="bg-white text-black" // Removed border color
            />
            <Input
                type="text"
                value={contact.phone}
                onChange={(e) => onChange('phone', e.target.value)} // Pass field and value
                placeholder="Phone"
                className="bg-white text-black" // Removed border color
            />
            <Button
                type="button"
                onClick={onRemove} // No index required here
                variant="outline"
                className="text-[#41b658] hover:bg-[#41b658] hover:text-white" // Removed border color
            >
                Remove
            </Button>
        </div>
    );
}