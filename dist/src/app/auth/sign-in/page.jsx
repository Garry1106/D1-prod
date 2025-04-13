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
const dynamic_1 = __importDefault(require("next/dynamic"));
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const auth_schema_1 = require("@/schemas/auth.schema");
const use_sign_in_1 = require("@/hooks/sign-in/use-sign-in");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const alert_1 = require("@/components/ui/alert");
const fa_1 = require("react-icons/fa");
const error_message_1 = require("@hookform/error-message");
function SignInComponent() {
    const { handleEmailSignIn, handleGoogleSignIn, error } = (0, use_sign_in_1.useCustomSignIn)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const methods = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(auth_schema_1.signInSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onChange',
    });
    const { register, handleSubmit, formState: { errors } } = methods;
    const onSubmitEmailPassword = async (data) => {
        setLoading(true);
        await handleEmailSignIn(data.email, data.password);
        setLoading(false);
    };
    return (<div className="w-full h-full flex items-center justify-center px-4 sm:px-8 lg:px-16">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Sign-In into Your Account</h2>
        <p className="text-center text-gray-600 mb-6">
          Access your account to manage your workspace and continue your journey.
        </p>

        {error && (<alert_1.Alert variant="destructive" className="mb-4">
            {error}
          </alert_1.Alert>)}

        {/* Form */}
        <react_hook_form_1.FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitEmailPassword)} className="space-y-4">
            <div>
              <label_1.Label htmlFor="email" className="text-gray-700 font-medium">Email Address</label_1.Label>
              <input_1.Input {...register('email')} id="email" type="email" placeholder="Enter your email" className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB6C33] focus:border-transparent"/>
              <error_message_1.ErrorMessage errors={errors} name="email" render={({ message }) => <p className="text-sm text-red-500">{message}</p>}/>
            </div>

            <div>
              <label_1.Label htmlFor="password" className="text-gray-700 font-medium">Password</label_1.Label>
              <input_1.Input {...register('password')} id="password" type="password" placeholder="Enter your password" className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB6C33] focus:border-transparent"/>
              <error_message_1.ErrorMessage errors={errors} name="password" render={({ message }) => <p className="text-sm text-red-500">{message}</p>}/>
            </div>

            <button_1.Button type="submit" className="w-full mt-4 bg-[#EB6C33] text-white py-3 rounded-lg hover:bg-[#f78858] transition-colors" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button_1.Button>
          </form>

          <div className="flex items-center my-2">
            <hr className="w-full border-gray-300"/>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <hr className="w-full border-gray-300"/>
          </div>

          {/* Google Sign-In Button */}
          <button_1.Button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center mb-4 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg py-3 transition-colors">
            <fa_1.FaGoogle className="w-5 h-5 mr-3"/>
            Continue with Google
          </button_1.Button>
        </react_hook_form_1.FormProvider>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <link_1.default href="/auth/sign-up" className="font-medium text-[#EB6C33] hover:underline">
            Create an account
          </link_1.default>
        </p>
      </div>
    </div>);
}
const SignIn = (0, dynamic_1.default)(() => Promise.resolve(SignInComponent), { ssr: false });
exports.default = SignIn;
