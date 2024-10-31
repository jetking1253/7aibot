import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: 'sk-473731e1dfe44ae99806aee9c4ed95a6',
  baseURL: 'https://api.deepseek.com'
});

// 系统预设消息
const systemMessage = {
  role: "system",
  content: "你是 aibot，一个智能助手。你会以专业、友好的态度为用户提供帮助。你的回答应该简洁明了，重点突出。在合适的时候，你会使用 Markdown 格式来组织你的回答，使内容更加清晰易读。"
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [systemMessage, ...messages],
    stream: true,
    temperature: 0.7, // 添加适当的温度参数，使回答更加灵活自然
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
} 