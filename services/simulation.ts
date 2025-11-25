import { SimulationStep } from '../types';

export const generateSimulationSteps = (nums: number[], k: number): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  
  // Initial State
  const preSumMap: Record<number, number> = { 0: 1 };
  let count = 0;
  let pre = 0;

  // Helper to push step (creates a deep copy of mapState)
  const addStep = (
    lineNo: number, 
    desc: string, 
    currIdx: number = -1, 
    currNum: number | null = null, 
    tgt: number | null = null,
    highlightKey?: number,
    found: boolean = false
  ) => {
    steps.push({
      lineNo,
      variables: {
        pre,
        count,
        target: tgt,
        currentNum: currNum,
        currentIndex: currIdx,
      },
      mapState: { ...preSumMap },
      description: desc,
      highlightMapKey: highlightKey,
      foundMatch: found
    });
  };

  // Step 1: Initialization
  addStep(9, "初始化哈希表 pre_sum_map = {0: 1}。Key是前缀和，Value是出现次数。初始化 {0:1} 是为了捕获从数组开头累加和刚好为 k 的情况。", -1, null, null, 0);
  addStep(12, "初始化变量：count = 0 (记录结果), pre = 0 (当前前缀和)。");

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Loop start
    addStep(15, `开始处理第 ${i} 个元素: nums[${i}] = ${num}。`, i, num);

    // Update pre
    pre += num;
    addStep(16, `1. 更新当前前缀和 pre。 pre = old_pre + num = ${pre - num} + ${num} = ${pre}。`, i, num);

    // Calc target
    const target = pre - k;
    addStep(19, `2. 计算目标值 target = pre - k = ${pre} - ${k} = ${target}。我们需要在哈希表中查找历史上是否出现过前缀和 ${target}。`, i, num, target);

    // Check map
    addStep(21, `检查 target (${target}) 是否在 pre_sum_map 中...`, i, num, target, target);

    if (preSumMap[target] !== undefined) {
      const occurrences = preSumMap[target];
      count += occurrences;
      addStep(22, `找到了！前缀和 ${target} 之前出现了 ${occurrences} 次。这意味着有 ${occurrences} 个子数组的和等于 k。更新 count = ${count}。`, i, num, target, target, true);
    } else {
      addStep(21, `未找到。前缀和 ${target} 之前没有出现过。继续。`, i, num, target, target);
    }

    // Update map
    preSumMap[pre] = (preSumMap[pre] || 0) + 1;
    addStep(25, `3. 将当前前缀和 ${pre} 记录到 map 中，供后续查找使用。`, i, num, target, pre);
  }

  addStep(27, `遍历结束，返回最终结果 count = ${count}。`, nums.length, null, null);

  return steps;
};