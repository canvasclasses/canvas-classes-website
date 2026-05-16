export default function AdminLanding() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-orange-400/80">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          Crucible Operator Console
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          apps/admin scaffold is up.
        </h1>
        <p className="text-white/60 leading-relaxed">
          Phase 5.1 — admin Next.js app is running on its own deployment.
          Routes, components, and admin API land here in 5.2 through 5.5.
        </p>
        <div className="pt-4 text-sm text-white/40">
          Production: <code className="text-orange-300">admin.canvasclasses.in</code>{' '}
          · Local dev: <code className="text-orange-300">:3001</code>
        </div>
      </div>
    </main>
  );
}
