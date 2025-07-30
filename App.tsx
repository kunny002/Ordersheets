
import React, { useState, useEffect, useCallback } from 'react';
import { Product, OrderItem, UserDetails, SubmissionStatus } from './types';
import { PRODUCTS } from './constants';
import { submitOrderToGemini } from './services/geminiService';
import { submitOrderToGoogleSheet } from './services/sheetService'; // 新しくインポート
import ProductTable from './components/ProductTable';
import UserInput from './components/UserInput';
import Summary from './components/Summary';
import { CheckCircle, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({});
  const [userDetails, setUserDetails] = useState<UserDetails>({
    childName: '',
    parentName: '',
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(SubmissionStatus.IDLE);
  const [submissionMessage, setSubmissionMessage] = useState<string>('');

  useEffect(() => {
    const newTotal = Object.values(orderItems).reduce((acc, item: OrderItem) => {
      if (item.selected) {
        return acc + item.price;
      }
      return acc;
    }, 0);
    setTotalPrice(newTotal);
  }, [orderItems]);

  const handleSelectionChange = useCallback((productId: string, selected: boolean, optionLabel?: string) => {
    const product = products.find(p => p.id === productId || p.subProducts?.find(sp => sp.id === productId));

    if (!product) return;

    // Handle grouped products (like item 30)
    if (product.subProducts) {
        const subProduct = product.subProducts.find(sp => sp.id === productId);
        if(subProduct) {
             setOrderItems(prev => ({
                ...prev,
                [productId]: { productId, selected, price: subProduct.price, option: subProduct.name }
            }));
        }
        return;
    }

    let price = product.price || 0;
    let finalOptionLabel = optionLabel;

    if (product.options && optionLabel) {
      const selectedOption = product.options.find(o => o.label === optionLabel);
      if (selectedOption) {
        price = selectedOption.price;
      }
    } else if (product.options && !optionLabel && selected) {
        // If an item with options is selected but no option is chosen yet, default to the first
        finalOptionLabel = product.options[0].label;
        price = product.options[0].price;
    }

    setOrderItems(prev => ({
      ...prev,
      [productId]: { productId, selected, price, option: finalOptionLabel }
    }));
  }, [products]);

  const handleUserDetailsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async () => {
    if(!userDetails.childName || !userDetails.parentName) {
        setSubmissionStatus(SubmissionStatus.ERROR);
        setSubmissionMessage("保護者氏名と保育園児童名を入力してください。");
        return;
    }
    
    setSubmissionStatus(SubmissionStatus.SUBMITTING);
    setSubmissionMessage('');

    const finalOrder = {
        items: Object.values(orderItems).filter((item: OrderItem) => item.selected),
        userDetails,
        totalPrice,
      };

    try {
      // 1. まずGoogleスプレッドシートにデータを送信
      const sheetResult = await submitOrderToGoogleSheet(finalOrder);

      if (!sheetResult.success) {
        // スプレッドシートへの書き込み失敗
        throw new Error(sheetResult.message);
      }

      // 2. スプレッドシートへの書き込みが成功したら、Geminiで確認メッセージを生成
      const geminiResult = await submitOrderToGemini(finalOrder);
      setSubmissionMessage(geminiResult);
      setSubmissionStatus(SubmissionStatus.SUCCESS);

    } catch (error: any) {
      console.error(error);
      setSubmissionStatus(SubmissionStatus.ERROR);
      // エラーメッセージをより具体的に表示
      const message = error.message || 'エラーが発生しました。もう一度お試しください。';
      setSubmissionMessage(message);
    }
  };

  const resetForm = () => {
    setOrderItems({});
    setUserDetails({ childName: '', parentName: '' });
    setSubmissionStatus(SubmissionStatus.IDLE);
    setSubmissionMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-100/50 font-sans text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto">
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">令和7年度 宇和町小新1年生用学用品</h1>
                <p className="text-lg text-slate-600 mt-2">申込書</p>
            </header>

            <main className="bg-white rounded-xl shadow-lg ring-1 ring-slate-900/5">
                 {submissionStatus === SubmissionStatus.SUCCESS || submissionStatus === SubmissionStatus.ERROR ? (
                   <div className="p-8 text-center flex flex-col items-center">
                        {submissionStatus === SubmissionStatus.SUCCESS ? (
                            <>
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4"/>
                                <h2 className="text-2xl font-semibold text-slate-800">お申し込み完了</h2>
                                <p className="text-slate-600 mt-2 whitespace-pre-wrap">{submissionMessage}</p>
                                <button onClick={resetForm} className="mt-6 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                                    新しい注文を作成
                                </button>
                            </>
                        ) : (
                             <>
                                <AlertCircle className="w-16 h-16 text-red-500 mb-4"/>
                                <h2 className="text-2xl font-semibold text-slate-800">申し込みエラー</h2>
                                <p className="text-slate-600 mt-2">{submissionMessage}</p>
                                <button onClick={() => setSubmissionStatus(SubmissionStatus.IDLE)} className="mt-6 bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
                                    フォームに戻る
                                </button>
                            </>
                        )}
                   </div>
                ) : (
                <>
                    <div className="p-6 md:p-8 border-b border-slate-200">
                        <p className="text-sm text-slate-600">
                            ◎ 下記の種類別の希望欄にチェックをつけ、合計金額をご確認ください。<br/>
                            <span className="font-semibold">※申し込み締め切り日・・・11月15日(金) 宇和町小学校へ提出してください。(担当 小川)</span>
                        </p>
                    </div>
                    
                    <ProductTable products={products} orderItems={orderItems} onSelectionChange={handleSelectionChange} />
                    
                    <UserInput userDetails={userDetails} onChange={handleUserDetailsChange} />
                </>
                )}
            </main>
            
            {(submissionStatus !== SubmissionStatus.SUCCESS && submissionStatus !== SubmissionStatus.ERROR) && (
                 <Summary 
                    totalPrice={totalPrice} 
                    onSubmit={handleSubmit} 
                    isSubmitting={submissionStatus === SubmissionStatus.SUBMITTING} 
                 />
            )}

            <footer className="text-center mt-8 text-xs text-slate-500">
                <p>※印ご記入いただいた内容は、商品納品に関連した目的にのみ使用いたします。</p>
            </footer>
        </div>
    </div>
  );
};

export default App;
