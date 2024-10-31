'use client'

import { useState, useCallback, useEffect } from 'react'
import { Send, Plus, MessageSquare, Trash2 } from 'lucide-react'
import { useChat, Message } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: string
  messages: Message[]
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
    initialMessages: chats.find(chat => chat.id === activeChat)?.messages || []
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

  const startResizing = useCallback(() => {
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

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (chats.length === 1) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: 'aibot1',
        lastMessage: '你好，我能帮你什么？',
        timestamp: '刚刚',
        messages: []
      }
      setChats([newChat])
      setActiveChat(newChat.id)
      setMessages([])
    } else {
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId))
      if (activeChat === chatId) {
        const firstChat = chats.find(chat => chat.id !== chatId)
        if (firstChat) {
          setActiveChat(firstChat.id)
          setMessages(firstChat.messages)
        }
      }
    }
  }

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
              className={`p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 group
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
              <button
                onClick={(e) => deleteChat(chat.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all duration-200"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
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
                          message.role === 'assistant' ? 'prose-gray' : 'prose-invert'
                        } max-w-none`}
                        components={{
                          code({ children, className, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
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

