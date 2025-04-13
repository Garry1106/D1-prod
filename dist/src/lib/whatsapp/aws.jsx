"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMedia = exports.parseS3Reference = exports.isS3Reference = void 0;
// src/utils/aws.tsx
const react_1 = __importDefault(require("react"));
// Helper function to detect if the message contains an S3 reference
const isS3Reference = (text) => {
    var _a;
    const parts = text.trim().split(',');
    if (parts.length !== 3) {
        return false;
    }
    const [bucketName, region, key] = parts;
    // Basic validation to ensure none of the parts are empty
    if (!bucketName || !region || !key) {
        return false;
    }
    // Optionally validate the AWS region
    const awsRegions = [
        'us-east-1',
        'us-east-2',
        'us-west-1',
        'us-west-2',
        'ap-south-1',
        // Add other regions as needed
    ];
    if (!awsRegions.includes(region)) {
        return false;
    }
    // Validate the key (ensure it has at least one '/' and a valid file extension)
    const keyParts = key.split('/');
    if (keyParts.length < 1) {
        return false;
    }
    const fileName = keyParts[keyParts.length - 1];
    const fileExtension = (_a = fileName.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    const validExtensions = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'mp4',
        'avi',
        'mkv',
        'mov',
        'webm',
        'mp3',
        'wav',
        'ogg',
        'pdf',
        'doc',
        'docx',
        'txt',
        'xlsx',
        'pptx',
        'webp',
    ];
    if (!fileExtension || !validExtensions.includes(fileExtension)) {
        return false;
    }
    return true;
};
exports.isS3Reference = isS3Reference;
// Function to parse the S3 reference and return the details
const parseS3Reference = (text) => {
    const [bucketName, region, key] = text.trim().split(',');
    return { bucketName, region, key };
};
exports.parseS3Reference = parseS3Reference;
// Function to render the media based on the file extension
const renderMedia = (signedUrl, originalText) => {
    var _a;
    const { key } = (0, exports.parseS3Reference)(originalText);
    const fileExtension = (_a = key.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoExtensions = ['mp4', 'avi', 'mkv', 'mov', 'webm'];
    const audioExtensions = ['mp3', 'wav', 'ogg'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'xlsx', 'pptx'];
    if (fileExtension && imageExtensions.includes(fileExtension)) {
        return (<div className="cursor-pointer">
        <img src={signedUrl} alt="Image" className="max-w-xs max-h-48 object-cover rounded"/>
      </div>);
    }
    else if (fileExtension && videoExtensions.includes(fileExtension)) {
        return (<div className="cursor-pointer">
        <video controls autoPlay className="max-w-xs max-h-48 object-cover rounded">
          <source src={signedUrl} type={`video/${fileExtension}`}/>
          Your browser does not support the video tag.
        </video>
      </div>);
    }
    else if (fileExtension && audioExtensions.includes(fileExtension)) {
        return (<div className="cursor-pointer">
        <audio controls className="w-48">
          <source src={signedUrl} type={`audio/${fileExtension}`}/>
          Your browser does not support the audio element.
        </audio>
      </div>);
    }
    else if (fileExtension && documentExtensions.includes(fileExtension)) {
        return (<a href={signedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
        View Document
      </a>);
    }
    else {
        return (<a href={signedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
        Download File
      </a>);
    }
};
exports.renderMedia = renderMedia;
