import type { Order } from '../types';

// ★★★ ステップ1でコピーしたGASのウェブアプリURLをここに貼り付けてください ★★★
const GAS_WEB_APP_URL = 'ここにデプロイしたウェブアプリのURLを貼り付け';

export const submitOrderToGoogleSheet = async (order: Order): Promise<{ success: boolean; message: string }> => {
  if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL === 'https://script.google.com/macros/s/AKfycbzm5MVjEFSy3Mbc_pBkyO0szAd2reSNyyjBpXzgDns5UUNVKajIXF3wxMpYnB2tOhGK/exec') {
    console.error("Google Apps ScriptのURLが設定されていません。");
    return { success: false, message: '設定エラー: 送信先URLがありません。' };
  }

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      mode: 'cors', // CORSを有効にする
      redirect: 'follow',
      body: JSON.stringify(order),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // GASで正しくパースするためにtext/plainを使用
      }
    });
    
    // GASからのレスポンスを処理
    const result = await response.json();

    if (result.status === 'success') {
      return { success: true, message: result.message };
    } else {
      console.error('GAS Error:', result.message);
      return { success: false, message: `サーバーへの記録中にエラーが発生しました: ${result.message}` };
    }

  } catch (error) {
    console.error("Failed to submit to Google Sheet:", error);
    return { success: false, message: '注文データの送信に失敗しました。ネットワーク接続を確認してください。' };
  }
};
