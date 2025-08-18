import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/domain/Dialog';
const WithdrawalCompleteModal = ({
  isOpen,
  onConfirm
}) => {
  return /*#__PURE__*/React.createElement(Dialog, {
    open: isOpen,
    onOpenChange: () => {}
  }, /*#__PURE__*/React.createElement(DialogOverlay, {
    className: "fixed inset-0 bg-black/70 z-40"
  }), /*#__PURE__*/React.createElement(DialogContent, {
    className: "w-[400px] bg-light-header dark:bg-dark-header rounded-lg z-50 p-6"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: "text-base font-semibold text-center text-gray-800 dark:text-white"
  }, "\uD0C8\uD1F4\uAC00 \uC815\uC0C1 \uCC98\uB9AC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mt-6"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    className: "w-[200px] py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
  }, "\uD655\uC778"))));
};
export default WithdrawalCompleteModal;