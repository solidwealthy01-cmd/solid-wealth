"use client";
import Script from 'next/script';
import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Bot, User } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api-config';

const LottiePlayer = 'lottie-player' as any;

interface ChatMessage {
    id: string;
    role: 'user' | 'bot';
    content: string;
    isTyping?: boolean;
}
export function ChatbotFloat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'bot',
            content: 'Hello! I am your Solid Wealth AI assistant. How can I help you with your financial goals today?'
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [katexLoaded, setKatexLoaded] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 400, height: 550 });
    const [isResizing, setIsResizing] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const resizeRef = useRef<{
        active: boolean;
        direction: 'n' | 'w' | 'nw';
        startX: number;
        startY: number;
        startW: number;
        startH: number;
    } | null>(null);
    useEffect(() => {
        setIsDesktop(window.innerWidth >= 768);
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handleResizeStart = (e: React.PointerEvent, direction: 'n' | 'w' | 'nw') => {
        e.preventDefault();
        setIsResizing(true);
        resizeRef.current = {
            active: true,
            direction,
            startX: e.clientX,
            startY: e.clientY,
            startW: dimensions.width,
            startH: dimensions.height,
        };
    };
    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!resizeRef.current || !resizeRef.current.active)
                return;
            const { direction, startX, startY, startW, startH } = resizeRef.current;
            let newWidth = startW;
            let newHeight = startH;
            if (direction === 'w' || direction === 'nw') {
                const deltaX = startX - e.clientX;
                newWidth = Math.max(320, Math.min(800, startW + deltaX));
            }
            if (direction === 'n' || direction === 'nw') {
                const deltaY = startY - e.clientY;
                newHeight = Math.max(400, Math.min(window.innerHeight - 120, startH + deltaY));
            }
            setDimensions({ width: newWidth, height: newHeight });
        };
        const handlePointerUp = () => {
            if (resizeRef.current) {
                resizeRef.current.active = false;
            }
            setIsResizing(false);
        };
        if (isResizing) {
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
        }
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isResizing]);
    const formatMessage = (text: string) => {
        if (!text)
            return "";
        const latexBlocks: string[] = [];
        let processedText = text;
        const patterns = [
            /\$\$([\s\S]*?)\$\$/g,
            /\\\[([\s\S]*?)\\\]/g,
            /\\\(([\s\S]*?)\\\)/g,
        ];
        let placeholderCount = 0;
        patterns.forEach((pattern) => {
            processedText = processedText.replace(pattern, (match) => {
                const placeholder = `LATEXBLOCKPLACEHOLDER${placeholderCount}`;
                let cleanMatch = match;
                cleanMatch = cleanMatch.replace(/\*\*/g, "").replace(/\*/g, "");
                latexBlocks.push(cleanMatch);
                placeholderCount++;
                return placeholder;
            });
        });
        const parseTables = (text: string) => {
            const lines = text.split('\n');
            let inTable = false;
            let tableRows: string[][] = [];
            let hasSeparator = false;
            const outputLines: string[] = [];
            const renderHtmlTable = (rows: string[][], hasSep: boolean) => {
                if (rows.length === 0)
                    return '';
                let tableHtml = '<div class="overflow-x-auto my-4 rounded-xl border border-gray-200 shadow-sm"><table class="w-full text-xs text-left text-gray-700 border-collapse">';
                let headerRow: string[] | null = null;
                let dataRows: string[][] = rows;
                if (hasSep && rows.length > 0) {
                    headerRow = rows[0];
                    dataRows = rows.slice(1);
                }
                if (headerRow) {
                    tableHtml += '<thead class="text-xs uppercase bg-[#1a2332] text-white font-bold">';
                    tableHtml += '<tr>';
                    headerRow.forEach(cell => {
                        tableHtml += `<th scope="col" class="px-4 py-3 font-semibold text-white whitespace-nowrap">${cell}</th>`;
                    });
                    tableHtml += '</tr></thead>';
                }
                tableHtml += '<tbody class="divide-y divide-gray-100 bg-white">';
                dataRows.forEach((row, idx) => {
                    tableHtml += `<tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'} hover:bg-gray-50 transition-colors">`;
                    row.forEach(cell => {
                        tableHtml += `<td class="px-4 py-3 text-[#1a2332] font-medium border-t border-gray-100">${cell}</td>`;
                    });
                    tableHtml += '</tr>';
                });
                tableHtml += '</tbody></table></div>';
                return tableHtml;
            };
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const isTableRow = /^\s*\|.*\|\s*$/.test(line);
                if (isTableRow) {
                    if (!inTable) {
                        inTable = true;
                        tableRows = [];
                        hasSeparator = false;
                    }
                    const isSeparator = /^\s*\|[\s\-\|:]*\|\s*$/.test(line);
                    if (isSeparator) {
                        hasSeparator = true;
                    }
                    else {
                        const cells = line
                            .trim()
                            .replace(/^\|/, '')
                            .replace(/\|$/, '')
                            .split('|')
                            .map(c => c.trim());
                        tableRows.push(cells);
                    }
                }
                else {
                    if (inTable) {
                        const tableHtml = renderHtmlTable(tableRows, hasSeparator);
                        outputLines.push(tableHtml);
                        inTable = false;
                    }
                    outputLines.push(line);
                }
            }
            if (inTable) {
                const tableHtml = renderHtmlTable(tableRows, hasSeparator);
                outputLines.push(tableHtml);
            }
            return outputLines.join('\n');
        };
        processedText = parseTables(processedText);
        let html = processedText;
        html = html.replace(/^\s*#+\s*$/gm, '');
        html = html
            .replace(/^###\s+(.*?)$/gm, '<h5 class="font-extrabold text-sm text-[#1a2332] mt-2.5 mb-1">$1</h5>')
            .replace(/^##\s+(.*?)$/gm, '<h4 class="font-bold text-base text-[#1a2332] mt-2 mb-1">$1</h4>')
            .replace(/^#\s+(.*?)$/gm, '<h3 class="font-black text-lg text-[#1a2332] mt-3.5 mb-1 border-b border-gray-100 pb-1">$1</h3>');
        html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<div class="flex items-start gap-2 my-1.5 ml-2"><span class="text-[#fe9800] mt-1.5 font-bold select-none">•</span><span class="flex-1 text-gray-700">$1</span></div>');
        html = html
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#1a2332] block sm:inline mt-1 sm:mt-0">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/_(.*?)_/g, '<em class="italic">$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-[#fe9800] hover:underline">$1</a>');
        for (let i = 0; i < placeholderCount; i++) {
            html = html.replace(`LATEXBLOCKPLACEHOLDER${i}`, () => latexBlocks[i]);
        }
        return html;
    };
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    useEffect(() => {
        if (!isOpen)
            return;
        if (!document.getElementById('katex-css')) {
            const link = document.createElement('link');
            link.id = 'katex-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
            document.head.appendChild(link);
        }
        const loadKatex = async () => {
            if ((window as any).katex && (window as any).renderMathInElement) {
                setKatexLoaded(true);
                return;
            }
            const loadScript = (src: string) => {
                return new Promise<void>((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = () => resolve();
                    script.onerror = () => reject();
                    document.body.appendChild(script);
                });
            };
            try {
                if (!(window as any).katex) {
                    await loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js');
                }
                if (!(window as any).renderMathInElement) {
                    await loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js');
                }
                setKatexLoaded(true);
            }
            catch (err) {
                console.error('Failed to load KaTeX:', err);
            }
        };
        loadKatex();
    }, [isOpen]);
    useEffect(() => {
        if (katexLoaded && chatContainerRef.current && (window as any).renderMathInElement) {
            const timer = setTimeout(() => {
                try {
                    (window as any).renderMathInElement(chatContainerRef.current, {
                        delimiters: [
                            { left: '$$', right: '$$', display: true },
                            { left: '$', right: '$', display: false },
                            { left: '\\(', right: '\\)', display: false },
                            { left: '\\[', right: '\\]', display: true },
                        ],
                        throwOnError: false,
                    });
                }
                catch (err) {
                    console.error('Error rendering math:', err);
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [messages, katexLoaded, isOpen]);
    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading)
            return;
        const userMessage = input.trim();
        setInput("");
        const newMessageId = Date.now().toString();
        setMessages(prev => [...prev, { id: newMessageId, role: 'user', content: userMessage }]);
        setIsLoading(true);
        setMessages(prev => [...prev, { id: 'temp-loading', role: 'bot', content: '', isTyping: true }]);
        try {
            const payload: any = { message: userMessage };
            if (sessionId) {
                payload.session_id = sessionId;
            }
            const response = await fetch(`${API_BASE_URL}/api/chatbot/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.session_id) {
                setSessionId(data.session_id);
            }
            setMessages(prev => prev.filter(msg => msg.id !== 'temp-loading'));
            let botContent = data.answer || "I'm sorry, I couldn't process that request right now.";
            botContent = botContent.replace(/^(\*\*Answer\s*:\*\*|Answer\s*:)\s*/i, "");
            if (data.follow_up_question) {
                botContent += "\n\n" + data.follow_up_question;
            }
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', content: botContent }]);
        }
        catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => prev.filter(msg => msg.id !== 'temp-loading'));
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', content: "Sorry, I'm having trouble connecting to the server. Please try again later." }]);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<>
      <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" strategy="lazyOnload"/>

      
      {isOpen && (<div className={`fixed bottom-24 right-4 md:right-8 z-50 w-[90vw] md:w-[400px] h-[550px] max-h-[75vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-up origin-bottom-right ${isResizing ? 'select-none' : ''}`} style={isDesktop ? { width: `${dimensions.width}px`, height: `${dimensions.height}px`, maxHeight: '90vh' } : {}}>
          {isDesktop && (<>
              
              
              <div className="absolute top-0 left-4 right-4 h-1.5 cursor-ns-resize z-50 select-none hover:bg-[#fe9800]/30 transition-colors duration-150" onPointerDown={(e) => handleResizeStart(e, 'n')}/>
              
              <div className="absolute top-4 bottom-4 left-0 w-1.5 cursor-ew-resize z-50 select-none hover:bg-[#fe9800]/30 transition-colors duration-150" onPointerDown={(e) => handleResizeStart(e, 'w')}/>
              
              <div className="absolute top-0 left-0 w-5 h-5 cursor-nwse-resize z-50 select-none hover:bg-[#fe9800]/40 rounded-tl-3xl transition-colors duration-150 flex items-center justify-center group" onPointerDown={(e) => handleResizeStart(e, 'nw')}>
                <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-white/40 rounded-full group-hover:bg-white/80 transition-colors"/>
                <div className="absolute top-2.5 left-2.5 w-1 h-1 bg-white/40 rounded-full group-hover:bg-white/80 transition-colors"/>
              </div>
            </>)}
          
          <div className="bg-[#1a2332] text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <Bot size={18} className="text-[#fe9800]"/>
              </div>
              <div>
                <h3 className="font-bold text-sm">Solid Wealth AI</h3>
                <p className="text-xs text-gray-300">Online & ready to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors p-1">
              <X size={20}/>
            </button>
          </div>

          
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fafbfc]">
            {messages.map((msg) => (<div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (<div className="w-6 h-6 rounded-full bg-[#1a2332] flex-shrink-0 flex items-center justify-center mr-2 mt-1">
                    <Bot size={12} className="text-[#fe9800]"/>
                  </div>)}

                <div className={`${msg.role === 'user' ? 'max-w-[80%]' : 'max-w-[90%]'} rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user'
                    ? 'bg-[#fe9800] text-white rounded-tr-sm'
                    : 'bg-white border border-gray-100 text-[#1a2332] rounded-tl-sm'}`}>
                  {msg.isTyping ? (<div className="flex items-center gap-1 h-5 px-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                    </div>) : (msg.role === 'bot' ? (<div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} className="markdown-content"/>) : (<div dangerouslySetInnerHTML={{ __html: msg.content.replace(/</g, "&lt;").replace(/>/g, "&gt;") }}/>))}
                </div>
              </div>))}
            <div ref={messagesEndRef}/>
          </div>

          
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="w-full bg-[#fafbfc] border border-gray-200 rounded-full pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:border-[#fe9800] focus:ring-1 focus:ring-[#fe9800] transition-shadow text-[#1a2332]"/>
              <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-1.5 w-10 h-10 flex items-center justify-center bg-[#fe9800] text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Send size={16} className="ml-0.5"/>
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-400">Solid Wealth AI can make mistakes. Consider verifying important information.</span>
            </div>
          </div>
        </div>)}

      
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white border border-[#EBEFF5] flex items-center justify-center group focus:outline-none overflow-hidden" aria-label="Open Chatbot">
        <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-0 absolute' : 'opacity-100'}`}>
          <LottiePlayer src="/chatbot.json" background="transparent" speed="1" style={{ width: "64px", height: "64px" }} loop autoplay/>
        </div>

        <div className={`transition-opacity duration-300 w-[64px] h-[64px] flex items-center justify-center bg-[#1a2332] text-white ${isOpen ? 'opacity-100' : 'opacity-0 absolute'}`}>
          <X size={28}/>
        </div>
      </button>
    </>);
}
