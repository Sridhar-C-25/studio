"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pageNumbers = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    }
    
    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
            pageNumbers.push('...');
        }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
    }
  }

  return (
    <nav className="flex items-center justify-center gap-2">
      <Link
        href={createPageURL(currentPage - 1)}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          currentPage === 1 && "pointer-events-none opacity-50"
        )}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Link>
      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <Link
            key={`${page}-${index}`}
            href={createPageURL(page)}
            className={buttonVariants({
              variant: page === currentPage ? "default" : "outline",
              size: "icon"
            })}
          >
            {page}
          </Link>
        ) : (
          <span key={`ellipsis-${index}`} className="px-2">
            {page}
          </span>
        )
      )}
      <Link
        href={createPageURL(currentPage + 1)}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          currentPage === totalPages && "pointer-events-none opacity-50"
        )}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Link>
    </nav>
  );
}
