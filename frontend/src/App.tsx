// src/App.tsx
import React from "react";
import useCounterStore from "./stores/counterStore"; // Zustand 스토어 임포트
import "./App.css";

function App() {
  // useCounterStore 훅은 App 컴포넌트 내부에서 호출되어야 합니다.
  // 이 훅의 반환값은 컴포넌트의 반환값이 아닙니다.
  const { count, increment, decrement } = useCounterStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Zustand 카운터 예제
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">현재 카운트: {count}</h2>
        <div className="space-x-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            onClick={increment}
          >
            증가 (+)
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            onClick={decrement}
          >
            감소 (-)
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
