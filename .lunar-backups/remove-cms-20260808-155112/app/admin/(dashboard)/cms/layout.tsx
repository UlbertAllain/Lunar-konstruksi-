import type { ReactNode } from "react";

import { CmsWorkspaceNav } from "@/components/admin/cms/cms-workspace-nav";

export default function CmsWorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <CmsWorkspaceNav />
      {children}
    </div>
  );
}
