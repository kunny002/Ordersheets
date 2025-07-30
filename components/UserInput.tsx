
import React from 'react';
import type { UserDetails } from '../types';

interface UserInputProps {
  userDetails: UserDetails;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserInput: React.FC<UserInputProps> = ({ userDetails, onChange }) => {
  return (
    <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="parentName" className="block text-sm font-medium text-slate-700 mb-1">
            保護者氏名
          </label>
          <input
            type="text"
            id="parentName"
            name="parentName"
            value={userDetails.parentName}
            onChange={onChange}
            placeholder="例: 宇和 太郎"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="childName" className="block text-sm font-medium text-slate-700 mb-1">
            保育園児童名
          </label>
          <input
            type="text"
            id="childName"
            name="childName"
            value={userDetails.childName}
            onChange={onChange}
            placeholder="例: 宇和 花子"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default UserInput;
