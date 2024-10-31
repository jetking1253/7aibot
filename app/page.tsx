'use client'

import { useState, useCallback, useEffect } from 'react'
import { Send, Plus, MessageSquare } from 'lucide-react'
import { useChat } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: string
  messages: { role: 'user' | 'assistant'; content: string }[]
}

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<string>('1')
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'aibot1',
      lastMessage: '你好，我能帮你什么？',
      timestamp: '刚刚',
      messages: []
    },
  ])
  
  const { messages, input, handleInputChange, handleSubmit: handleChatSubmit, setMessages, isLoading } = useChat({
    initialMessages: chats.find(chat => chat.id === activeChat)?.messages || [],
    initialSystemMessage: `你是一个智能AIBOT助手。在回答问题时，你必须：
1. 严格遵守中华人民共和国的法律法规
2. 不讨论政治敏感话题
3. 不传播虚假或未经证实的信息
4. 拒绝任何违法或不当的请求
5. 提供准确、客观、有建设性的回答
6. 如果不确定某个话题是否合适，应该礼貌地拒绝回答

请用中文回复用户的问题。`
  })

  const [sidebarWidth, setSidebarWidth] = useState(300)
  const [isResizing, setIsResizing] = useState(false)

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `aibot${chats.length + 1}`,
      lastMessage: '开始新的对话',
      timestamp: '刚刚',
      messages: []
    }
    
    if (messages.length > 0) {
      setChats(prevChats => prevChats.map(chat => 
        chat.id === activeChat 
          ? { ...chat, messages: messages, lastMessage: messages[messages.length - 1].content }
          : chat
      ))
    }
    
    setChats(prevChats => [...prevChats, newChat])
    setActiveChat(newChat.id)
    setMessages([])
  }

  const switchChat = (chatId: string) => {
    if (messages.length > 0) {
      setChats(prevChats => prevChats.map(chat => 
        chat.id === activeChat 
          ? { ...chat, messages: messages, lastMessage: messages[messages.length - 1].content }
          : chat
      ))
    }
    
    setActiveChat(chatId)
    const targetChat = chats.find(chat => chat.id === chatId)
    setMessages(targetChat?.messages || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleChatSubmit(e)
    
    setChats(prevChats => prevChats.map(chat => 
      chat.id === activeChat 
        ? { ...chat, lastMessage: input, timestamp: '刚刚' }
        : chat
    ))
  }

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX
        if (newWidth >= 200 && newWidth <= 600) {
          setSidebarWidth(newWidth)
        }
      }
    },
    [isResizing]
  )

  useEffect(() => {
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResizing)
    
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [resize, stopResizing])

  return (
    <div className="flex h-screen">
      <aside 
        style={{ width: `${sidebarWidth}px` }}
        className="flex-shrink-0 border-r bg-gray-50 flex flex-col relative"
      >
        <div className="p-4">
          <button 
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            <span>新建对话</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => switchChat(chat.id)}
              className={`p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3
                ${activeChat === chat.id ? 'bg-gray-100' : ''}`}
            >
              <MessageSquare className="text-gray-500" size={20} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{chat.title}</div>
                <div className="text-xs text-gray-500 truncate">
                  {chat.lastMessage}
                </div>
              </div>
              <span className="text-xs text-gray-400">{chat.timestamp}</span>
            </div>
          ))}
        </div>

        <div
          onMouseDown={startResizing}
          className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize 
            ${isResizing ? 'bg-blue-500 opacity-50' : 'hover:bg-blue-500 hover:opacity-50'}`}
        />
      </aside>

      <main className="flex-1 flex flex-col bg-gray-50 min-w-[400px]">
        <header className="border-b bg-white p-4">
          <h1 className="text-xl font-semibold">
            {chats.find(chat => chat.id === activeChat)?.title || 'AI 助手'}
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } items-start`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
                  AI
                </div>
              )}
              
              <div
                className={`max-w-[85%] rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="markdown-body">
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                      <span>AI 助手</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(message.content)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        复制
                      </button>
                    </div>
                    <div className="px-4 py-3">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        className={`prose ${
                          message.role === 'user' ? 'prose-invert' : 'prose-gray'
                        } max-w-none`}
                        components={{
                          // 自定义代码块样式
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                              <div className="relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100">
                                  <button
                                    onClick={() => navigator.clipboard.writeText(String(children))}
                                    className="text-xs bg-gray-700 text-white px-2 py-1 rounded"
                                  >
                                    复制代码
                                  </button>
                                </div>
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </div>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            )
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-2 border-b border-blue-400">
                      你
                    </div>
                    <div className="px-4 py-3">
                      {message.content}
                    </div>
                  </>
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white ml-2 flex-shrink-0">
                  你
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="border-t bg-white p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="输入消息..."
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

