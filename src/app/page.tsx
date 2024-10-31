import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* 导航栏 */}
      <nav className="fixed top-0 w-full border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                AIChat
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                登录
              </Link>
              <Link 
                href="/signup" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                注册
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区 */}
      <div className="pt-32 pb-20">
        {/* Hero 区域 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            与 AI 对话，
            <br />
            探索无限可能
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            体验新一代 AI 助手，让智能对话为您解答疑惑、激发创意、提供帮助
          </p>
          <div className="mt-10">
            <Link 
              href="/chat" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              开始对话
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* 特性展示 */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "自然对话",
                description: "先进的语言模型支持流畅的对话交互，理解上下文，提供连贯回应"
              },
              {
                title: "知识渊博",
                description: "涵盖多个领域的专业知识，从学术研究到日常生活，为您提供准确答案"
              },
              {
                title: "高效协作",
                description: "24/7 随时待命，快速响应您的需求，提供专业的问题解决方案"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="relative p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 使用场景 */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
            适用于各种场景
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "学习辅导",
              "编程开发",
              "创意写作",
              "数据分析",
              "翻译助手",
              "职业规划",
              "生活建议",
              "知识问答"
            ].map((scene, i) => (
              <div 
                key={i}
                className="p-4 text-center border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-300"
              >
                <span className="text-gray-800 dark:text-gray-200">
                  {scene}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © 2024 AIChat. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
} 