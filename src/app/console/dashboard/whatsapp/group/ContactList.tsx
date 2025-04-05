import { Button } from '@/components/ui/button';
import { ContactInput } from './ContactInput';

interface Contact {
    name: string;
    phone: string;
}

interface ContactListProps {
    contacts: Contact[];
    onAddContact: () => void;
    onRemoveContact: (index: number) => void;
    onContactChange: (index: number, field: 'name' | 'phone', value: string) => void;
    onClearContacts: () => void;
}

export function ContactList({
    contacts,
    onAddContact,
    onRemoveContact,
    onContactChange,
    onClearContacts,
}: ContactListProps) {
    return (
        <div className="space-y-4 text-black">
            <div className="flex items-center justify-between">
                <label className="text-black">Manual Contact Entry</label>
                <div className="flex gap-2">
                    <Button onClick={onAddContact} variant="outline"  className="bg-[#41b658] hover:bg-[#41b658]/80 hover:text-white text-white">
                        Add Contact
                    </Button>
                    <Button onClick={onClearContacts} variant="outline" className="bg-[#41b658] hover:bg-[#41b658]/80 hover:text-white text-white">
                        Clear All
                    </Button>
                </div>
            </div>

            {contacts.length === 0 ? (
                <p className="text-sm text-black/60">No contacts added yet. Add contacts manually or upload a file.</p>
            ) : (
                contacts.map((contact, index) => (
                    <div key={index} className="text-black/80">
                        <ContactInput
                            contact={contact}
                            onChange={(field, value) => onContactChange(index, field, value)} // Explicitly pass index
                            onRemove={() => onRemoveContact(index)} // Explicitly pass index
                        />
                    </div>
                ))
            )}
        </div>
    );
}
