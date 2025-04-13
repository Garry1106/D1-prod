"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const fa_1 = require("react-icons/fa");
const TemplateRow_1 = __importDefault(require("./TemplateRow"));
const table_1 = require("@/components/ui/table"); // Import shadcn table components
const TemplatesTable = ({ loading, filteredTemplates, setSelectedTemplate, setTemplateToDelete, setIsDeleteModalOpen, }) => {
    return (<div className="overflow-x-auto">
      <table_1.Table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <table_1.TableHeader>
          <table_1.TableRow className="border-b border-gray-300">
            <table_1.TableHead className="py-3 px-4 text-left text-black font-semibold">
              Template name
            </table_1.TableHead>
            <table_1.TableHead className="py-3 px-4 text-left text-black font-semibold">
              Category
            </table_1.TableHead>
            <table_1.TableHead className="py-3 px-4 text-left text-black font-semibold">
              Language
            </table_1.TableHead>
            <table_1.TableHead className="py-3 px-4 text-left text-black font-semibold">
              Status
            </table_1.TableHead>
            <table_1.TableHead className="py-3 px-4 text-left text-black font-semibold">
              Actions
            </table_1.TableHead>
          </table_1.TableRow>
        </table_1.TableHeader>
        <table_1.TableBody>
          {loading ? (<table_1.TableRow>
              <table_1.TableCell colSpan={5} className="py-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <fa_1.FaSpinner className="animate-spin text-whatsapp-green"/>
                  <span className="text-black">Loading templates...</span>
                </div>
              </table_1.TableCell>
            </table_1.TableRow>) : filteredTemplates.length === 0 ? (<table_1.TableRow>
              <table_1.TableCell colSpan={5} className="py-4 text-center text-black">
                No templates found.
              </table_1.TableCell>
            </table_1.TableRow>) : (filteredTemplates.map((template) => (<TemplateRow_1.default key={template.id} template={template} setSelectedTemplate={setSelectedTemplate} setTemplateToDelete={setTemplateToDelete} setIsDeleteModalOpen={setIsDeleteModalOpen}/>)))}
        </table_1.TableBody>
      </table_1.Table>
    </div>);
};
exports.default = TemplatesTable;
