// 읽지 않은 알림만 볼 지 선택하는 스위치 컴포넌트
interface UnreadOnlyToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function UnreadOnlyToggle({ checked, onChange }: UnreadOnlyToggleProps) {
  return (
    // 스위치를 감싸는 라벨
    <label className="flex items-center space-x-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors" />
        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
      </div>
      <span className="text-sm text-gray-700">읽지 않은 알림만 보기</span>
    </label>
  );
}