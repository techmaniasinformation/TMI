import React, { useState } from 'react';
import { Modal } from './Modal';

// ===== 새로운 통합 Modal 사용 예시 =====
export function ModalExample() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Modal 컴포넌트 통합 예시</h2>
      
      {/* 확인 모달 예시 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">1. 확인 모달 (Confirm Modal)</h3>
        <button 
          onClick={() => setShowConfirmModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          확인 모달 열기
        </button>
        
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          variant="confirm"
          title="작업 확인"
          message="정말로 이 작업을 수행하시겠습니까?"
          confirmText="확인"
          cancelText="취소"
          variantColor="info"
        />
      </div>

      {/* 완료 모달 예시 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">2. 완료 모달 (Complete Modal)</h3>
        <button 
          onClick={() => setShowCompleteModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          완료 모달 열기
        </button>
        
        <Modal
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          variant="complete"
          title="작업 완료"
          message="작업이 성공적으로 완료되었습니다."
          icon={<i className="fas fa-check text-2xl"></i>}
          buttonText="확인"
          completeColor="success"
        />
      </div>

      {/* 커스텀 모달 예시 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">3. 커스텀 모달 (Custom Modal)</h3>
        <button 
          onClick={() => setShowCustomModal(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          커스텀 모달 열기
        </button>
        
        <Modal
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          variant="custom"
          size="lg"
        >
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">커스텀 모달</h3>
            <p className="mb-4">이것은 완전히 커스텀된 모달입니다.</p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                닫기
              </button>
            </div>
          </div>
        </Modal>
      </div>

      {/* 기존 API 호환성 예시 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">4. 기존 API 호환성</h3>
        <p className="text-sm text-gray-600 mb-2">
          기존 WithdrawalConfirmModal과 WithdrawalCompleteModal도 그대로 사용 가능합니다.
        </p>
      </div>
    </div>
  );
}
