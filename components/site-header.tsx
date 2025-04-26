"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const path = pathname.split("?")[0];
    const segments = path.split("/").filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");

      const label = segment
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());

      return { href, label };
    });

    return segments.length > 0 && segments[0] !== "dashboard"
      ? [{ href: "/dashboard", label: "Dashboard" }, ...breadcrumbs]
      : breadcrumbs.length
      ? breadcrumbs
      : [{ href: "/dashboard", label: "Dashboard" }];
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                )}
                <Link
                  href={breadcrumb.href}
                  className={
                    index === breadcrumbs.length - 1
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground transition-colors"
                  }
                >
                  {breadcrumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
