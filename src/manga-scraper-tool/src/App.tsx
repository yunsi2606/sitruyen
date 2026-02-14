import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { FolderOpen, Play, Terminal, Image as ImageIcon, CheckCircle, Loader2, Settings, Eye, EyeOff } from 'lucide-react'

interface LogMessage {
    type: 'info' | 'error' | 'success'
    message: string
    timestamp: string
}

function App() {
    const [url, setUrl] = useState('')
    const [outputDir, setOutputDir] = useState('C:/MangaOutput')
    const [headless, setHeadless] = useState(true)
    const [isScraping, setIsScraping] = useState(false)
    const [logs, setLogs] = useState<LogMessage[]>([])
    const [progress, setProgress] = useState({ current: 0, total: 0 })
    const logEndRef = useRef<HTMLDivElement>(null)
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        // Initialize Socket Connection
        const socket = io('http://localhost:3001')
        socketRef.current = socket

        socket.on('connect', () => {
            addLog('info', 'Connected to scraper server')
        })

        socket.on('log', (msg: string) => {
            addLog('info', msg)
        })

        socket.on('error', (msg: string) => {
            addLog('error', msg)
            setIsScraping(false)
        })

        socket.on('progress', (data: { current: number, total: number, message: string }) => {
            setProgress({ current: data.current, total: data.total })
            addLog('info', `[${data.current}/${data.total}] ${data.message}`)
        })

        socket.on('complete', (msg: string) => {
            addLog('success', msg)
            setIsScraping(false)
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    const addLog = (type: 'info' | 'error' | 'success', message: string) => {
        setLogs(prev => [...prev, {
            type,
            message,
            timestamp: new Date().toLocaleTimeString()
        }])
    }

    const handleStart = () => {
        if (!url) return addLog('error', 'Please enter a URL')
        if (!outputDir) return addLog('error', 'Please enter an output directory')

        setIsScraping(true)
        setLogs([])
        setProgress({ current: 0, total: 0 })

        // Convert backslash to forward slash for consistency
        const safeOutputDir = outputDir.replace(/\\/g, '/')

        socketRef.current?.emit('start-scrape', { url, outputDir: safeOutputDir, headless })
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans selection:bg-indigo-500 selection:text-white">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                            <ImageIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Universal Manga Scraper</h1>
                            <p className="text-slate-400">Advanced scraping tool for any manga website</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs text-slate-400 font-mono">System Ready</span>
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
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/manga/chapter-1"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-indigo-300"
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
                                    placeholder="C:/MangaOutput"
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
                                    <span>{headless ? 'Headless (Fast / Hidden)' : 'Visible (Debug / Manual)'}</span>
                                </div>
                                <Settings className={`w-4 h-4 ${!headless && 'text-indigo-400 animate-spin-slow'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-800/50 mt-2">
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Engine operational</span>
                        </div>
                        <button
                            onClick={handleStart}
                            disabled={isScraping}
                            className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-bold text-lg transition-all transform active:scale-95 ${isScraping
                                    ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5'
                                }`}
                        >
                            {isScraping ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-6 h-6 fill-current" />
                                    <span>Start Extraction</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Progress Section */}
                {isScraping && (
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-indigo-300">Extraction Progress</span>
                            <span className="text-xs text-slate-400 font-mono">{progress.current} / {progress.total} Images</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                            <div
                                className="bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                style={{ width: `${(progress.total > 0 ? (progress.current / progress.total) * 100 : 0)}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Logs Console */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[400px]">
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
                    <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {logs.length === 0 && (
                            <div className="text-slate-600 italic text-center mt-20">Waiting for command...</div>
                        )}
                        {logs.map((log, i) => (
                            <div key={i} className={`flex items-start space-x-3 border-l-2 pl-3 py-0.5 ${log.type === 'error' ? 'text-red-400 border-red-500/50 bg-red-500/5' :
                                    log.type === 'success' ? 'text-emerald-400 border-emerald-500/50 bg-emerald-500/5' :
                                        'text-slate-300 border-indigo-500/30'
                                }`}>
                                <span className="text-slate-500 shrink-0 text-xs mt-0.5">[{log.timestamp}]</span>
                                <span className="break-all">{log.message}</span>
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default App
