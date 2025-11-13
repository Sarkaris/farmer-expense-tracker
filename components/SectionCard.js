export default function SectionCard({ title, description, action, children, id }) {
  return (
    <section id={id} className="card-surface space-y-5 p-6 md:p-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-heading text-xl font-semibold">{title}</h2>
          {description ? <p className="text-sm text-muted">{description}</p> : null}
        </div>
        {action || null}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

