import { projectConfig } from "@/config/project";

interface WlFooterProps {
  projectName?: string;
  xUrl?: string;
}

export function WlFooter({ projectName, xUrl }: WlFooterProps) {
  const name = projectName ?? projectConfig.name;
  const twitter = xUrl ?? projectConfig.xUrl;

  return (
    <footer className="relative z-20 border-t border-border-subtle/60 px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-2 text-xs text-foreground-subtle">
        <p>© {new Date().getFullYear()} {name}</p>
        <div className="flex items-center gap-3">
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-highlight transition-colors"
            >
              X / Twitter
            </a>
          )}
          <span className="text-foreground-subtle/50">·</span>
          <span>No wallet connect required</span>
        </div>
      </div>
    </footer>
  );
}
