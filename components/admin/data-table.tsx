"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, SearchField, Table } from "@heroui/react";
import { cn } from "@/lib/utils";

/* ================== TYPES ================== */

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: T[keyof T] | undefined, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  itemsPerPage?: number;
  onRowClick?: (row: T) => void;
}

/* ================== COMPONENT ================== */

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Rechercher...",
  actionButton,
  itemsPerPage = 5,
  onRowClick,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-gray-50">
        <SearchField
          className="flex-1"
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder={searchPlaceholder} />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        {actionButton && (
          <Button
            variant="primary"
            className="bg-[#2d2d83] rounded-xl px-5"
            onPress={actionButton.onClick}
          >
            {actionButton.label}
          </Button>
        )}
      </div>

      {/* TABLE */}
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Tableau de données" className="min-w-[600px]">
            <Table.Header>
              {columns.map((column) => (
                <Table.Column key={String(column.key)} isRowHeader={column.key === columns[0]?.key}>
                  {column.label}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {paginatedData.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={columns.length} className="text-center text-gray-400 py-12">
                    Aucune donnée disponible
                  </Table.Cell>
                </Table.Row>
              ) : (
                paginatedData.map((row, i) => (
                  <Table.Row
                    key={i}
                    className={cn(onRowClick && "cursor-pointer")}
                    onAction={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((column) => {
                      const value =
                        typeof column.key === "string"
                          ? (row as any)[column.key]
                          : row[column.key];

                      return (
                        <Table.Cell key={String(column.key)}>
                          {column.render
                            ? column.render(value, row)
                            : (value as React.ReactNode)}
                        </Table.Cell>
                      );
                    })}
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      {/* PAGINATION */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
        <span className="text-sm text-gray-500">
          {filteredData.length > 0
            ? `${startIndex + 1}-${Math.min(startIndex + itemsPerPage, filteredData.length)} sur ${filteredData.length}`
            : "0 résultat"}
        </span>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg"
            isDisabled={currentPage === 1}
            onPress={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg"
            isDisabled={currentPage === totalPages}
            onPress={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
