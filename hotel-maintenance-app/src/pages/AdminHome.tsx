import { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import Sidebar from '../components/Sidebar';

interface ParsedEquipment {
    equipmentId: string;
    equipmentType: string;
    department: string;
    location: string;
    floor: string;
    maintenanceInterval: string;
}

const EXPECTED_HEADERS = ['Equipment ID', 'Equipment Type', 'Department', 'Location', 'Floor', 'Maintenance Interval'];

const TEMPLATE_CSV = `Equipment ID,Equipment Type,Department,Location,Floor,Maintenance Interval
FCU B2-102,FCU,Guestroom FCU,Room 1314,14,30D
AHU MT-8,AHU,HVAC,Grand Ballroom,3,3M
Manitowoc Ice Crush,Ice Crush,Kitchen,Sugar & Spice,B1,2M
Juicer Santos 2,Combi Oven,Kitchen,Sugar & Spice,B1,4W
P-12-35,Panel,Laundry,Laundry Room,B2,3M`;

export default function AdminHome() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedEquipment[]>([]);
    const [importing, setImporting] = useState(false);
    const [imported, setImported] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDownloadTemplate = () => {
        const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'equipment_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                setError("Please upload a valid CSV file.");
                setFile(null);
                setParsedData([]);
                return;
            }
            setFile(selectedFile);
            setError(null);
            setImported(false);

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                if (text) {
                    parseCSV(text);
                }
            };
            reader.readAsText(selectedFile);
        }
    };

    const parseCSV = (csvText: string) => {
        try {
            const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            if (lines.length < 2) {
                throw new Error("CSV must have a header row and at least one data row.");
            }

            // Parse header to map column positions
            const headers = lines[0].split(',').map(h => h.trim());
            const headerMap: Record<string, number> = {};
            for (const expected of EXPECTED_HEADERS) {
                const idx = headers.findIndex(h => h.toLowerCase() === expected.toLowerCase());
                if (idx === -1) {
                    throw new Error(`Missing required column: "${expected}". Expected columns: ${EXPECTED_HEADERS.join(', ')}`);
                }
                headerMap[expected] = idx;
            }

            const data: ParsedEquipment[] = [];
            const errors: string[] = [];

            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',').map(c => c.trim());
                const equipmentId = cols[headerMap['Equipment ID']] || '';
                const equipmentType = cols[headerMap['Equipment Type']] || '';
                const department = cols[headerMap['Department']] || '';
                const location = cols[headerMap['Location']] || '';
                const floor = cols[headerMap['Floor']] || '';
                const maintenanceInterval = cols[headerMap['Maintenance Interval']] || '';

                if (!equipmentId) {
                    errors.push(`Row ${i + 1}: Missing Equipment ID`);
                    continue;
                }

                if (maintenanceInterval && !/^\d+[DWMY]$/i.test(maintenanceInterval)) {
                    errors.push(`Row ${i + 1}: Invalid Maintenance Interval "${maintenanceInterval}" — use format like 30D, 4W, 2M, 3M`);
                    continue;
                }

                data.push({ equipmentId, equipmentType, department, location, floor, maintenanceInterval });
            }

            if (errors.length > 0 && data.length === 0) {
                throw new Error(errors.join('\n'));
            }

            if (errors.length > 0) {
                setError(`${errors.length} row(s) skipped:\n${errors.join('\n')}`);
            }

            setParsedData(data);
        } catch (err: any) {
            setError(err.message || 'Error parsing CSV');
            setParsedData([]);
        }
    };

    const handleImport = async () => {
        setImporting(true);
        // Simulate DB Insert
        await new Promise(resolve => setTimeout(resolve, 1500));
        setImporting(false);
        setImported(true);
        setParsedData([]);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar role="admin" />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="mb-8 border-b border-gray-200 pb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Equipment Data Import</h1>
                        <p className="text-gray-500 text-sm mt-1">Upload CSV files to batch add equipment to the database.</p>
                    </div>

                    <button
                        onClick={handleDownloadTemplate}
                        className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download Template CSV
                    </button>
                </div>

                <div className="max-w-5xl">
                    {/* Expected Format Reference */}
                    <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Expected CSV Columns</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {[
                                { label: 'Equipment ID', example: 'FCU B2-102' },
                                { label: 'Equipment Type', example: 'FCU, AHU' },
                                { label: 'Department', example: 'HVAC, Kitchen' },
                                { label: 'Location', example: 'Grand Ballroom' },
                                { label: 'Floor', example: '14, B1, P3' },
                                { label: 'Maint. Interval', example: '30D, 4W, 2M' },
                            ].map(col => (
                                <div key={col.label} className="bg-gray-50 rounded-lg p-2.5">
                                    <p className="text-xs font-semibold text-gray-800">{col.label}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{col.example}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div className="mb-8">
                        <label
                            htmlFor="csv-upload"
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors bg-white",
                                file ? "border-green-400 bg-green-50/50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
                            )}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {file ? (
                                    <div className="flex flex-col items-center text-green-600">
                                        <CheckCircle2 className="w-10 h-10 mb-3" />
                                        <p className="text-sm font-semibold">{file.name}</p>
                                        <p className="text-xs mt-1 text-green-500">Ready to parse</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm font-semibold text-gray-700">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-500">CSV files only (Max. 10MB)</p>
                                    </>
                                )}
                            </div>
                            <input
                                id="csv-upload"
                                type="file"
                                accept=".csv"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </label>

                        {error && (
                            <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span className="whitespace-pre-line">{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Preview Area */}
                    {parsedData.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">Preview Data ({parsedData.length} records)</h3>
                                <button
                                    onClick={handleImport}
                                    disabled={importing}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2",
                                        importing ? "bg-gray-400 text-white cursor-wait" : "bg-indigo-600 text-white hover:bg-indigo-700"
                                    )}
                                >
                                    {importing ? 'Importing...' : 'Confirm & Import to Database'}
                                </button>
                            </div>
                            <div className="overflow-x-auto max-h-96">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-5 py-3 font-semibold">Equipment ID</th>
                                            <th className="px-5 py-3 font-semibold">Type</th>
                                            <th className="px-5 py-3 font-semibold">Department</th>
                                            <th className="px-5 py-3 font-semibold">Location</th>
                                            <th className="px-5 py-3 font-semibold">Floor</th>
                                            <th className="px-5 py-3 font-semibold">Maint. Interval</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parsedData.map((row, idx) => (
                                            <tr key={idx} className="bg-white border-b border-gray-50 hover:bg-gray-50/50">
                                                <td className="px-5 py-3 font-medium text-gray-900">{row.equipmentId}</td>
                                                <td className="px-5 py-3">{row.equipmentType}</td>
                                                <td className="px-5 py-3">{row.department}</td>
                                                <td className="px-5 py-3">{row.location}</td>
                                                <td className="px-5 py-3">{row.floor}</td>
                                                <td className="px-5 py-3">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                                        {row.maintenanceInterval}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {imported && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex flex-col items-center justify-center mx-auto mb-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-green-800 font-bold text-lg mb-1">Import Successful</h3>
                            <p className="text-green-600 text-sm">The equipment data has been added to our database.</p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
