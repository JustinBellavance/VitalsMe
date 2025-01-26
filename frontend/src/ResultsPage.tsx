<<<<<<< HEAD
import Plot from 'react-plotly.js';

import Plots from './Plots.tsx'

import { useLocation } from 'react-router-dom';

import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
=======
import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
>>>>>>> 3af16a49b0395987e1eb2f787d53c0152c5c261d
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
    <div className="results-page h-screen w-screen overflow-hidden">
      {/* Main grid container */}
      <div className="grid grid-cols-4 grid-rows-4 gap-4 h-full w-full p-4">
        {/* Header spanning full width */}
        <div className="col-span-4 flex justify-center items-center">
          <h1 className="results-title app-name text-center">Vitals.me</h1>
        </div>

        <div className="col-span-1 row-span-2">
          {/* Patient info above table */}
          <div className="mb-2">
            <div className="header text-left">
              <h1 className="text-3xl font-bold">Hello, {patientData.name}</h1>
              <p className="text-sm text-gray-500">
                Age: {patientData.age} | Sex: {patientData.sex}
              </p>
            </div>
          </div>

          {/* Table with fixed height and scroll */}
          <div className="rounded-md border h-dvh">
            <div className="overflow-y-scroll h-dvh">
              <Table>
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

        {/* Results summary spanning 2 columns */}
        <div className="col-span-2 row-span-1">
          <p className="results-summary">
            Your blood test results show normal levels across key areas. No further action is needed.
          </p>
          {plotData && 
          <div style={{ width: '100%', margin: '0', overflow: 'hidden' }}>
            <Plots allFigures={plotData} />
          </div>}
          <Link to="/">
          <button className="button-secondary">Back to Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
