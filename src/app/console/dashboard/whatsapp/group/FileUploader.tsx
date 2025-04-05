'use client'
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';


interface FileUploaderProps {
    id: string; // Unique ID for the file input
    onContactsUploaded: (contacts: { name: string; phone: string }[], fileName: string) => void;
}

export function FileUploader({ id, onContactsUploaded }: FileUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (fileExtension !== 'csv') {
            toast.error('Please upload a .csv file')
            return;
        }

        setIsUploading(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            try {
                const lines = text.split('\n').filter((line) => line.trim() !== '');
                const headers = lines[0].split(',').map((header) => header.trim().toLowerCase());
                const contacts = lines.slice(1).map((line) => {
                    const values = line.split(',').map((value) => value.trim());
                    return { name: values[0] || '', phone: values[1] || '' };
                });
                onContactsUploaded(contacts, file.name); // Pass contacts and file name to parent
                toast.info('Contacts have been processed')
            } catch {
                toast.error('Failed to process file')
            } finally {
                setIsUploading(false);
            }
        };

        reader.onerror = () => {
            toast.error('Failed to read file')
            setIsUploading(false);
        };

        reader.readAsText(file);
    };

    return (
        <div className="mt-1">
            <label
                htmlFor={id}
                className="flex flex-col items-center justify-center w-full h-32 px-4 bg-white border-2 border-dashed rounded-lg"
            >
                {isUploading ? (
                    <div className="animate-spin h-6 w-6 border-2 border-[#41b658] rounded-full border-t-transparent" />
                ) : (
                    <>
                        <Upload className="w-6 h-6 text-[#41b658]" />
                        <span className="text-sm text-black/80">Drop your .csv file here, or click to browse</span>
                    </>
                )}
                <input
                    id={id}
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                />
            </label>
        </div>
    );
}