
import { GoogleGenAI } from "@google/genai";

// Safely access process.env to avoid ReferenceError in some browser environments
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';

// Initialize the client once if the key is available
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateLegalAnalysis = async (query: string, contextData: string): Promise<string> => {
  if (!ai) {
    return "Vui lòng cấu hình API Key để sử dụng tính năng AI.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `Bạn là một trợ lý pháp lý ảo chuyên nghiệp cho hệ thống toà án Việt Nam. 
    Nhiệm vụ của bạn là hỗ trợ cán bộ toà án tóm tắt vụ án, tra cứu luật, hoặc phân tích dữ liệu vụ án được cung cấp.
    Trả lời ngắn gọn, chính xác, sử dụng thuật ngữ pháp lý phù hợp.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: `Dữ liệu hiện tại: ${contextData}\n\nCâu hỏi của người dùng: ${query}`,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Không thể tạo câu trả lời.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.";
  }
};
