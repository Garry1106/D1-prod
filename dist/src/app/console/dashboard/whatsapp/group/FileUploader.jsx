"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploader = FileUploader;
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const react_toastify_1 = require("react-toastify");
function FileUploader({ id, onContactsUploaded }) {
    const [isUploading, setIsUploading] = (0, react_1.useState)(false);
    const handleFileUpload = async (event) => {
        var _a, _b;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        const fileExtension = (_b = file.name.split('.').pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        if (fileExtension !== 'csv') {
            react_toastify_1.toast.error('Please upload a .csv file');
            return;
        }
        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            var _a;
            const text = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            try {
                const lines = text.split('\n').filter((line) => line.trim() !== '');
                const headers = lines[0].split(',').map((header) => header.trim().toLowerCase());
                const contacts = lines.slice(1).map((line) => {
                    const values = line.split(',').map((value) => value.trim());
                    return { name: values[0] || '', phone: values[1] || '' };
                });
                onContactsUploaded(contacts, file.name); // Pass contacts and file name to parent
                react_toastify_1.toast.info('Contacts have been processed');
            }
            catch (_b) {
                react_toastify_1.toast.error('Failed to process file');
            }
            finally {
                setIsUploading(false);
            }
        };
        reader.onerror = () => {
            react_toastify_1.toast.error('Failed to read file');
            setIsUploading(false);
        };
        reader.readAsText(file);
    };
    return (<div className="mt-1">
            <label htmlFor={id} className="flex flex-col items-center justify-center w-full h-32 px-4 bg-white border-2 border-dashed rounded-lg">
                {isUploading ? (<div className="animate-spin h-6 w-6 border-2 border-[#41b658] rounded-full border-t-transparent"/>) : (<>
                        <lucide_react_1.Upload className="w-6 h-6 text-[#41b658]"/>
                        <span className="text-sm text-black/80">Drop your .csv file here, or click to browse</span>
                    </>)}
                <input id={id} type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading}/>
            </label>
        </div>);
}
