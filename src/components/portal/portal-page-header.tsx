interface PortalPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PortalPageHeader({ title, description, action }: PortalPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-amnii-navy sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
