export const PYTHON_CODE = `from typing import List
from collections import defaultdict

class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        # map: 记录【前缀和】出现的次数
        # 初始化 {0: 1} 是为了处理 (pre - k = 0) 的情况
        pre_sum_map = defaultdict(int)
        pre_sum_map[0] = 1
        
        count = 0   # 最终结果
        pre = 0     # 当前的累加和
        
        for num in nums:
            pre += num  # 1. 更新当前前缀和
            
            # 2. 核心公式：寻找是否存在历史前缀和 == pre - k
            target = pre - k
            
            if target in pre_sum_map:
                count += pre_sum_map[target]
            
            # 3. 把当前的前缀和记录到 map 中
            pre_sum_map[pre] += 1
            
        return count`;

export const CODE_LINES = PYTHON_CODE.split('\n');