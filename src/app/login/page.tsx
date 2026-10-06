'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Dumbbell, Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      setIsLoading(false);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    }, 400);
  };

  const fillAdmin = () => {
    setEmail('admin@gmail.com');
    setPassword('admin@123');
    setError('');
  };

  const fillStaff = () => {
    setEmail('staff@gmail.com');
    setPassword('staff@123');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/60 via-slate-50 to-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* Gym Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 mb-2 transform transition-transform hover:scale-105">
            <Dumbbell className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            AGARAN FITNESS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto">
            Manage your entire gym operations seamlessly from one place.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs text-slate-600 font-medium">Remember me</span>
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Sign In to Agaran Gym
            </Button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Click to quick-fill demo credentials
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={fillAdmin}
                className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-2xl text-left transition-all active:scale-98 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-extrabold text-blue-900">Owner Demo</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <p className="text-[10px] text-blue-700 font-medium truncate">admin@gmail.com</p>
                <p className="text-[10px] text-blue-500 truncate">Pass: admin@123</p>
              </button>

              <button
                type="button"
                onClick={fillStaff}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all active:scale-98 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-extrabold text-slate-800">Staff Demo</span>
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                </div>
                <p className="text-[10px] text-slate-600 font-medium truncate">staff@gmail.com</p>
                <p className="text-[10px] text-slate-400 truncate">Pass: staff@123</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400">
          Powered by Commercial Gym OS &bull; Mobile First Design
        </p>
      </div>
    </div>
  );
}
