'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, CheckCircle, AlertCircle, Briefcase } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const TARGET_ROLES = [
  { id: 'Software Engineer', title: 'Software Engineer', icon: '💻' },
  { id: 'Fullstack Developer', title: 'Fullstack Developer', icon: '🚀' },
  { id: 'AI / ML Engineer', title: 'AI / ML Engineer', icon: '🤖' },
  { id: 'Backend Architect', title: 'Backend Architect', icon: '⚙️' },
  { id: 'DevOps & Cloud', title: 'DevOps & Cloud', icon: '☁️' },
]

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('Software Engineer')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    // Validation
    if (!name.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      // 1. Try Supabase Auth if configured
      if (isSupabaseConfigured && supabase) {
        const { data, error: sbError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
              target_role: selectedRole,
            },
          },
        })

        if (sbError) {
          throw new Error(sbError.message)
        }

        const userObj = {
          id: data.user?.id || `user_${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          targetRole: selectedRole,
          createdAt: new Date().toISOString(),
        }

        localStorage.setItem('skillpath_token', data.session?.access_token || `sp_token_${Date.now()}`)
        localStorage.setItem('skillpath_user', JSON.stringify(userObj))

        setSuccessMsg('Account created successfully in Supabase! Redirecting...')
        setTimeout(() => router.push('/onboarding'), 1000)
        return
      }

      // 2. Fallback to FastAPI Backend API (only if Supabase is not configured)
      const res = await fetch(`https://gdg-skillpath.onrender.com/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          targetRole: selectedRole,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('skillpath_token', data.token)
        localStorage.setItem('skillpath_user', JSON.stringify(data.user))
        setSuccessMsg('Account created successfully! Redirecting to onboarding...')
        setTimeout(() => router.push('/onboarding'), 1000)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setError(errorData.detail || 'Sign up failed. Please try again.')
      }
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please check your network and try again.')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-500/30 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

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
          <span className="text-slate-400 hidden sm:inline">Already have an account?</span>
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all font-medium"
          >
            Sign In
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
              Create your SkillPath Account
            </h1>
            <p className="text-sm text-slate-400">
              Join thousands of developers using AI-driven career roadmaps.
            </p>
          </div>

          {/* Error / Success Alerts */}
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
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>

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

            {/* Target Role Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                Primary Career Goal
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
                {TARGET_ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                      selectedRole === role.id
                        ? 'bg-blue-600/20 border-blue-500/60 text-blue-300'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{role.icon}</span>
                      <span>{role.title}</span>
                    </span>
                    {selectedRole === role.id && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                />
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
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
