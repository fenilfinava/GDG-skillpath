'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)

    try {
      // 1. Try Supabase Auth if configured
      if (isSupabaseConfigured && supabase) {
        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (sbError) {
          throw new Error(sbError.message)
        }

        const fullName = data.user?.user_metadata?.full_name || email.split('@')[0]
        const targetRole = data.user?.user_metadata?.target_role || 'Software Engineer'

        const userObj = {
          id: data.user?.id || `user_${Date.now()}`,
          name: fullName,
          email: email.trim(),
          targetRole,
          createdAt: new Date().toISOString(),
        }

        localStorage.setItem('skillpath_token', data.session?.access_token || `sp_token_${Date.now()}`)
        localStorage.setItem('skillpath_user', JSON.stringify(userObj))

        setSuccessMsg('Logged in successfully via Supabase! Redirecting...')
        setTimeout(() => router.push('/dashboard'), 1000)
        return
      }

      // 2. Fallback to FastAPI Backend API (only if Supabase is not configured)
      const res = await fetch(`https://gdg-skillpath.onrender.com/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('skillpath_token', data.token)
        localStorage.setItem('skillpath_user', JSON.stringify(data.user))
        setSuccessMsg('Logged in successfully! Redirecting to dashboard...')
        setTimeout(() => router.push('/dashboard'), 1000)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setError(errorData.detail || 'Invalid email or password.')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-500/30 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Skill<span className="text-gradient">Path</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-400 hidden sm:inline">Don't have an account?</span>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-500/20 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto px-6 py-8 z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-black/50"
        >
          {/* Header text */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-slate-400">
              Sign in to access your custom AI learning roadmap and career dashboard.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-slate-600 z-10">
        © {new Date().getFullYear()} SkillPath. Powered by Gemini 2.5 & FastAPI.
      </footer>
    </div>
  )
}
