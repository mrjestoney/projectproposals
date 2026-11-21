import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="py-block">
      <EmptyState
        icon={<Compass className="size-7" />}
        title="We could not find that page"
        action={<ButtonLink href="/">Back to all projects</ButtonLink>}
      >
        The link may be wrong, or the project does not exist.
      </EmptyState>
    </div>
  );
}
