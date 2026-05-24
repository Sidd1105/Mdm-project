import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        {/* Grid background */}
        <div className="fixed inset-0 ml-64 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
        {/* Top glow */}
        <div className="fixed top-0 left-64 right-0 h-64 bg-glow-green pointer-events-none" />
        <div className="relative z-10 p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
