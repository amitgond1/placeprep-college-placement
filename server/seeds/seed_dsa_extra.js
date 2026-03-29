require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Question = require('../models/Question');

const questions = [

// ========== ARRAYS ==========
{ title:'Container With Most Water',difficulty:'Medium',topic:'Array',topics:['Array','Two Pointers'],
  companies:['Amazon','Google','Microsoft','Meta'],frequency:88,rounds:['Round 1','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/container-with-most-water/',
  solution:{explanation:'Two pointers from both ends. Move pointer with smaller height inward.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Why greedy works: moving taller pointer can never increase area.'} },

{ title:'Move Zeroes',difficulty:'Easy',topic:'Array',topics:['Array','Two Pointers'],
  companies:['TCS','Wipro','Infosys','Cognizant','Amazon'],frequency:86,rounds:['Online Test','Round 1'],
  leetcodeLink:'https://leetcode.com/problems/move-zeroes/',
  solution:{explanation:'Two pointers: slow tracks insert pos, fast scans. Swap non-zero elements.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'In-place, minimize total number of operations.'} },

{ title:'Find All Numbers Disappeared in Array',difficulty:'Easy',topic:'Array',topics:['Array','Hash Table'],
  companies:['TCS','Wipro','Infosys','HCL'],frequency:83,rounds:['Online Test'],
  leetcodeLink:'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/',
  solution:{explanation:'Negate values at index nums[i]-1. Indices still positive are the missing ones.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'No extra space — classic index marking trick.'} },

{ title:'Rotate Image',difficulty:'Medium',topic:'Array',topics:['Array','Matrix'],
  companies:['Amazon','Microsoft','Google','Zoho'],frequency:78,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/rotate-image/',
  solution:{explanation:'Transpose the matrix, then reverse each row.',
    timeComplexity:'O(n²)',spaceComplexity:'O(1)',followUpTips:'In-place — transpose + reverse is the key insight.'} },

{ title:'Set Matrix Zeroes',difficulty:'Medium',topic:'Array',topics:['Array','Matrix'],
  companies:['Amazon','Microsoft','Google','Flipkart'],frequency:76,rounds:['Round 1','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/set-matrix-zeroes/',
  solution:{explanation:'First pass: mark rows/cols with zero using first row/col as flags.',
    timeComplexity:'O(m*n)',spaceComplexity:'O(1)',followUpTips:'O(1) space solution uses matrix borders as markers.'} },

{ title:'Pascal\'s Triangle',difficulty:'Easy',topic:'Array',topics:['Array','Dynamic Programming'],
  companies:['TCS','Wipro','Infosys','Cognizant','Capgemini'],frequency:85,rounds:['Online Test'],
  leetcodeLink:'https://leetcode.com/problems/pascals-triangle/',
  solution:{explanation:'Each row: start/end = 1, middle = sum of two above.',
    timeComplexity:'O(n²)',spaceComplexity:'O(n²)',followUpTips:'Classic combinatorics — know nCr formula too.'} },

{ title:'Majority Element',difficulty:'Easy',topic:'Array',topics:['Array','Counting'],
  companies:['TCS','Wipro','Amazon','Infosys'],frequency:87,rounds:['Online Test','Round 1'],
  leetcodeLink:'https://leetcode.com/problems/majority-element/',
  solution:{explanation:'Boyer-Moore Voting: track candidate and count. If count drops to 0, switch candidate.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'The element appearing > n/2 times is always majority.'} },

// ========== BINARY SEARCH ==========
{ title:'Find Minimum in Rotated Sorted Array',difficulty:'Medium',topic:'Binary Search',topics:['Array','Binary Search'],
  companies:['Amazon','Google','Microsoft','Flipkart'],frequency:82,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
  solution:{explanation:'Binary search: if mid > right, minimum is in right half, else left half.',
    timeComplexity:'O(log n)',spaceComplexity:'O(1)',followUpTips:'Similar to Search in Rotated Array — identify sorted half.'} },

{ title:'Koko Eating Bananas',difficulty:'Medium',topic:'Binary Search',topics:['Array','Binary Search'],
  companies:['Amazon','Google','Meta'],frequency:73,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/koko-eating-bananas/',
  solution:{explanation:'Binary search on answer (speed). Check if feasible with hours(k) <= h.',
    timeComplexity:'O(n log m)',spaceComplexity:'O(1)',followUpTips:'BS on answer space — classic template for "minimize maximum".'} },

{ title:'Binary Search',difficulty:'Easy',topic:'Binary Search',topics:['Array','Binary Search'],
  companies:['TCS','Wipro','Infosys','Cognizant'],frequency:90,rounds:['Online Test'],
  leetcodeLink:'https://leetcode.com/problems/binary-search/',
  solution:{explanation:'Classic binary search — left=0, right=n-1, mid=(l+r)/2, compare and halve.',
    timeComplexity:'O(log n)',spaceComplexity:'O(1)',followUpTips:'Know both iterative and recursive. TCS NQT basic.'} },

{ title:'Capacity To Ship Packages Within D Days',difficulty:'Medium',topic:'Binary Search',topics:['Array','Binary Search'],
  companies:['Amazon','Google'],frequency:70,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/',
  solution:{explanation:'Binary search on capacity: lo=max(weights), hi=sum(weights). Greedily check if D days suffice.',
    timeComplexity:'O(n log(sum))',spaceComplexity:'O(1)',followUpTips:'Same template as Koko — "minimize maximum capacity".'} },

// ========== SLIDING WINDOW ==========
{ title:'Permutation in String',difficulty:'Medium',topic:'Sliding Window',topics:['Hash Table','String','Sliding Window'],
  companies:['Amazon','Microsoft','Google'],frequency:76,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/permutation-in-string/',
  solution:{explanation:'Fixed window of size s1. Compare character frequency maps.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Fixed-size sliding window with frequency comparison.'} },

{ title:'Max Consecutive Ones III',difficulty:'Medium',topic:'Sliding Window',topics:['Array','Sliding Window'],
  companies:['Amazon','Google','Flipkart'],frequency:72,rounds:['Round 1','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/max-consecutive-ones-iii/',
  solution:{explanation:'Sliding window: expand right, shrink left when zeros > k.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Variable window — count zeros allowed. Classic template.'} },

{ title:'Longest Repeating Character Replacement',difficulty:'Medium',topic:'Sliding Window',topics:['String','Sliding Window'],
  companies:['Amazon','Google','Microsoft'],frequency:74,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/longest-repeating-character-replacement/',
  solution:{explanation:'Window is valid if (window size - max freq) <= k. Expand right, shrink left.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Track maxFreq — it only ever increases for the optimal answer.'} },

// ========== STACK ==========
{ title:'Min Stack',difficulty:'Medium',topic:'Stack',topics:['Stack','Design'],
  companies:['Amazon','Microsoft','Google','TCS'],frequency:80,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/min-stack/',
  solution:{explanation:'Auxiliary stack stores minimum at each level. Push/pop in sync.',
    timeComplexity:'O(1) all ops',spaceComplexity:'O(n)',followUpTips:'O(1) getMin — use two stacks or store diff from current min.'} },

{ title:'Evaluate Reverse Polish Notation',difficulty:'Medium',topic:'Stack',topics:['Array','Math','Stack'],
  companies:['Amazon','Microsoft','Google'],frequency:73,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
  solution:{explanation:'Stack: push numbers, pop two on operator and push result.',
    timeComplexity:'O(n)',spaceComplexity:'O(n)',followUpTips:'Clean implementation — handle edge cases: 6/(-132) = 0.'} },

{ title:'Next Greater Element I',difficulty:'Easy',topic:'Stack',topics:['Array','Hash Table','Stack','Monotonic Stack'],
  companies:['Amazon','Microsoft','TCS','Wipro'],frequency:77,rounds:['Round 1','Online Test'],
  leetcodeLink:'https://leetcode.com/problems/next-greater-element-i/',
  solution:{explanation:'Monotonic decreasing stack on nums2. Store in map. O(n+m).',
    timeComplexity:'O(n+m)',spaceComplexity:'O(n)',followUpTips:'Next Greater in circular array (LC 503) uses same stack + modulo.'} },

{ title:'Generate Parentheses',difficulty:'Medium',topic:'Stack',topics:['String','Backtracking'],
  companies:['Amazon','Google','Microsoft','Meta'],frequency:78,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/generate-parentheses/',
  solution:{explanation:'Backtracking: add \'(\' if open < n, add \')\' if close < open.',
    timeComplexity:'O(4^n/√n)',spaceComplexity:'O(n)',followUpTips:'Pure backtracking — classic string generation with constraints.'} },

// ========== LINKED LIST ==========
{ title:'Merge Two Sorted Lists',difficulty:'Easy',topic:'Linked Lists',topics:['Linked List','Recursion'],
  companies:['Amazon','Microsoft','Google','TCS','Wipro'],frequency:90,rounds:['Round 1','Online Test'],
  leetcodeLink:'https://leetcode.com/problems/merge-two-sorted-lists/',
  solution:{explanation:'Compare heads, link smaller node, recurse on rest.',
    timeComplexity:'O(n+m)',spaceComplexity:'O(1)',followUpTips:'Iterative with dummy head is cleanest. Foundation for Merge K Sorted.'} },

{ title:'Add Two Numbers',difficulty:'Medium',topic:'Linked Lists',topics:['Linked List','Math','Recursion'],
  companies:['Amazon','Microsoft','Google','Meta'],frequency:83,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/add-two-numbers/',
  solution:{explanation:'Traverse both lists simultaneously, carry = sum / 10, digit = sum % 10.',
    timeComplexity:'O(max(m,n))',spaceComplexity:'O(max(m,n))',followUpTips:'Handle unequal lengths and final carry carefully.'} },

{ title:'Remove Nth Node From End of List',difficulty:'Medium',topic:'Linked Lists',topics:['Linked List','Two Pointers'],
  companies:['Amazon','Microsoft','Google'],frequency:80,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
  solution:{explanation:'Two pointers n apart. When fast reaches end, slow is at target.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'One-pass — use dummy head to handle edge case of removing head.'} },

{ title:'Middle of the Linked List',difficulty:'Easy',topic:'Linked Lists',topics:['Linked List','Two Pointers'],
  companies:['TCS','Wipro','Infosys','Amazon'],frequency:85,rounds:['Online Test','Round 1'],
  leetcodeLink:'https://leetcode.com/problems/middle-of-the-linked-list/',
  solution:{explanation:'Slow/fast pointers. Fast moves 2 steps, slow 1. When fast ends, slow is at middle.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Foundation for many LL problems — merge sort on LL uses this.'} },

{ title:'Palindrome Linked List',difficulty:'Easy',topic:'Linked Lists',topics:['Linked List','Two Pointers','Recursion'],
  companies:['Amazon','Microsoft','Meta','TCS'],frequency:79,rounds:['Round 1','Online Test'],
  leetcodeLink:'https://leetcode.com/problems/palindrome-linked-list/',
  solution:{explanation:'Find middle, reverse second half, compare with first half.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'O(1) space — combine slow/fast + reverse. Restore if needed.'} },

// ========== TREES ==========
{ title:'Invert Binary Tree',difficulty:'Easy',topic:'Trees',topics:['Tree','DFS','BFS','Binary Tree'],
  companies:['Amazon','Microsoft','Google','Meta','TCS'],frequency:88,rounds:['Round 1','Online Test'],
  leetcodeLink:'https://leetcode.com/problems/invert-binary-tree/',
  solution:{explanation:'Swap left and right children at each node recursively.',
    timeComplexity:'O(n)',spaceComplexity:'O(h)',followUpTips:'Recursive one-liner. Also know iterative BFS approach.'} },

{ title:'Diameter of Binary Tree',difficulty:'Easy',topic:'Trees',topics:['Tree','DFS','Binary Tree'],
  companies:['Amazon','Google','Microsoft','Meta'],frequency:82,rounds:['Round 1','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/diameter-of-binary-tree/',
  solution:{explanation:'At each node: diameter = left_height + right_height. Track global max.',
    timeComplexity:'O(n)',spaceComplexity:'O(h)',followUpTips:'Update global answer inside DFS — common pattern for tree path problems.'} },

{ title:'Binary Tree Right Side View',difficulty:'Medium',topic:'Trees',topics:['Tree','DFS','BFS','Binary Tree'],
  companies:['Amazon','Microsoft','Google','Meta','Flipkart'],frequency:80,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/binary-tree-right-side-view/',
  solution:{explanation:'BFS level order: pick last node of each level. Or DFS: visit right before left.',
    timeComplexity:'O(n)',spaceComplexity:'O(n)',followUpTips:'BFS is most intuitive. DFS visits right child first with depth tracking.'} },

{ title:'Kth Smallest Element in a BST',difficulty:'Medium',topic:'Trees',topics:['Tree','DFS','Binary Search Tree'],
  companies:['Amazon','Microsoft','Google'],frequency:76,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
  solution:{explanation:'Inorder traversal of BST gives sorted order. Return kth element.',
    timeComplexity:'O(h+k)',spaceComplexity:'O(h)',followUpTips:'Follow-up: if BST is frequently modified, augment node with subtree size.'} },

{ title:'Construct Binary Tree from Preorder and Inorder',difficulty:'Medium',topic:'Trees',topics:['Array','Hash Table','Divide and Conquer','Tree'],
  companies:['Amazon','Microsoft','Google','Meta'],frequency:74,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
  solution:{explanation:'preorder[0] is root. Find in inorder to split left/right subtrees.',
    timeComplexity:'O(n)',spaceComplexity:'O(n)',followUpTips:'Use HashMap for O(1) inorder lookup. Similar for postorder+inorder.'} },

{ title:'Path Sum',difficulty:'Easy',topic:'Trees',topics:['Tree','DFS','Binary Tree'],
  companies:['TCS','Wipro','Amazon','Microsoft'],frequency:78,rounds:['Round 1','Online Test'],
  leetcodeLink:'https://leetcode.com/problems/path-sum/',
  solution:{explanation:'DFS: subtract node value from target. At leaf, check if remainder == 0.',
    timeComplexity:'O(n)',spaceComplexity:'O(h)',followUpTips:'Path Sum II (all paths) uses backtracking with a list.'} },

{ title:'Sum Root to Leaf Numbers',difficulty:'Medium',topic:'Trees',topics:['Tree','DFS','Binary Tree'],
  companies:['Amazon','Microsoft','Google'],frequency:72,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/sum-root-to-leaf-numbers/',
  solution:{explanation:'DFS passing current number = prevNum*10 + node.val. Add at leaf.',
    timeComplexity:'O(n)',spaceComplexity:'O(h)',followUpTips:'Accumulate number top-down. Classic DFS with state propagation.'} },

{ title:'Balanced Binary Tree',difficulty:'Easy',topic:'Trees',topics:['Tree','DFS','Binary Tree'],
  companies:['TCS','Wipro','Amazon','Microsoft'],frequency:81,rounds:['Round 1','Online Test'],
  leetcodeLink:'https://leetcode.com/problems/balanced-binary-tree/',
  solution:{explanation:'For each node: abs(leftH - rightH) <= 1 and both subtrees balanced.',
    timeComplexity:'O(n)',spaceComplexity:'O(h)',followUpTips:'Return -1 to propagate "unbalanced" flag up — avoids redundant checks.'} },

{ title:'Symmetric Tree',difficulty:'Easy',topic:'Trees',topics:['Tree','DFS','BFS','Binary Tree'],
  companies:['TCS','Wipro','Amazon','Microsoft','Google'],frequency:83,rounds:['Round 1','Online Test'],
  leetcodeLink:'https://leetcode.com/problems/symmetric-tree/',
  solution:{explanation:'Recursive: check if left.left mirrors right.right and left.right mirrors right.left.',
    timeComplexity:'O(n)',spaceComplexity:'O(h)',followUpTips:'Iterative uses queue with pairs.'} },

{ title:'Flatten Binary Tree to Linked List',difficulty:'Medium',topic:'Trees',topics:['Linked List','Stack','Tree','DFS'],
  companies:['Amazon','Microsoft','Google','Meta'],frequency:71,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/',
  solution:{explanation:'Morris traversal or: move right subtree after rightmost of left, attach left to right.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'O(1) space Morris-like approach — elegant in-place flatten.'} },

// ========== DYNAMIC PROGRAMMING ==========
{ title:'House Robber',difficulty:'Medium',topic:'Dynamic Programming',topics:['Array','Dynamic Programming'],
  companies:['Amazon','Microsoft','Google','Meta','TCS'],frequency:85,rounds:['Round 1','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/house-robber/',
  solution:{explanation:'dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Space-optimize to two vars.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Foundation for House Robber II (circular) and tree version.'} },

{ title:'House Robber II',difficulty:'Medium',topic:'Dynamic Programming',topics:['Array','Dynamic Programming'],
  companies:['Amazon','Microsoft','Google'],frequency:79,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/house-robber-ii/',
  solution:{explanation:'Circular: run House Robber I twice — [0..n-2] and [1..n-1], take max.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Break circular dependency by fixing inclusion/exclusion of first house.'} },

{ title:'Longest Common Subsequence',difficulty:'Medium',topic:'Dynamic Programming',topics:['String','Dynamic Programming'],
  companies:['Amazon','Google','Microsoft','Meta'],frequency:82,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/longest-common-subsequence/',
  solution:{explanation:'dp[i][j]: if chars match, dp[i-1][j-1]+1, else max(dp[i-1][j], dp[i][j-1]).',
    timeComplexity:'O(m*n)',spaceComplexity:'O(m*n)',followUpTips:'Foundational DP — also basis for Edit Distance and Diff algorithms.'} },

{ title:'Edit Distance',difficulty:'Hard',topic:'Dynamic Programming',topics:['String','Dynamic Programming'],
  companies:['Amazon','Google','Microsoft','Meta'],frequency:76,rounds:['DSA Round','Final Round'],
  leetcodeLink:'https://leetcode.com/problems/edit-distance/',
  solution:{explanation:'dp[i][j] = min ops to convert s1[:i] to s2[:j]. 3 ops: insert, delete, replace.',
    timeComplexity:'O(m*n)',spaceComplexity:'O(m*n)',followUpTips:'Classic DP — know how to reconstruct the actual operations.'} },

{ title:'Partition Equal Subset Sum',difficulty:'Medium',topic:'Dynamic Programming',topics:['Array','Dynamic Programming'],
  companies:['Amazon','Microsoft','Google'],frequency:75,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/partition-equal-subset-sum/',
  solution:{explanation:'0/1 Knapsack: can we pick subset with sum = total/2? dp[j] = dp[j] | dp[j-num].',
    timeComplexity:'O(n * sum)',spaceComplexity:'O(sum)',followUpTips:'Classic 0/1 Knapsack in disguise. Space optimized to 1D.'} },

{ title:'Unique Paths',difficulty:'Medium',topic:'Dynamic Programming',topics:['Math','Dynamic Programming','Combinatorics'],
  companies:['Amazon','Microsoft','Google','TCS'],frequency:80,rounds:['Round 1','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/unique-paths/',
  solution:{explanation:'dp[i][j] = dp[i-1][j] + dp[i][j-1]. Or use C(m+n-2, m-1) combinatorics.',
    timeComplexity:'O(m*n)',spaceComplexity:'O(n)',followUpTips:'With obstacles: set dp=0 for blocked cells. Classic grid DP.'} },

{ title:'Longest Increasing Subsequence',difficulty:'Medium',topic:'Dynamic Programming',topics:['Array','Binary Search','Dynamic Programming'],
  companies:['Amazon','Microsoft','Google','Flipkart'],frequency:82,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/longest-increasing-subsequence/',
  solution:{explanation:'O(n²) DP: dp[i] = max(dp[j]+1) for j<i where nums[j]<nums[i]. O(n log n) with patience sort.',
    timeComplexity:'O(n log n)',spaceComplexity:'O(n)',followUpTips:'O(n log n) uses binary search (lower_bound) to maintain sorted subsequence.'} },

{ title:'0/1 Knapsack Problem',difficulty:'Medium',topic:'Dynamic Programming',topics:['Array','Dynamic Programming'],
  companies:['TCS','Wipro','Infosys','Amazon','Flipkart'],frequency:84,rounds:['Round 1','DSA Round'],
  leetcodeLink:'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/',
  solution:{explanation:'dp[i][w]: max value using first i items with capacity w. Either include or exclude item i.',
    timeComplexity:'O(n*W)',spaceComplexity:'O(W)',followUpTips:'Classic DP — space optimize to 1D. Foundation for all knapsack variants.'} },

{ title:'Counting Subsequences',difficulty:'Medium',topic:'Dynamic Programming',topics:['String','Dynamic Programming'],
  companies:['Amazon','Google','Microsoft'],frequency:68,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/count-the-number-of-matching-subsequences/',
  solution:{explanation:'Track next expected character for each word. Process characters of s one by one.',
    timeComplexity:'O(S + W)',spaceComplexity:'O(W)',followUpTips:'Group words by their current expected character — efficient batch processing.'} },

// ========== GRAPHS ==========
{ title:'Rotting Oranges',difficulty:'Medium',topic:'Graphs',topics:['Array','BFS','Matrix'],
  companies:['Amazon','Microsoft','Google','Flipkart'],frequency:80,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/rotting-oranges/',
  solution:{explanation:'Multi-source BFS from all rotten oranges simultaneously. Count minutes.',
    timeComplexity:'O(m*n)',spaceComplexity:'O(m*n)',followUpTips:'Multi-source BFS — enqueue all sources initially. Classic level-by-level approach.'} },

{ title:'Pacific Atlantic Water Flow',difficulty:'Medium',topic:'Graphs',topics:['Array','DFS','BFS','Matrix'],
  companies:['Amazon','Google','Microsoft'],frequency:74,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/pacific-atlantic-water-flow/',
  solution:{explanation:'Reverse flow — BFS/DFS from edges of both oceans. Intersection is answer.',
    timeComplexity:'O(m*n)',spaceComplexity:'O(m*n)',followUpTips:'Reverse thinking: water flows up from ocean. Two BFS sets intersect.'} },

{ title:'Flood Fill',difficulty:'Easy',topic:'Graphs',topics:['Array','DFS','BFS','Matrix'],
  companies:['TCS','Wipro','Amazon','Microsoft'],frequency:82,rounds:['Online Test','Round 1'],
  leetcodeLink:'https://leetcode.com/problems/flood-fill/',
  solution:{explanation:'DFS/BFS from start. Change connected cells of same color to new color.',
    timeComplexity:'O(m*n)',spaceComplexity:'O(m*n)',followUpTips:'Check if newColor == oldColor to avoid infinite loop.'} },

{ title:'Find the Town Judge',difficulty:'Easy',topic:'Graphs',topics:['Array','Hash Table','Graph'],
  companies:['TCS','Wipro','Amazon'],frequency:76,rounds:['Online Test','Round 1'],
  leetcodeLink:'https://leetcode.com/problems/find-the-town-judge/',
  solution:{explanation:'Track in-degree and out-degree. Judge has in-degree=n-1 and out-degree=0.',
    timeComplexity:'O(n)',spaceComplexity:'O(n)',followUpTips:'Can combine to single array: trust[i] = in[i] - out[i]. Judge has n-1.'} },

{ title:'Redundant Connection',difficulty:'Medium',topic:'Graphs',topics:['DFS','BFS','Union Find','Graph'],
  companies:['Amazon','Google','Microsoft'],frequency:70,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/redundant-connection/',
  solution:{explanation:'Union-Find: for each edge, if both nodes already in same component, it\'s redundant.',
    timeComplexity:'O(n * alpha(n))',spaceComplexity:'O(n)',followUpTips:'Union-Find with path compression. Return last edge that creates a cycle.'} },

{ title:'Network Delay Time',difficulty:'Medium',topic:'Graphs',topics:['Depth-First Search','Graph','Heap','Shortest Path'],
  companies:['Amazon','Google','Microsoft'],frequency:72,rounds:['DSA Round','Final Round'],
  leetcodeLink:'https://leetcode.com/problems/network-delay-time/',
  solution:{explanation:'Dijkstra\'s from node k. Max of all shortest distances = answer. -1 if any unreachable.',
    timeComplexity:'O((V+E) log V)',spaceComplexity:'O(V+E)',followUpTips:'Classic Dijkstra — use min-heap. Know Bellman-Ford for negative weights.'} },

// ========== BACKTRACKING ==========
{ title:'Permutations',difficulty:'Medium',topic:'Backtracking',topics:['Array','Backtracking'],
  companies:['Amazon','Microsoft','Google','Meta'],frequency:82,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/permutations/',
  solution:{explanation:'Backtracking: swap current index with each remaining, recurse, swap back.',
    timeComplexity:'O(n*n!)',spaceComplexity:'O(n)',followUpTips:'With duplicates (LC 47): sort + skip duplicates at same depth level.'} },

{ title:'Subsets',difficulty:'Medium',topic:'Backtracking',topics:['Array','Backtracking','Bit Manipulation'],
  companies:['Amazon','Microsoft','Google'],frequency:80,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/subsets/',
  solution:{explanation:'Backtracking: at each index, include or exclude. Or bit masking with 2^n iterations.',
    timeComplexity:'O(2^n)',spaceComplexity:'O(n)',followUpTips:'With duplicates (LC 90): sort + skip if same as previous at same level.'} },

{ title:'Combination Sum',difficulty:'Medium',topic:'Backtracking',topics:['Array','Backtracking'],
  companies:['Amazon','Microsoft','Google','Meta'],frequency:79,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/combination-sum/',
  solution:{explanation:'Backtracking: start from index i, include candidate (can reuse), recurse. Prune if sum > target.',
    timeComplexity:'O(n^(T/M))',spaceComplexity:'O(T/M)',followUpTips:'No duplicates variant (LC 40): sort + skip same value at same level.'} },

{ title:'Letter Combinations of a Phone Number',difficulty:'Medium',topic:'Backtracking',topics:['Hash Table','String','Backtracking'],
  companies:['Amazon','Google','Microsoft','Meta'],frequency:77,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
  solution:{explanation:'Backtracking: for each digit map to its letters, recurse for each char.',
    timeComplexity:'O(4^n * n)',spaceComplexity:'O(n)',followUpTips:'Edge case: empty string input. Use digit-to-letters map.'} },

{ title:'N-Queens',difficulty:'Hard',topic:'Backtracking',topics:['Array','Backtracking'],
  companies:['Amazon','Google','Microsoft'],frequency:68,rounds:['DSA Round','Final Round'],
  leetcodeLink:'https://leetcode.com/problems/n-queens/',
  solution:{explanation:'Track columns, diagonals (r-c), anti-diagonals (r+c) in sets. Place row by row.',
    timeComplexity:'O(n!)',spaceComplexity:'O(n)',followUpTips:'3 hash sets for O(1) conflict check. Classic constraint satisfaction.'} },

// ========== STRINGS ==========
{ title:'Reverse Words in a String',difficulty:'Medium',topic:'Strings',topics:['Two Pointers','String'],
  companies:['TCS','Wipro','Amazon','Microsoft'],frequency:83,rounds:['Online Test','Round 1'],
  leetcodeLink:'https://leetcode.com/problems/reverse-words-in-a-string/',
  solution:{explanation:'Split on whitespace, reverse array, join with single space.',
    timeComplexity:'O(n)',spaceComplexity:'O(n)',followUpTips:'In-place: reverse entire string, then reverse each word.'} },

{ title:'Longest Common Prefix',difficulty:'Easy',topic:'Strings',topics:['String','Trie'],
  companies:['TCS','Wipro','Infosys','Amazon'],frequency:85,rounds:['Online Test','Round 1'],
  leetcodeLink:'https://leetcode.com/problems/longest-common-prefix/',
  solution:{explanation:'Take first string as prefix, trim from end while others don\'t start with it.',
    timeComplexity:'O(S)',spaceComplexity:'O(1)',followUpTips:'Vertical scan or binary search on prefix length also valid.'} },

{ title:'Roman to Integer',difficulty:'Easy',topic:'Strings',topics:['Hash Table','Math','String'],
  companies:['TCS','Wipro','Infosys','Cognizant'],frequency:86,rounds:['Online Test'],
  leetcodeLink:'https://leetcode.com/problems/roman-to-integer/',
  solution:{explanation:'If current value < next value, subtract. Otherwise add.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'The subtraction rule: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.'} },

{ title:'String to Integer (atoi)',difficulty:'Medium',topic:'Strings',topics:['String'],
  companies:['Amazon','Microsoft','Google'],frequency:74,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/string-to-integer-atoi/',
  solution:{explanation:'Skip spaces, read sign, read digits while in INT range. Clamp overflow.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Edge cases: leading spaces, sign, overflow, non-digit chars. Very detail-oriented.'} },

{ title:'Count and Say',difficulty:'Medium',topic:'Strings',topics:['String'],
  companies:['TCS','Wipro','Infosys'],frequency:78,rounds:['Online Test','Round 1'],
  leetcodeLink:'https://leetcode.com/problems/count-and-say/',
  solution:{explanation:'Iteratively build next string by counting consecutive characters.',
    timeComplexity:'O(2^n)',spaceComplexity:'O(2^n)',followUpTips:'Simple simulation — careful with end-of-string last group.'} },

// ========== BIT MANIPULATION ==========
{ title:'Number of 1 Bits',difficulty:'Easy',topic:'Bit Manipulation',topics:['Divide and Conquer','Bit Manipulation'],
  companies:['TCS','Wipro','Infosys','Amazon'],frequency:82,rounds:['Online Test'],
  leetcodeLink:'https://leetcode.com/problems/number-of-1-bits/',
  solution:{explanation:'n & (n-1) removes lowest set bit. Count iterations until n = 0.',
    timeComplexity:'O(k) k=set bits',spaceComplexity:'O(1)',followUpTips:'Kernighan\'s trick — or use __builtin_popcount in C++.'} },

{ title:'Reverse Bits',difficulty:'Easy',topic:'Bit Manipulation',topics:['Divide and Conquer','Bit Manipulation'],
  companies:['TCS','Wipro','Amazon'],frequency:79,rounds:['Online Test'],
  leetcodeLink:'https://leetcode.com/problems/reverse-bits/',
  solution:{explanation:'For 32 bits: extract LSB (n&1), shift left into result, right-shift n.',
    timeComplexity:'O(1)',spaceComplexity:'O(1)',followUpTips:'With caching: use memoized byte-reversal table for repeated calls.'} },

{ title:'Power of Two',difficulty:'Easy',topic:'Bit Manipulation',topics:['Math','Bit Manipulation','Recursion'],
  companies:['TCS','Wipro','Infosys'],frequency:80,rounds:['Online Test'],
  leetcodeLink:'https://leetcode.com/problems/power-of-two/',
  solution:{explanation:'n > 0 && (n & (n-1)) == 0. Powers of 2 have exactly one set bit.',
    timeComplexity:'O(1)',spaceComplexity:'O(1)',followUpTips:'n & (n-1) removes lowest set bit — classic bit trick.'} },

{ title:'Sum of Two Integers',difficulty:'Medium',topic:'Bit Manipulation',topics:['Math','Bit Manipulation'],
  companies:['Amazon','Microsoft','Google'],frequency:73,rounds:['Round 1','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/sum-of-two-integers/',
  solution:{explanation:'XOR = sum without carry. AND << 1 = carry. Repeat until carry = 0.',
    timeComplexity:'O(1)',spaceComplexity:'O(1)',followUpTips:'In Python handle 32-bit overflow with masking: a & 0xFFFFFFFF.'} },

// ========== HEAP / PRIORITY QUEUE ==========
{ title:'Kth Largest Element in an Array',difficulty:'Medium',topic:'Heap',topics:['Array','Divide and Conquer','Sorting','Heap'],
  companies:['Amazon','Microsoft','Google','Meta'],frequency:83,rounds:['Round 1','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/kth-largest-element-in-an-array/',
  solution:{explanation:'Min-heap of size k. Final top = kth largest. Or QuickSelect O(n) avg.',
    timeComplexity:'O(n log k)',spaceComplexity:'O(k)',followUpTips:'QuickSelect gives O(n) average — explain partition-based approach.'} },

{ title:'Task Scheduler',difficulty:'Medium',topic:'Heap',topics:['Array','Hash Table','Greedy','Heap','Counting'],
  companies:['Amazon','Microsoft','Google'],frequency:74,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/task-scheduler/',
  solution:{explanation:'Math: max_freq task drives answer. (max_freq-1)*(n+1) + count_of_max_freq.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'O(n) formula beats heap simulation. Understand idle time concept.'} },

{ title:'Last Stone Weight',difficulty:'Easy',topic:'Heap',topics:['Array','Heap','Greedy'],
  companies:['TCS','Amazon','Microsoft'],frequency:74,rounds:['Round 1','Online Test'],
  leetcodeLink:'https://leetcode.com/problems/last-stone-weight/',
  solution:{explanation:'Max-heap: smash 2 largest repeatedly. If unequal, push difference.',
    timeComplexity:'O(n log n)',spaceComplexity:'O(n)',followUpTips:'Simple greedy with max-heap. In Java/Python: negate for min-heap.'} },

// ========== TWO POINTERS ==========
{ title:'3Sum Closest',difficulty:'Medium',topic:'Array',topics:['Array','Two Pointers','Sorting'],
  companies:['Amazon','Google','Microsoft'],frequency:74,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/3sum-closest/',
  solution:{explanation:'Sort, fix one pointer, two pointers for rest. Track closest sum.',
    timeComplexity:'O(n²)',spaceComplexity:'O(log n)',followUpTips:'Same pattern as 3Sum — sort first, then two pointers.'} },

{ title:'Valid Palindrome',difficulty:'Easy',topic:'Strings',topics:['Two Pointers','String'],
  companies:['TCS','Wipro','Amazon','Microsoft'],frequency:85,rounds:['Online Test','Round 1'],
  leetcodeLink:'https://leetcode.com/problems/valid-palindrome/',
  solution:{explanation:'Two pointers from ends. Skip non-alphanumeric. Compare lowercase chars.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'isAlphanumeric check — don\'t use regex for performance.'} },

{ title:'Sort Colors',difficulty:'Medium',topic:'Array',topics:['Array','Two Pointers','Sorting'],
  companies:['TCS','Wipro','Amazon','Microsoft'],frequency:81,rounds:['Round 1','Online Test'],
  leetcodeLink:'https://leetcode.com/problems/sort-colors/',
  solution:{explanation:'Dutch National Flag: three pointers low, mid, high. Swap based on value.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'One-pass O(n) with 3 pointers. Classic DNF algorithm.'} },

// ========== MATRIX ==========
{ title:'Search a 2D Matrix',difficulty:'Medium',topic:'Array',topics:['Array','Binary Search','Matrix'],
  companies:['Amazon','Microsoft','Google','TCS'],frequency:78,rounds:['Round 1','Round 2'],
  leetcodeLink:'https://leetcode.com/problems/search-a-2d-matrix/',
  solution:{explanation:'Treat matrix as 1D sorted array. mid = row*cols+col via index arithmetic.',
    timeComplexity:'O(log(m*n))',spaceComplexity:'O(1)',followUpTips:'Start from top-right: move left if too big, down if too small — O(m+n).'} },

// ========== GREEDY ==========
{ title:'Gas Station',difficulty:'Medium',topic:'Greedy',topics:['Array','Greedy'],
  companies:['Amazon','Google','Microsoft'],frequency:73,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/gas-station/',
  solution:{explanation:'If total gas >= total cost, solution exists. Start from first non-negative cumulative.',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Greedy insight: if sum fails at i, no starting point in [0..i] can succeed.'} },

{ title:'Assign Cookies',difficulty:'Easy',topic:'Greedy',topics:['Array','Greedy','Sorting'],
  companies:['TCS','Wipro','Infosys'],frequency:76,rounds:['Online Test'],
  leetcodeLink:'https://leetcode.com/problems/assign-cookies/',
  solution:{explanation:'Sort both. Greedily assign smallest sufficient cookie to least greedy child.',
    timeComplexity:'O(n log n)',spaceComplexity:'O(1)',followUpTips:'Classic greedy — matching smallest sufficient resource to smallest need.'} },

// ========== MATH ==========
{ title:'Pow(x, n)',difficulty:'Medium',topic:'Array',topics:['Math','Recursion'],
  companies:['Amazon','Microsoft','Google','TCS'],frequency:79,rounds:['Round 1','Online Test'],
  leetcodeLink:'https://leetcode.com/problems/powx-n/',
  solution:{explanation:'Fast exponentiation: if n even, pow(x*x, n/2). If odd, x * pow(x*x, n/2).',
    timeComplexity:'O(log n)',spaceComplexity:'O(log n)',followUpTips:'Handle negative n: 1/pow(x,-n). O(log n) is key differentiator.'} },

{ title:'Excel Sheet Column Number',difficulty:'Easy',topic:'Strings',topics:['Math','String'],
  companies:['TCS','Wipro','Infosys','Cognizant'],frequency:80,rounds:['Online Test'],
  leetcodeLink:'https://leetcode.com/problems/excel-sheet-column-number/',
  solution:{explanation:'Base-26 conversion: result = result*26 + (char - \'A\' + 1).',
    timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Like binary to decimal but base 26. TCS NQT common type.'} },

{ title:'Happy Number',difficulty:'Easy',topic:'Hash Table',topics:['Hash Table','Math','Two Pointers'],
  companies:['TCS','Wipro','Amazon'],frequency:77,rounds:['Online Test'],
  leetcodeLink:'https://leetcode.com/problems/happy-number/',
  solution:{explanation:'Detect cycle using Floyd\'s or HashSet. If sum of digit squares reaches 1, happy.',
    timeComplexity:'O(log n)',spaceComplexity:'O(1)',followUpTips:'Floyd\'s cycle works since non-happy numbers enter a cycle.'} },

// ========== DESIGN ==========
{ title:'LRU Cache',difficulty:'Medium',topic:'Design',topics:['Hash Table','Linked List','Design'],
  companies:['Amazon','Microsoft','Google','Meta','Flipkart'],frequency:85,rounds:['Round 2','DSA Round'],
  leetcodeLink:'https://leetcode.com/problems/lru-cache/',
  solution:{explanation:'HashMap + Doubly Linked List. HashMap for O(1) lookup, DLL for O(1) move-to-front.',
    timeComplexity:'O(1) all ops',spaceComplexity:'O(capacity)',followUpTips:'Implement get and put both O(1). Use sentinel head/tail nodes.'} },

{ title:'Design HashMap',difficulty:'Easy',topic:'Design',topics:['Array','Hash Table','Linked List','Design'],
  companies:['TCS','Wipro','Amazon','Microsoft'],frequency:78,rounds:['Round 1','Online Test'],
  leetcodeLink:'https://leetcode.com/problems/design-hashmap/',
  solution:{explanation:'Array of buckets with chaining (LinkedList). Size 1000, hash = key%size.',
    timeComplexity:'O(1) avg',spaceComplexity:'O(n)',followUpTips:'Discuss hash function, collision resolution (chaining vs probing).'} },

];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let added = 0, skipped = 0;

    for (const q of questions) {
      const exists = await Question.findOne({ title: q.title });
      if (exists) { skipped++; continue; }

      const last = await Question.findOne().sort({ questionNumber: -1 }).select('questionNumber');
      q.questionNumber = (last?.questionNumber || 0) + 1;
      q.topics = q.topics || [q.topic];

      await Question.create(q);
      added++;
      process.stdout.write(`\r  Added ${added} questions...`);
    }

    console.log(`\n\nDone! Added: ${added}, Skipped (duplicates): ${skipped}`);
    console.log(`Total questions in DB: ${await Question.countDocuments()}`);
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
