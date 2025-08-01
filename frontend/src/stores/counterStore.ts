// src/stores/counterStore.ts
import { create } from "zustand";

// 1. 스토어의 상태(state)와 액션(action) 타입을 정의합니다.
interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

// 2. `create` 함수를 사용하여 스토어를 생성합니다.
//    `set` 함수를 통해 상태를 업데이트할 수 있습니다.
const useCounterStore = create<CounterState>((set) => ({
  // 초기 상태 정의
  count: 0,

  // 상태를 변경하는 액션(함수) 정의
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

export default useCounterStore;
