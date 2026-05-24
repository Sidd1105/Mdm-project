import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageSquare, Send, User, Bot, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { carbonApi } from '@/api/client'
import { useApi } from '@/hooks/useApi'
import { SectionHeader, Spinner, Select } from '@/components/ui'
import { OLLAMA_MODELS } from '@/utils/constants'
import { clsx } from 'clsx'

const SAMPLE_QUERIES = [
  "What does the Clean Air Act say about industrial CO2 above 25,000 metric tons?",
  "How many trees are needed to offset 10 MMT of CO2?",
  "What are the Paris Agreement commitments for the US industrial sector?",
  "What does the EPA Clean Power Plan require from power plants?",
  "Explain DOE Industrial Decarbonization Roadmap recommendations.",
]

function SourceCard({ source }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/60 hover:bg-slate-700/60 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <FileText size={12} className="text-acid" />
          <span className="font-mono text-xs text-slate-300">{source.source}</span>
          <span className="badge bg-slate-700 text-slate-400 border-0 text-[10px]">
            {(source.score * 100).toFixed(0)}% match
          </span>
        </div>
        {open ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
      </button>
      {open && (
        <div className="px-3 py-2 text-xs font-mono text-slate-400 bg-slate-900/60 leading-relaxed border-t border-slate-700/50">
          {source.content}
        </div>
      )}
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={clsx('flex gap-3 animate-fade-up', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={clsx('w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center',
        isUser ? 'bg-acid text-slate-950' : 'bg-slate-800 border border-slate-700 text-slate-300')}>
        {isUser ? <User size={15} strokeWidth={2.5} /> : <Bot size={15} />}
      </div>
      <div className={clsx('max-w-[75%] space-y-2', isUser ? 'items-end flex flex-col' : '')}>
        <div className={clsx('rounded-2xl px-4 py-3 text-sm font-body leading-relaxed',
          isUser
            ? 'bg-acid text-slate-950 font-medium rounded-tr-sm'
            : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-sm')}>
          {msg.content}
        </div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="w-full space-y-1.5">
            <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Retrieved Sources</div>
            {msg.sources.map((s, i) => <SourceCard key={i} source={s} />)}
          </div>
        )}
        {msg.co2Detected && (
          <div className="badge bg-acid/10 text-acid border border-acid/20 text-[10px]">
            CO₂ detected: {msg.co2Detected} MMT
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      content: "Hi! I'm the CarbonIQ Policy Advisor. Ask me anything about carbon emission policies, regulations, or sustainability frameworks. My answers are grounded in real policy documents (EPA, Paris Agreement, DOE, etc.).",
    }
  ])
  const [input, setInput] = useState('')
  const [model, setModel] = useState('phi3')
  const [topK, setTopK] = useState('3')
  const bottomRef = useRef(null)
  const { loading, execute } = useApi(useCallback(
    (q, k, m) => carbonApi.ragQuery(q, k, m), []
  ))

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (query) => {
    const q = query || input.trim()
    if (!q || loading) return
    setInput('')

    const userMsg = { id: Date.now(), role: 'user', content: q }
    setMessages((p) => [...p, userMsg])

    const result = await execute(q, parseInt(topK), model)
    if (result) {
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        content: result.answer,
        sources: result.sources,
        co2Detected: result.co2_mmt_detected,
      }
      setMessages((p) => [...p, botMsg])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-up flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
      <SectionHeader
        title="Policy RAG Chatbot"
        subtitle="Ask questions grounded in real emission policies — EPA, Paris Agreement, DOE, IPCC."
        icon={MessageSquare}
      />

      {/* Config bar */}
      <div className="card mb-4 !py-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="label mb-0">Model:</span>
            <Select
              value={model}
              onChange={setModel}
              options={OLLAMA_MODELS}
              className="w-36"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="label mb-0">Top-K:</span>
            <Select
              value={topK}
              onChange={setTopK}
              options={['1','2','3','4','5'].map((v) => ({ value: v, label: `${v} chunks` }))}
              className="w-28"
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs font-mono text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse-slow" />
            FAISS semantic search active
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 card overflow-y-auto space-y-6 mb-4 min-h-0">
        {messages.map((msg) => <Message key={msg.id} msg={msg} />)}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
              <Bot size={15} className="text-slate-300" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-400 font-mono">
                <Spinner size={14} /> Retrieving policies &amp; generating response...
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Sample queries */}
      <div className="mb-3 flex gap-2 flex-wrap">
        {SAMPLE_QUERIES.slice(0, 3).map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            disabled={loading}
            className="text-xs font-mono text-slate-400 border border-slate-700 rounded-xl px-3 py-1.5 hover:border-acid/40 hover:text-acid transition-colors truncate max-w-xs"
          >
            {q.length > 55 ? q.slice(0, 55) + '…' : q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="card !py-3">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Ask about emission policies, regulations, or sustainability guidance... (Enter to send)"
            className="input-field flex-1 resize-none"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="btn-primary !px-4 !py-3 flex items-center gap-2 flex-shrink-0"
          >
            {loading ? <Spinner size={16} /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
