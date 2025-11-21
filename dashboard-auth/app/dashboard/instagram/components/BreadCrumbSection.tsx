'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
const BreadCrumbSection = () => {
     const pathname = usePathname();
      const currentCollectionName = useSelector(
    (state: RootState) => state.instagram.currentCollectionName
  );

     const getBreadcrumbPage = () => {
    if (pathname.includes("/feed")) return "Feed";
    if (pathname.includes("/save/")) return "Collection Details";
    if (pathname.includes("/save")) return "Saved";
    if (pathname.includes("/create")) return "Create";
    return "Instagram";
  };

  const getBreadcrumbItems = () => {
    const items = [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/instagram/feed", label: "Instagram" },
    ];

    if (pathname.includes("/save/")) {
      items.push({
        href: "/dashboard/instagram/save",
        label: "Saved",
      });
      items.push({
        href: pathname,
        label: currentCollectionName || "Collection",
      });
    } else {
      items.push({ href: pathname, label: getBreadcrumbPage() });
    }

    return items;
  };
  


  return <div>
     <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  {getBreadcrumbItems().map((item, index) => {
                    const isLast = index === getBreadcrumbItems().length - 1;

                    return (
                      <div key={`breadcrumb-${index}`} className="flex items-center">
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage className="text-white">
                              {item.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              href={item.href}
                              className="text-gray-400 hover:text-white"
                            >
                              {item.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>

                        {!isLast && (
                          <BreadcrumbSeparator className="text-gray-500" />
                        )}
                      </div>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
  </div>;
};

export default BreadCrumbSection;
