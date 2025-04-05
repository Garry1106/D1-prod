'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ContactList } from './ContactList';
import { FileUploader } from './FileUploader';
import { toast } from 'react-toastify';


interface Contact {
    name: string;
    phone: string;
}

export function GroupForm({ onSuccess }: { onSuccess: () => void }) {
    const [groupName, setGroupName] = useState('');
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [fileName, setFileName] = useState(''); // Track the uploaded file
    const [isSubmitting, setIsSubmitting] = useState(false);
    

    // Handle file upload
    const handleFileUpload = (uploadedContacts: Contact[], file: string) => {
        setContacts(uploadedContacts);
        setFileName(file); // Save the file name for display
    };

    // Remove a specific contact
    const handleRemoveContact = (index: number) => {
        const updatedContacts = contacts.filter((_, i) => i !== index);
        setContacts(updatedContacts);

        // If no contacts remain, reset the file input field and clear memory
        if (updatedContacts.length === 0) {
            resetFileInput();
        }
    };

    // Clear all contacts
    const handleClearContacts = () => {
        setContacts([]); // Clear all contacts
        resetFileInput(); // Reset file input
        toast.info('All contacts have been removed from memory.')
    };

    // Reset the file input field and clear the file name
    const resetFileInput = () => {
        setFileName(''); // Clear file name
        const fileInput = document.getElementById('fileUploader') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = ''; // Clear the file input field
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!groupName.trim()) {
            toast.error('Please enter a group name')
            return;
        }

        if (contacts.length === 0) {
            toast.error('Please add or upload contacts before creating a group.')
            return;
        }

        for (const contact of contacts) {
            if (!contact.name.trim() || !contact.phone.trim()) {
                toast.info('Please ensure all contacts have a name and phone number')
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/Whatsapp/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupName, contacts }),
            });

            if (!response.ok) throw new Error('Failed to create group');
            toast.success('Group created successfully' )

            // Clear form after successful submission
            setGroupName('');
            setContacts([]);
            resetFileInput();

            onSuccess(); // Notify parent of success
        } catch (error) {
            toast.error('Failed to create group');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="groupName" className="text-black">Group Name</Label>
                <Input
                    id="groupName"
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="mt-1 bg-white border-[1.5px]  text-black"
                    placeholder="Enter group name"
                />
            </div>

            <FileUploader
                id="fileUploader"
                onContactsUploaded={(uploadedContacts, file) => handleFileUpload(uploadedContacts, file)}
            />

            <ContactList
                contacts={contacts}
                onAddContact={() => setContacts([...contacts, { name: '', phone: '' }])}
                onRemoveContact={handleRemoveContact}
                onContactChange={(index, field, value) => {
                    const updatedContacts = [...contacts];
                    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
                    setContacts(updatedContacts);
                }}
                onClearContacts={handleClearContacts}
            />

            <Button
                type="submit"
                className="w-full bg-[#41b658] hover:bg-[#41b658]/90 text-white"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Creating Group...' : 'Create Group'}
            </Button>
        </form>
    );
}