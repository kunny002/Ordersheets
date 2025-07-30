import React from 'react';
import { X } from 'lucide-react';
import { Product, OrderItem, ProductType, ProductOption } from '../types';

interface ProductRowProps {
  product: Product;
  orderItems: Record<string, OrderItem>;
  onSelectionChange: (productId: string, selected: boolean, option?: string) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({ product, orderItems, onSelectionChange }) => {
    
  const renderSelectionControl = () => {
    const isSelected = !!orderItems[product.id]?.selected;

    switch (product.type) {
      case ProductType.SIMPLE:
        return (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectionChange(product.id, e.target.checked)}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        );
      case ProductType.CHOICE:
        if (!product.options) return null;
        return (
          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-center">
            <div className="flex items-center gap-x-4">
              {product.options.map(option => (
                <label key={option.label} className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name={product.id}
                    value={option.label}
                    checked={isSelected && orderItems[product.id]?.option === option.label}
                    onChange={() => onSelectionChange(product.id, true, option.label)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
            {isSelected && (
              <button
                type="button"
                onClick={() => onSelectionChange(product.id, false)}
                title={`「${product.name}」の選択を解除`}
                aria-label={`「${product.name}」の選択を解除`}
                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      case ProductType.GROUPED:
        return null; // Grouped rows don't have a direct selection
      default:
        return null;
    }
  };

  const renderPrice = () => {
      switch(product.type) {
        case ProductType.SIMPLE:
            return product.price?.toLocaleString();
        case ProductType.CHOICE:
            if (!product.options) return '-';
            // Show price range or single price
            const prices = [...new Set(product.options.map((o: ProductOption) => o.price))];
            if (prices.length === 1) return prices[0].toLocaleString();
            return `${Math.min(...prices).toLocaleString()} ~ ${Math.max(...prices).toLocaleString()}`;
        case ProductType.GROUPED:
            return '下記参照';
        default:
            return '-';
      }
  }

  const baseRowClass = "bg-white border-b border-slate-200 hover:bg-slate-50 transition-colors";

  if (product.type === ProductType.GROUPED) {
    return (
      <>
        <tr className={baseRowClass}>
          <td className="px-4 py-4 text-center font-medium text-slate-800">{product.number}</td>
          <td className="px-6 py-4 font-semibold text-slate-900">
            {product.name}
            {product.description && <p className="font-normal text-xs text-slate-500">{product.description}</p>}
          </td>
          <td className="px-6 py-4 hidden sm:table-cell">{renderPrice()}</td>
          <td className="px-6 py-4 text-center"></td>
        </tr>
        {product.subProducts?.map(sub => {
          const isSelected = !!orderItems[sub.id]?.selected;
          return (
            <tr key={sub.id} className={`${baseRowClass} bg-slate-50/50`}>
              <td className="px-4 py-3 text-center"></td>
              <td className="px-6 py-3 pl-12 text-slate-700">
                {sub.name}
                {sub.description && <span className="text-xs text-slate-500 ml-2">{sub.description}</span>}
              </td>
              <td className="px-6 py-3 hidden sm:table-cell">{sub.price.toLocaleString()}</td>
              <td className="px-6 py-3 text-center">
                 <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelectionChange(sub.id, e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                 />
              </td>
            </tr>
          );
        })}
      </>
    );
  }

  return (
    <tr className={baseRowClass}>
      <td className="px-4 py-4 text-center font-medium text-slate-800">{product.number}</td>
      <td className="px-6 py-4 font-medium text-slate-800">
        {product.name}
        {product.description && <p className="font-normal text-xs text-slate-500">{product.description}</p>}
      </td>
      <td className="px-6 py-4 hidden sm:table-cell">{renderPrice()}</td>
      <td className="px-6 py-4 text-center">{renderSelectionControl()}</td>
    </tr>
  );
};

export default ProductRow;