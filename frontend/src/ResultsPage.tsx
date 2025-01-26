import Plot from 'react-plotly.js';
import Plots from './Plots.tsx'
import { useLocation, Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
import { Maximize, Minimize, Send } from '@mynaui/icons-react';
import vitalsme from './assets/vitalsss.png';

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
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

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
  var all_data = location.state?.plotData;
  var plotData = undefined;
  var ai_response = undefined;
  var personal_info = undefined;
  var user_results = undefined;
  
  if (all_data !== undefined){
    var plotData = all_data['all_figures'];
    var ai_response = all_data['ai_response'];
    var personal_info = all_data['personal_info'];
    var user_results = all_data['user_results'];
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChatHistory([...chatHistory, { text: message, sender: 'user' }]);
      setMessage('');
      // Add API call to chatbot here

      try {
        const response = await fetch('http://localhost:5000/chat', {
          method: 'POST',
          body: message,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("CHAT RESULTS ", data)
        } else {
          alert('Failed to process the file.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    if (message.trim()) {
      setChatHistory([...chatHistory, { text: message, sender: 'user' }]);
      setMessage('');
    }
  };

  const handleChatInput = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setMessage(e.target.value);
  };

  return (
    <div className="results-page min-h-screen w-screen overflow-auto">
      <div className="grid grid-cols-4 gap-4 p-4 h-screen">
        {/* Left column */}
        <div className="col-span-1">
          {/* Centered Logo Container */}
          <div className="flex justify-center mb-8">
            <Link to="/">
              <img 
                src={vitalsme} 
                alt="Vitals.me Logo"
                className="h-20 w-50 object-contain transition-transform duration-300 hover:scale-105 cursor-pointer" 
              />
            </Link>
          </div>
          
          {/* Patient info and table */}
          <div className="mb-2">
            <div className="header text-left">
              <p className="text-3xl font-bold text-black">Hello, {personal_info[0][1]}</p>
              <p className="text-sm text-gray-800">
                {personal_info[1][1]}{personal_info[2][1].charAt(0).toUpperCase()}
              </p>
              <p className="text-sm text-gray-800">
              Test performed on the {personal_info[3][1]}
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
                  {user_results.slice(1).map((result, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{result[0]}</TableCell>
                        <TableCell>{result[2] + ' ' + result[4]}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-3 flex flex-col h-full">
          {/* Base Summary Container */}
          <div className="bg-white rounded-lg p-6 relative mb-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100"
            >
              <div className="w-6 h-6 text-gray-600">
                {isExpanded ? (
                  <Minimize width={24} height={24} stroke="#4B5563" />
                ) : (
                  <Maximize width={24} height={24} stroke="#4B5563" />
                )}
              </div>
            </button>

            {!isExpanded && (
              <p className="text-gray-800 pl-12">
                <ReactMarkdown>

                {ai_response}
                </ReactMarkdown>

                </p>
            )}
          </div>

          {/* Scrollable Plots Container */}
          {!isExpanded && plotData && (
            <div className="flex-1 overflow-y-auto p-4">
              <Plots allFigures={plotData} />
            </div>
          )}

          {/* Expanded State */}
          {isExpanded && (
            <>
              <div className="fixed inset-0 bg-black/50 z-40" />
              <div className="fixed inset-0 z-50 bg-white p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto h-full flex flex-col">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100"
                  >
                    <div className="w-6 h-6 text-gray-600">
                      <Minimize width={24} height={24} stroke="#4B5563" />
                    </div>
                  </button>
                  <h2 className="text-2xl font-bold mb-6 mt-12 pl-12">Results Summary</h2>
                  <p className="text-gray-800 mb-8">                
                    <ReactMarkdown>
                      {ai_response}
                    </ReactMarkdown>
                  </p>

                  {/* Chat History */}
                  <div className="flex-grow overflow-y-scroll mb-4 px-4">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          chat.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-600'
                        }`}>
                          <ReactMarkdown>
                            {chat.message}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (message.trim()) {
                        setChatHistory([...chatHistory, { message, sender: 'user' }]);
                        setMessage('');

                        try {
                          const response = await fetch('http://localhost:5000/chat', {
                            method: 'POST',
                            body: message,
                          });
                  
                          if (response.ok) {
                            const data = await response.json();
                            console.log("CHAT RESULTS ", data)

                            // Add the chatbot's response to chat history
                            setChatHistory(prevChatHistory => [
                              ...prevChatHistory,
                              { message: data, sender: 'assistant' }
                            ]);
                            
                          } else {
                            alert('Failed to process the file.');
                          }
                        } catch (error) {
                          console.error('Error uploading file:', error);
                          alert('An error occurred. Please try again.');
                        }
                      }
                    }} 
                    className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about your results..."
                        className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        <Send width={20} height={20} />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;