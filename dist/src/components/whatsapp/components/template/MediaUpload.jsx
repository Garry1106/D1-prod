"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const fa_1 = require("react-icons/fa");
const MediaUpload = ({ activeMediaTab, mediaFile, setMediaFile, }) => {
    const handleMediaUpload = (e) => {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            setMediaFile(file);
        }
    };
    const handleRemoveMedia = () => {
        setMediaFile(null);
    };
    const handleReplaceMedia = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept =
            activeMediaTab === "image"
                ? "image/*"
                : activeMediaTab === "video"
                    ? "video/*"
                    : activeMediaTab === "document"
                        ? ".pdf,.doc,.docx"
                        : "";
        input.onchange = (e) => {
            var _a;
            const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file) {
                handleMediaUpload(e);
            }
        };
        input.click();
    };
    return (<div className="mb-6">
      {mediaFile ? (<div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-sm text-gray-700 break-all">
            {mediaFile.name}
          </span>
          <div className="flex gap-2">
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200" onClick={handleRemoveMedia}>
              <fa_1.FaTrash className="text-sm text-red-500"/>
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200" onClick={handleReplaceMedia}>
              <fa_1.FaExchangeAlt className="text-sm text-blue-500"/>
            </button>
          </div>
        </div>) : (<div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
          <input type="file" accept={activeMediaTab === "image"
                ? "image/*"
                : activeMediaTab === "video"
                    ? "video/*"
                    : activeMediaTab === "document"
                        ? ".pdf,.doc,.docx"
                        : ""} onChange={handleMediaUpload} className="hidden" id="media-upload"/>
          <label htmlFor="media-upload" className="text-sm text-gray-700 cursor-pointer text-center">
            Click to upload or drag and drop
          </label>
        </div>)}
    </div>);
};
exports.default = MediaUpload;
