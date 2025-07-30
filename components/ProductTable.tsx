
import React from 'react';
import { Product, OrderItem } from '../types';
import ProductRow from './ProductRow';

interface ProductTableProps {
  products: Product[];
  orderItems: Record<string, OrderItem>;
  onSelectionChange: (productId: string, selected: boolean, option?: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, orderItems, onSelectionChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-700 uppercase bg-slate-100/80">
          <tr>
            <th scope="col" className="w-16 px-4 py-3 text-center">番</th>
            <th scope="col" className="px-6 py-3">品名</th>
            <th scope="col" className="px-6 py-3 w-48 hidden sm:table-cell">価格 (円)</th>
            <th scope="col" className="px-6 py-3 w-24 text-center">選択</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <ProductRow 
              key={product.id}
              product={product} 
              orderItems={orderItems} 
              onSelectionChange={onSelectionChange} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
