
import { GoogleGenAI } from "@google/genai";
import type { Order, OrderItem } from '../types';

// Assume process.env.API_KEY is available in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const formatOrderForPrompt = (order: Order): string => {
  const itemsText = order.items
    .map(item => {
        const product = item.option ? `${item.productId} (${item.option})` : item.productId;
        return `- 商品ID ${product}: ${item.price}円`;
    })
    .join('\n');

  return `
以下の学校用品注文を処理し、保護者向けの確認メッセージを生成してください。

## 注文詳細
- **保護者氏名:** ${order.userDetails.parentName}
- **児童名:** ${order.userDetails.childName}
- **注文商品リスト:**
${itemsText}
- **合計金額:** ${order.totalPrice}円

## 指示
丁寧な日本語で、注文が正常に受け付けられたことを伝える、簡潔で分かりやすい確認メッセージを作成してください。
メッセージには、保護者の名前、児童の名前、合計金額、そして「ご注文ありがとうございました。」という感謝の言葉を必ず含めてください。
確認番号のようなものは不要です。シンプルにしてください。
`;
};


export const submitOrderToGemini = async (order: Order): Promise<string> => {
    if (!API_KEY) {
        // Return a mock response if API key is not available
        return new Promise(resolve => {
            setTimeout(() => {
                const confirmationMessage = `${order.userDetails.parentName} 様\n\n${order.userDetails.childName}様の学用品のご注文、誠にありがとうございます。\n\n合計金額は ${order.totalPrice.toLocaleString()}円 となります。\n\nご注文内容を確認いたしました。`;
                resolve(confirmationMessage);
            }, 1000);
        });
    }

    const prompt = formatOrderForPrompt(order);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3,
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to generate order confirmation.");
    }
};
