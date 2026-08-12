import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailabilityBadge } from "@/components/ui/badge";

interface SiteStatusCardProps {
  siteStatus: {
    availability: string;
    message: string;
    canSubmit: boolean;
    applicationsOpen: boolean;
    applicationsPaused: boolean;
  };
}

export function SiteStatusCard({ siteStatus }: SiteStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AvailabilityBadge open={siteStatus.canSubmit} />
        <p className="text-sm text-foreground-muted">{siteStatus.message}</p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-foreground-subtle">Applications open</dt>
            <dd className="text-foreground font-medium">
              {siteStatus.applicationsOpen ? "Yes" : "No"}
            </dd>
          </div>
          <div>
            <dt className="text-foreground-subtle">Paused</dt>
            <dd className="text-foreground font-medium">
              {siteStatus.applicationsPaused ? "Yes" : "No"}
            </dd>
          </div>
          <div>
            <dt className="text-foreground-subtle">Availability</dt>
            <dd className="text-foreground font-medium capitalize">
              {siteStatus.availability.replace(/_/g, " ")}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
