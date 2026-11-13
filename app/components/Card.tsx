export function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-4 rounded-2xl bg-white/70 p-5 shadow-lg shadow-black/5 ring-1 ring-black/5 backdrop-blur-xl">
        <h2 className="text-base font-semibold">{title}</h2>
        {children}
      </section>
    );
  }