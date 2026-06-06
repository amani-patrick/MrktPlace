import { AlertTriangle, Shield } from "lucide-react";
import { SAFETY_TIPS, SAFETY_WARNING } from "@/config/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SafetyTips() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-2xl border border-secondary/40 bg-secondary/15 p-5 shadow-sm">
        <AlertTriangle
          className="mt-0.5 size-5 shrink-0 text-secondary-foreground"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-foreground">{SAFETY_WARNING}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SAFETY_TIPS.map((tip) => (
          <Card key={tip.title}>
            <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Shield className="size-4" aria-hidden="true" />
              </span>
              <CardTitle className="text-base">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
