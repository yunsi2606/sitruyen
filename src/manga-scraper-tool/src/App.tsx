import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { FolderOpen, Plus, Terminal, Image as ImageIcon, CheckCircle, Loader2, Settings, Eye, EyeOff, Trash2, CheckCircle2, AlertCircle, Clock, List } from 'lucide-react'

interface Job {
    id: string;
    url: string;
    outputDir: string;
    headless: boolean;
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress: { current: number; total: number };
    errorMsg: string;
}

interface LogMessage {
    jobId?: string;
    type: 'info' | 'error' | 'success';
    message: string;
    timestamp: string;
}

function App() {
    const [url, setUrl] = useState('')
    const [outputDir, setOutputDir] = useState('C:/MangaOutput')
    const [headless, setHeadless] = useState(true)

    const [jobs, setJobs] = useState<Job[]>([])
    const [logs, setLogs] = useState<LogMessage[]>([])

    const logsContainerRef = useRef<HTMLDivElement>(null)
    const socketRef = useRef<Socket | null>(null)

    // Helper to extract chapter name from url or just incremental folder
    const inferFolder = (baseUrl: string) => {
        try {
            // If empty
            if (!baseUrl) return '';

            const urlObj = new URL(baseUrl);
            const parts = urlObj.pathname.split('/').filter(Boolean);
            const lastPart = parts[parts.length - 1] || parts[parts.length - 2];
            return lastPart ? `/${lastPart}` : `/chap_${Date.now()}`;
        } catch {
            return `/chap_${Date.now()}`;
        }
    }

    useEffect(() => {
        const socket = io('http://localhost:3001')
        socketRef.current = socket

        socket.on('connect', () => {
            addLog('info', 'Connected to scraper server', 'SYSTEM')
        })

        socket.on('queue-updated', (updatedJobs: Job[]) => {
            setJobs(updatedJobs)
        })

        socket.on('log', (data: LogMessage) => {
            addLog(data.type, data.message, data.jobId)
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        if (logsContainerRef.current) {
            const container = logsContainerRef.current;
            // Only auto-scroll if the user is already near the bottom (allows scrolling up without being forced down)
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
            if (isNearBottom) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }, [logs])

    const addLog = (type: 'info' | 'error' | 'success', message: string, jobId?: string) => {
        setLogs(prev => {
            // keep max 500 logs to avoid memory leak
            const newLogs = [...prev, {
                type,
                message,
                timestamp: new Date().toLocaleTimeString(),
                jobId
            }];
            if (newLogs.length > 500) return newLogs.slice(newLogs.length - 500);
            return newLogs;
        });
    }

    const handleAddJob = () => {
        if (!url) return addLog('error', 'Please enter a URL', 'SYSTEM')
        if (!outputDir) return addLog('error', 'Please enter an output directory', 'SYSTEM')

        // Auto append subfolder if user is scraping multiple URLs into root
        let finalDir = outputDir.replace(/\\/g, '/');

        socketRef.current?.emit('add-job', { url, outputDir: finalDir, headless })

        // Clear URL for next input
        setUrl('')
    }

    const handleClearCompleted = () => {
        socketRef.current?.emit('clear-completed');
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'processing': return <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />;
            default: return <Clock className="w-5 h-5 text-slate-500" />;
        }
    }

    const isProcessingAny = jobs.some(j => j.status === 'processing');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans selection:bg-indigo-500 selection:text-white pb-20">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                            <ImageIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Universal Manga Scraper</h1>
                            <p className="text-slate-400">Advanced scraping queue tool</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                        <div className={`w-2 h-2 rounded-full ${isProcessingAny ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                        <span className="text-xs text-slate-400 font-mono">{isProcessingAny ? 'Processing Queue...' : 'Engine Idle'}</span>
                    </div>
                </div>

                {/* Input Form */}
                <div className="grid gap-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800 backdrop-blur-sm shadow-xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Target URL</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    // Auto-suggest subfolder nicely
                                    if (e.target.value && (!outputDir || outputDir === 'C:/MangaOutput' || outputDir === 'C:\\MangaOutput')) {
                                        setOutputDir(`C:/MangaOutput${inferFolder(e.target.value)}`);
                                    }
                                }}
                                placeholder="https://example.com/manga/chapter-1"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-indigo-300"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddJob()}
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <code className="text-xs text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">WEB</code>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Output Directory</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                                    <FolderOpen className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={outputDir}
                                    onChange={(e) => setOutputDir(e.target.value)}
                                    placeholder="C:/MangaOutput/Chapter-1"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Browser Mode</label>
                            <button
                                onClick={() => setHeadless(!headless)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${headless
                                    ? 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600'
                                    : 'bg-indigo-900/20 border-indigo-500/50 text-indigo-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-2">
                                    {headless ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    <span>{headless ? 'Headless (Fast)' : 'Visible (Debug)'}</span>
                                </div>
                                <Settings className={`w-4 h-4 ${!headless && 'text-indigo-400 animate-spin-slow'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-800/50 mt-2">
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>System Ready. Enter URL and hit Add to Queue.</span>
                        </div>
                        <button
                            onClick={handleAddJob}
                            className="flex items-center space-x-2 px-8 py-3 rounded-lg font-bold text-lg transition-all transform active:scale-95 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                        >
                            <Plus className="w-6 h-6 stroke-[3]" />
                            <span>Add to Queue</span>
                        </button>
                    </div>
                </div>

                {/* Queue & Logs Split */}
                <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-start">

                    {/* Queue Panel */}
                    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[500px]">
                        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <List className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-300">Job Queue ({jobs.length})</span>
                            </div>
                            {jobs.some(j => j.status === 'completed' || j.status === 'error') && (
                                <button onClick={handleClearCompleted} className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">
                                    Clear Finished
                                </button>
                            )}
                        </div>
                        <div className="flex-1 p-3 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {jobs.length === 0 && (
                                <div className="text-slate-600 text-sm text-center mt-32 flex flex-col items-center">
                                    <List className="w-8 h-8 opacity-20 mb-2" />
                                    No jobs in queue
                                </div>
                            )}
                            {jobs.map(job => (
                                <div key={job.id} className={`p-3 rounded-xl border flex flex-col gap-2 relative overflow-hidden transition-all duration-300 ${job.status === 'processing' ? 'bg-indigo-900/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' :
                                    job.status === 'error' ? 'bg-red-900/10 border-red-500/30' :
                                        job.status === 'completed' ? 'bg-emerald-900/10 border-emerald-500/30' :
                                            'bg-slate-900 border-slate-800/50'
                                    }`}>
                                    {/* Progress Background */}
                                    {(job.status === 'processing' || job.status === 'completed') && job.progress.total > 0 && (
                                        <div className="absolute inset-y-0 left-0 bg-indigo-500/5 transition-all duration-300 ease-linear rounded-l-xl z-0"
                                            style={{ width: `${(job.progress.current / job.progress.total) * 100}%` }}
                                        />
                                    )}

                                    <div className="flex items-start justify-between relative z-10 w-full">
                                        <div className="flex items-start tracking-tight space-x-3 w-[85%]">
                                            <div className="mt-1">{getStatusIcon(job.status)}</div>
                                            <div className="flex flex-col overflow-hidden w-full">
                                                <span className="text-sm font-semibold text-slate-200 truncate" title={job.url}>{job.url}</span>
                                                <span className="text-xs text-slate-500 truncate" title={job.outputDir}>{job.outputDir}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {job.status === 'pending' && (
                                                <button onClick={() => socketRef.current?.emit('remove-job', job.id)} className="p-1.5 hover:bg-slate-800 rounded-md text-slate-500 hover:text-red-400 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {(job.status === 'processing' || job.status === 'completed') && job.progress.total > 0 && (
                                        <div className="flex items-center justify-between text-xs font-mono relative z-10 w-full mt-1 px-1">
                                            <div className="w-full bg-slate-950/80 rounded-full h-1.5 mr-3 overflow-hidden border border-slate-800">
                                                <div className="bg-indigo-500 h-full transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{ width: `${(job.progress.current / job.progress.total) * 100}%` }}></div>
                                            </div>
                                            <span className="text-slate-400 shrink-0 text-[10px]">{job.progress.current}/{job.progress.total}</span>
                                        </div>
                                    )}

                                    {job.errorMsg && (
                                        <p className="text-xs text-red-400 mt-1 relative z-10 break-all">{job.errorMsg}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Logs Console */}
                    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[500px]">
                        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Terminal className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-300">System Logs</span>
                            </div>
                            <div className="flex space-x-1.5 opacity-50">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                            </div>
                        </div>
                        <div ref={logsContainerRef} className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {logs.length === 0 && (
                                <div className="text-slate-600 italic text-center mt-32">Waiting for activity...</div>
                            )}
                            {logs.map((log, i) => (
                                <div key={i} className={`flex flex-col border-l-2 pl-3 py-1 ${log.type === 'error' ? 'text-red-400 border-red-500/50 bg-red-500/5' :
                                    log.type === 'success' ? 'text-emerald-400 border-emerald-500/50 bg-emerald-500/5' :
                                        'text-slate-300 border-indigo-500/30'
                                    }`}>
                                    <div className="flex items-center text-[10px] text-slate-500 mb-0.5 space-x-2">
                                        <span>[{log.timestamp}]</span>
                                        {log.jobId && log.jobId !== 'SYSTEM' && (
                                            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300 truncate max-w-[80px]" title={log.jobId}>
                                                #{log.jobId.slice(0, 5)}
                                            </span>
                                        )}
                                    </div>
                                    <span className="break-words font-medium">{log.message}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default App
