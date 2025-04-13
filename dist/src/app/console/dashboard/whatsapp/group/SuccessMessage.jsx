"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessMessage = SuccessMessage;
const button_1 = require("@/components/ui/button");
function SuccessMessage({ onReset }) {
    return (<div className="text-center">
            <h2 className="text-2xl font-bold text-[#EB6C33]">Group Created Successfully!</h2>
            <p className="mt-2 text-white/80">Your group has been successfully created.</p>
            <button_1.Button onClick={onReset} className="mt-4 bg-[#EB6C33] text-white">
                Create Another Group
            </button_1.Button>
        </div>);
}
