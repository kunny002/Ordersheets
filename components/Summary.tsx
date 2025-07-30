
import React from 'react';
import Spinner from './Spinner';

interface SummaryProps {
  totalPrice: number;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Summary: React.FC<SummaryProps> = ({ totalPrice, onSubmit, isSubmitting }) => {
  return (
    <div className="sticky bottom-0 mt-8 w-full max-w-4xl mx-auto py-4 px-6 bg-white/80 backdrop-blur-sm rounded-t-xl shadow-2xl ring-1 ring-slate-900/5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-600">申し込み合計金額</p>
          <p className="text-3xl font-bold text-slate-900">
            ¥ {totalPrice.toLocaleString()}
          </p>
        </div>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || totalPrice === 0}
          className="flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
        >
          {isSubmitting ? (
            <>
              <Spinner />
              送信中...
            </>
          ) : (
            '注文を確定する'
          )}
        </button>
      </div>
    </div>
  );
};

export default Summary;
