// 읽지 않은 알림만 볼 지 선택하는 스위치 컴포넌트

export default function UnreadOnlyToggle({
  checked,
  onChange
}) {
  return (
    /*#__PURE__*/
    // 스위치를 감싸는 라벨
    React.createElement("label", {
      className: "flex items-center space-x-2 cursor-pointer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: checked,
      onChange: e => onChange(e.target.checked),
      className: "sr-only peer"
    }), /*#__PURE__*/React.createElement("div", {
      className: "w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-blue-600 transition-colors"
    }), /*#__PURE__*/React.createElement("div", {
      className: "absolute top-0.5 left-0.5 w-4 h-4 bg-white dark:bg-gray-300 rounded-full shadow peer-checked:translate-x-5 transition-transform"
    })), /*#__PURE__*/React.createElement("span", {
      className: "text-sm text-gray-700 dark:text-gray-200"
    }, "\uC77D\uC9C0 \uC54A\uC740 \uC54C\uB9BC\uB9CC \uBCF4\uAE30"))
  );
}