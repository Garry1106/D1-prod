"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DeleteConfirmationModal_1 = __importDefault(require("@/components/whatsapp/components/template/DeleteConfirmationModal"));
const FiltersSection_1 = __importDefault(require("@/components/whatsapp/components/template/FiltersSection"));
const HeaderSection_1 = __importDefault(require("@/components/whatsapp/components/template/HeaderSection"));
const TemplatePopup_1 = __importDefault(require("@/components/whatsapp/components/template/TemplatePopup"));
const TemplatesTable_1 = __importDefault(require("@/components/whatsapp/components/template/TemplatesTable"));
const index_1 = __importDefault(require("@/components/loader/index"));
const TenantConfigContext_1 = require("@/context/whatsapp/TenantConfigContext");
const react_1 = __importStar(require("react"));
const TemplatesPage = () => {
    const [templates, setTemplates] = (0, react_1.useState)([]);
    const [filteredTemplates, setFilteredTemplates] = (0, react_1.useState)([]);
    const [selectedTemplate, setSelectedTemplate] = (0, react_1.useState)(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = (0, react_1.useState)(false);
    const [templateToDelete, setTemplateToDelete] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const { tenantConfig } = (0, TenantConfigContext_1.useTenantConfig)();
    // Search and filter states
    const [searchQuery, setSearchQuery] = (0, react_1.useState)("");
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)("");
    const [selectedLanguage, setSelectedLanguage] = (0, react_1.useState)("");
    // Fetch templates with secure headers
    const fetchTemplates = async () => {
        try {
            if (!tenantConfig || !tenantConfig.waba_id || !tenantConfig.accessToken) {
                throw new Error("Tenant configuration is missing");
            }
            const baseUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
            // Create headers with authentication credentials
            const headers = new Headers({
                'x-waba-id': tenantConfig.waba_id,
                'x-access-token': tenantConfig.accessToken,
                'Content-Type': 'application/json'
            });
            const response = await fetch(`${baseUrl}/api/Whatsapp/templates`, {
                cache: "no-store",
                headers: headers,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch templates");
            }
            return response.json();
        }
        catch (error) {
            console.error("Error fetching templates:", error);
            throw error;
        }
    };
    // Delete template with secure headers
    const deleteTemplate = async (templateName) => {
        try {
            if (!tenantConfig || !tenantConfig.waba_id || !tenantConfig.accessToken) {
                throw new Error("Tenant configuration is missing");
            }
            const baseUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
            // Create headers with authentication credentials
            const headers = new Headers({
                'x-waba-id': tenantConfig.waba_id,
                'x-access-token': tenantConfig.accessToken,
                'Content-Type': 'application/json'
            });
            const response = await fetch(`${baseUrl}/api/Whatsapp/templates?name=${encodeURIComponent(templateName)}`, {
                method: "DELETE",
                headers: headers,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete template");
            }
            return response.json();
        }
        catch (error) {
            console.error("Error deleting template:", error);
            throw error;
        }
    };
    // Fetch templates on mount
    (0, react_1.useEffect)(() => {
        if (tenantConfig) {
            fetchTemplates()
                .then(({ data }) => {
                setTemplates(data);
                setFilteredTemplates(data);
                setLoading(false);
            })
                .catch((error) => {
                console.error("Failed to fetch templates:", error);
                setLoading(false);
            });
        }
    }, [tenantConfig]);
    // Apply filters and search
    (0, react_1.useEffect)(() => {
        let filtered = templates;
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter((template) => template.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        // Apply category filter
        if (selectedCategory) {
            filtered = filtered.filter((template) => template.category === selectedCategory);
        }
        // Apply language filter
        if (selectedLanguage) {
            filtered = filtered.filter((template) => template.language === selectedLanguage);
        }
        setFilteredTemplates(filtered);
    }, [searchQuery, selectedCategory, selectedLanguage, templates]);
    // Handle template deletion
    const handleDeleteTemplate = async () => {
        if (!templateToDelete)
            return;
        try {
            await deleteTemplate(templateToDelete);
            // Refresh the templates list after deletion
            const { data } = await fetchTemplates();
            setTemplates(data);
            setFilteredTemplates(data);
            setIsDeleteModalOpen(false);
        }
        catch (error) {
            console.error("Failed to delete template:", error);
            alert("Failed to delete template. Please try again.");
        }
    };
    return (<div className="bg-white min-h-screen p-6">
      <HeaderSection_1.default searchQuery={searchQuery} onSearchChange={setSearchQuery}/>

      <FiltersSection_1.default selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage}/>

      {/* Show SkeletonLoader when loading, otherwise show TemplatesTable */}
      {loading ? (<index_1.default />) : (<TemplatesTable_1.default loading={loading} filteredTemplates={filteredTemplates} setSelectedTemplate={setSelectedTemplate} setTemplateToDelete={setTemplateToDelete} setIsDeleteModalOpen={setIsDeleteModalOpen}/>)}

      {selectedTemplate && (<TemplatePopup_1.default templateName={selectedTemplate} onClose={() => setSelectedTemplate(null)}/>)}

      <DeleteConfirmationModal_1.default isDeleteModalOpen={isDeleteModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen} handleDeleteTemplate={handleDeleteTemplate}/>
    </div>);
};
exports.default = TemplatesPage;
