"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const mongodb_1 = __importStar(require("@/lib/mongodb"));
async function POST(request) {
    try {
        const body = await request.json();
        const { waId, responseMode, businessPhoneNumber } = body;
        console.log("waId in Update Response mode", waId);
        console.log("Response in Update Response mode", responseMode);
        console.log("BusinessPhoneNumber in Update Response mode", businessPhoneNumber);
        if (!waId || !responseMode || !businessPhoneNumber) {
            return server_1.NextResponse.json({ success: false, error: "waId, responseMode, and businessPhoneNumber are required." }, { status: 400 });
        }
        await (0, mongodb_1.default)();
        const db = await (0, mongodb_1.getTenantDatabase)(businessPhoneNumber);
        const chatsCollection = db.collection("chats");
        const chatExists = await chatsCollection.findOne({ wa_id: String(waId) });
        if (!chatExists) {
            return server_1.NextResponse.json({ success: false, error: "No chat found with the provided waId." }, { status: 404 });
        }
        await chatsCollection.updateOne({ wa_id: String(waId) }, { $set: { responseMode } });
        return server_1.NextResponse.json({
            success: true,
            message: `Response mode updated to ${responseMode} for user ${waId}.`,
        });
    }
    catch (error) {
        console.error("Error in POST /api/Whatsapp/update-response-mode:", error);
        return server_1.NextResponse.json({ success: false, error: "Failed to update response mode." }, { status: 500 });
    }
}
