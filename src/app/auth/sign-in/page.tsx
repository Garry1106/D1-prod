"use client";

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInFormProps } from '@/schemas/auth.schema';
import { useCustomSignIn } from '@/hooks/sign-in/use-sign-in';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { FaGoogle } from 'react-icons/fa';
import { ErrorMessage } from '@hookform/error-message';

function SignInComponent() {
  const { handleEmailSignIn, handleGoogleSignIn, error } = useCustomSignIn();
  const [loading, setLoading] = useState(false);

  const methods = useForm<SignInFormProps>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const { register, handleSubmit, formState: { errors } } = methods;

  const onSubmitEmailPassword = async (data: SignInFormProps) => {
    setLoading(true);
    await handleEmailSignIn(data.email, data.password);
    setLoading(false);
  };

  return (
    <div className="w-full h-full flex items-center justify-center px-4 sm:px-8 lg:px-16">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Sign-In into Your Account</h2>
        <p className="text-center text-gray-600 mb-6">
          Access your account to manage your workspace and continue your journey.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitEmailPassword)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB6C33] focus:border-transparent"
              />
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => <p className="text-sm text-red-500">{message}</p>}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <Input
                {...register('password')}
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB6C33] focus:border-transparent"
              />
              <ErrorMessage
                errors={errors}
                name="password"
                render={({ message }) => <p className="text-sm text-red-500">{message}</p>}
              />
            </div>

            <Button type="submit" className="w-full mt-4 bg-[#EB6C33] text-white py-3 rounded-lg hover:bg-[#f78858] transition-colors" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="flex items-center my-2">
            <hr className="w-full border-gray-300" />
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <hr className="w-full border-gray-300" />
          </div>

          {/* Google Sign-In Button */}
          <Button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center mb-4 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg py-3 transition-colors"
          >
            <FaGoogle className="w-5 h-5 mr-3" />
            Continue with Google
          </Button>
        </FormProvider>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <Link href="/auth/sign-up" className="font-medium text-[#EB6C33] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

const SignIn = dynamic(() => Promise.resolve(SignInComponent), { ssr: false });

export default SignIn;