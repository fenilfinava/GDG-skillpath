import './globals.css'

export const metadata = {
  title: 'SkillPath | AI Career & Learning Platform',
  description: 'AI-driven learning roadmaps from your resume',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
      </head>
      <body className={`font-sans bg-slate-900 text-slate-100 min-h-screen selection:bg-blue-500/30 selection:text-blue-200`}>
        {children}
      </body>
    </html>
  )
}
