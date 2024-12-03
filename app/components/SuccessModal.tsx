import React from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handlePointsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/points');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white w-96 p-6 rounded-lg shadow-xl text-center">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Success</h2>
        
        <p className="text-sm text-gray-600 mb-6">
          10 $dexus tokens has been credited to your wallet, go to your 
          <span 
            onClick={handlePointsClick} 
            className="text-pink-500 underline cursor-pointer ml-1 hover:text-pink-600"
          >
            points
          </span> dashboard to view your balance
        </p>
        
        <button 
          onClick={onClose}
          className="w-full py-2 bg-[#F02C56] text-white rounded-md hover:bg-[#d9245a] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;