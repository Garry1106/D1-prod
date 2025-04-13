"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const MediaReview = ({ activeMediaTab, mediaFile, }) => {
    return (<div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Media</h3>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        {mediaFile ? (<div className="flex items-center gap-4">
            <div className="w-20 h-20 flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden">
              {activeMediaTab === "image" && (<img src={URL.createObjectURL(mediaFile)} alt="Uploaded Media" className="w-full h-full object-cover"/>)}
              {activeMediaTab === "video" && (<video src={URL.createObjectURL(mediaFile)} className="w-full h-full object-cover"/>)}
              {activeMediaTab === "document" && (<div className="p-2 bg-gray-100 rounded-lg">
                  <span className="text-gray-700 text-sm">
                    {mediaFile.name}
                  </span>
                </div>)}
            </div>
            <div>
              <p>
                <strong>File Name:</strong> {mediaFile.name}
              </p>
              <p>
                <strong>File Type:</strong> {mediaFile.type}
              </p>
            </div>
          </div>) : (<p>No media uploaded.</p>)}
      </div>
    </div>);
};
exports.default = MediaReview;
