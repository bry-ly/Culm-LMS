"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { courseCategory, courseLevels } from "@/lib/zodSchemas";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [level, setLevel] = useState(searchParams.get("level") || "all");
  const [priceType, setPriceType] = useState(searchParams.get("priceType") || "all");

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === "" || value === "all") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const applyFilters = () => {
    startTransition(() => {
      const queryString = createQueryString({
        search,
        category,
        level,
        priceType,
      });
      router.push(`/courses${queryString ? `?${queryString}` : ""}`);
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setLevel("all");
    setPriceType("all");
    startTransition(() => {
      router.push("/courses");
    });
  };

  const hasFilters =
    search !== "" || category !== "all" || level !== "all" || priceType !== "all";

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters();
              }
            }}
            className="pl-10"
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {courseCategory.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {courseLevels.map((lvl) => (
              <SelectItem key={lvl} value={lvl}>
                {lvl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceType} onValueChange={setPriceType}>
          <SelectTrigger className="w-full md:w-[130px]">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters} disabled={isPending}>
          {isPending ? "Searching..." : "Apply Filters"}
        </Button>
        {hasFilters && (
          <Button variant="outline" onClick={clearFilters} disabled={isPending}>
            <X className="size-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
