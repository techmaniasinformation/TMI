import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/components/domain/Dialog';
import { Button } from '@/components/foundation/button';

interface WithdrawalCompleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

const WithdrawalCompleteModal: React.FC<WithdrawalCompleteModalProps> = ({
  isOpen,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogOverlay className="fixed inset-0 bg-black/70 z-40" />
      <DialogContent className="w-[400px] bg-white rounded-lg z-50 p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-center text-gray-800">
            탈퇴가 정상 처리되었습니다.
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <button
            onClick={onConfirm}
            className="w-[200px] py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            확인
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalCompleteModal;
