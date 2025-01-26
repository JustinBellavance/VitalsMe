import Plot from 'react-plotly.js';
import Plots from './Plots.tsx'
import { useLocation } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const patientData = {
  name: "Bob Laiponje",
  age: 25,
  sex: "Male",
};

const testResults = [
  { vitals: "Hemoglobin (Hb) (Male)", results: "110 g/L (Ref: 125–170 g/L, Low)" },
  { vitals: "White blood cell (WBC) count", results: "6.2 x10⁹/L (Ref: 3.5–10.5, Normal)" },
  { vitals: "Fasting serum glucose", results: "5.4 mmol/L (Ref: 4.0–6.0, Normal)" },
  { vitals: "Cholesterol, total, serum", results: "4.8 mmol/L (Ref: <5.2, Normal)" },
  { vitals: "LDL Cholesterol", results: "2.9 mmol/L (Ref: <3.37, Normal)" },
  { vitals: "HDL Cholesterol", results: "1.2 mmol/L (Ref: >0.9, Normal)" },
  { vitals: "Creatinine (Male)", results: "85 µmol/L (Ref: 62–106, Normal)" },
  { vitals: "Alanine aminotransferase (ALT)", results: "30 U/L (Ref: 17–63, Normal)" },
];

const data = testResults;

const columns = [
  {
    accessorKey: "vitals",
    header: "Vitals",
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: "results",
    header: "Results",
    cell: (info: any) => info.getValue(),
  },
];

function ResultsPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const summaryRef = useRef(null);

  const fullText = "Your blood test results show normal levels across key areas. No further action is needed.";
  const previewText = fullText.substring(0, 50) + "...";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (summaryRef.current && !summaryRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const location = useLocation();
  const plotData = location.state?.plotData;

  return (
    <div className="results-page min-h-screen w-screen overflow-y-auto">
      {/* Main grid container with proper overflow */}
      <div className="grid grid-cols-4 gap-4 p-4 h-screen overflow-y-auto">
        {/* Left side content */}
        <div className="col-span-1">
          {/* Vitals.me text centered above table */}
          <h1 className="text-[#70b3b3] results-title app-name text-center mb-4">Vitals.me</h1>
          
          {/* Patient info and table */}
          <div className="mb-2">
            <div className="header text-left">
              <p className="text-3xl font-bold text-black">Hello, {patientData.name}</p>
              <p className="text-sm text-gray-800">
                {patientData.age}{patientData.sex.charAt(0).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Table container */}
          <div className="rounded-md border h-[calc(100vh-250px)]">
            <div className="h-dvh">
              <Table className="table">
                <TableHeader className="sticky top-0 bg-gray-50 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead 
                          key={header.id}
                          className="bg-gray-50 text-gray-700 font-semibold"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {testResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.vitals}</TableCell>
                      <TableCell>{result.results}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Right side content with proper overflow */}
        <div className="col-span-3 overflow-y-auto">
          <div 
            ref={summaryRef}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              results-summary bg-white rounded-lg shadow-md cursor-pointer
              transition-all duration-300 ease-in-out
              ${isExpanded ? 
                'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 z-50 p-8' : 
                'relative p-6 hover:shadow-lg'
              }
            `}
          >
            <p className="text-gray-800">
              {isExpanded ? fullText : previewText}
            </p>
            <span className="text-blue-500 text-sm mt-2 block">
              {isExpanded ? 'Show less' : 'Read more'}
            </span>
          </div>
          {plotData && 
            <div className="w-full mt-4">
              <Plots allFigures={plotData} />
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
