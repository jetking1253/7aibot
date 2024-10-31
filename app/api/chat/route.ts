import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// 从环境变量获取 API 密钥
const apiKey = process.env.DEEPSEEK_API_KEY

if (!apiKey) {
  throw new Error('DEEPSEEK_API_KEY is not defined in environment variables')
}

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.deepseek.com'
});

// 系统预设消息
const systemMessage = {
  role: "system",
  content: `你是一个智能AIBOT助手。在回答问题时，你必须：
1. 严格遵守中华人民共和国的法律法规
2. 不讨论政治敏感话题
3. 不传播虚假或未经证实的信息
4. 拒绝任何违法或不当的请求
5. 提供准确、客观、有建设性的回答
6. 如果不确定某个话题是否合适，应该礼貌地拒绝回答

请用中文回复用户的问题。使用 Markdown 格式来组织你的回答，使内容更加清晰易读。`
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [systemMessage, ...messages],
    stream: true,
    temperature: 0.7,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
} 
