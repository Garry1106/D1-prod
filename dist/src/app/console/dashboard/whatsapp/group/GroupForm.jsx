"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupForm = GroupForm;
const react_1 = require("react");
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
const label_1 = require("@/components/ui/label");
const ContactList_1 = require("./ContactList");
const FileUploader_1 = require("./FileUploader");
const react_toastify_1 = require("react-toastify");
function GroupForm({ onSuccess }) {
    const [groupName, setGroupName] = (0, react_1.useState)('');
    const [contacts, setContacts] = (0, react_1.useState)([]);
    const [fileName, setFileName] = (0, react_1.useState)(''); // Track the uploaded file
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    // Handle file upload
    const handleFileUpload = (uploadedContacts, file) => {
        setContacts(uploadedContacts);
        setFileName(file); // Save the file name for display
    };
    // Remove a specific contact
    const handleRemoveContact = (index) => {
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
        react_toastify_1.toast.info('All contacts have been removed from memory.');
    };
    // Reset the file input field and clear the file name
    const resetFileInput = () => {
        setFileName(''); // Clear file name
        const fileInput = document.getElementById('fileUploader');
        if (fileInput) {
            fileInput.value = ''; // Clear the file input field
        }
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) {
            react_toastify_1.toast.error('Please enter a group name');
            return;
        }
        if (contacts.length === 0) {
            react_toastify_1.toast.error('Please add or upload contacts before creating a group.');
            return;
        }
        for (const contact of contacts) {
            if (!contact.name.trim() || !contact.phone.trim()) {
                react_toastify_1.toast.info('Please ensure all contacts have a name and phone number');
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
            if (!response.ok)
                throw new Error('Failed to create group');
            react_toastify_1.toast.success('Group created successfully');
            // Clear form after successful submission
            setGroupName('');
            setContacts([]);
            resetFileInput();
            onSuccess(); // Notify parent of success
        }
        catch (error) {
            react_toastify_1.toast.error('Failed to create group');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label_1.Label htmlFor="groupName" className="text-black">Group Name</label_1.Label>
                <input_1.Input id="groupName" type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="mt-1 bg-white border-[1.5px]  text-black" placeholder="Enter group name"/>
            </div>

            <FileUploader_1.FileUploader id="fileUploader" onContactsUploaded={(uploadedContacts, file) => handleFileUpload(uploadedContacts, file)}/>

            <ContactList_1.ContactList contacts={contacts} onAddContact={() => setContacts([...contacts, { name: '', phone: '' }])} onRemoveContact={handleRemoveContact} onContactChange={(index, field, value) => {
            const updatedContacts = [...contacts];
            updatedContacts[index] = Object.assign(Object.assign({}, updatedContacts[index]), { [field]: value });
            setContacts(updatedContacts);
        }} onClearContacts={handleClearContacts}/>

            <button_1.Button type="submit" className="w-full bg-[#41b658] hover:bg-[#41b658]/90 text-white" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Group...' : 'Create Group'}
            </button_1.Button>
        </form>);
}
