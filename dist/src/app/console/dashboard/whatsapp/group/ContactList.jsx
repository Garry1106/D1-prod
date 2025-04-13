"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactList = ContactList;
const button_1 = require("@/components/ui/button");
const ContactInput_1 = require("./ContactInput");
function ContactList({ contacts, onAddContact, onRemoveContact, onContactChange, onClearContacts, }) {
    return (<div className="space-y-4 text-black">
            <div className="flex items-center justify-between">
                <label className="text-black">Manual Contact Entry</label>
                <div className="flex gap-2">
                    <button_1.Button onClick={onAddContact} variant="outline" className="bg-[#41b658] hover:bg-[#41b658]/80 hover:text-white text-white">
                        Add Contact
                    </button_1.Button>
                    <button_1.Button onClick={onClearContacts} variant="outline" className="bg-[#41b658] hover:bg-[#41b658]/80 hover:text-white text-white">
                        Clear All
                    </button_1.Button>
                </div>
            </div>

            {contacts.length === 0 ? (<p className="text-sm text-black/60">No contacts added yet. Add contacts manually or upload a file.</p>) : (contacts.map((contact, index) => (<div key={index} className="text-black/80">
                        <ContactInput_1.ContactInput contact={contact} onChange={(field, value) => onContactChange(index, field, value)} // Explicitly pass index
         onRemove={() => onRemoveContact(index)} // Explicitly pass index
        />
                    </div>)))}
        </div>);
}
