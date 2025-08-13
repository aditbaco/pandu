

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground">{title}</h1>
          <p className="text-gray-500 text-sm hidden sm:block">{subtitle}</p>
        </div>
        
      </div>
    </header>
  );
}
