"use client"

import DeleteConfirmationModal from "@/components/whatsapp/components/template/DeleteConfirmationModal";
import FiltersSection from "@/components/whatsapp/components/template/FiltersSection";
import HeaderSection from "@/components/whatsapp/components/template/HeaderSection";
import TemplatePopup from "@/components/whatsapp/components/template/TemplatePopup";
import TemplatesTable from "@/components/whatsapp/components/template/TemplatesTable";
import SkeletonLoader from "@/components/loader/index";
import { useTenantConfig } from '@/context/whatsapp/TenantConfigContext';
import React, { useState, useEffect } from "react";

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { tenantConfig } = useTenantConfig();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

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
    } catch (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }
  };

  // Delete template with secure headers
  const deleteTemplate = async (templateName: string) => {
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
      
      const response = await fetch(
        `${baseUrl}/api/Whatsapp/templates?name=${encodeURIComponent(templateName)}`,
        {
          method: "DELETE",
          headers: headers,
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete template");
      }
      
      return response.json();
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  };

  // Fetch templates on mount
  useEffect(() => {
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
  useEffect(() => {
    let filtered = templates;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (template) => template.category === selectedCategory
      );
    }

    // Apply language filter
    if (selectedLanguage) {
      filtered = filtered.filter(
        (template) => template.language === selectedLanguage
      );
    }

    setFilteredTemplates(filtered);
  }, [searchQuery, selectedCategory, selectedLanguage, templates]);

  // Handle template deletion
  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
      await deleteTemplate(templateToDelete);
      // Refresh the templates list after deletion
      const { data } = await fetchTemplates();
      setTemplates(data);
      setFilteredTemplates(data);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete template:", error);
      alert("Failed to delete template. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <HeaderSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <FiltersSection
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      {/* Show SkeletonLoader when loading, otherwise show TemplatesTable */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <TemplatesTable
          loading={loading}
          filteredTemplates={filteredTemplates}
          setSelectedTemplate={setSelectedTemplate}
          setTemplateToDelete={setTemplateToDelete}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
      )}

      {selectedTemplate && (
        <TemplatePopup
          templateName={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}

      <DeleteConfirmationModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDeleteTemplate={handleDeleteTemplate}
      />
    </div>
  );
};

export default TemplatesPage;