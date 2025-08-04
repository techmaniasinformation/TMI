interface WithdrawalConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function WithdrawalConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
}: WithdrawalConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[512px] h-[200px] px-6 pt-6 relative">
        {/* 닫기 버튼 (우상단 X) */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <div className='pt-4'>
        {/* 안내 문구 */}
        <p className="text-center text-gray-800 mb-6">
          탈퇴 후 7일 이내 재가입이 불가합니다. 정말 탈퇴하시겠습니까?
        </p>

          {/* 버튼 영역 */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
