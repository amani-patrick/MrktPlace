interface PortalPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PortalPageHeader({ title, description, action }: PortalPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
