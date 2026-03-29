require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Question = require('../models/Question');

const updates = [
  { title:'Container With Most Water',
    description:'Given array <code>height</code> of n integers, find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water.',
    examples:[{input:'height=[1,8,6,2,5,4,8,3,7]',output:'49',explanation:'Lines at index 1 and 8 (heights 8,7) — min(8,7)*(8-1)=49'},{input:'height=[1,1]',output:'1'}],
    constraints:['n == height.length','2 ≤ n ≤ 10⁵','0 ≤ height[i] ≤ 10⁴'],
    hints:['Use two pointers starting from both ends','Move the pointer with the smaller height inward'] },

  { title:'Move Zeroes',
    description:'Given integer array <code>nums</code>, move all <code>0</code>s to the end while maintaining relative order of non-zero elements. Do this in-place.',
    examples:[{input:'nums=[0,1,0,3,12]',output:'[1,3,12,0,0]'},{input:'nums=[0]',output:'[0]'}],
    constraints:['1 ≤ nums.length ≤ 10⁴','-2³¹ ≤ nums[i] ≤ 2³¹-1'],
    hints:['Two pointers: slow tracks next non-zero position','Swap nums[slow] with nums[fast] when nums[fast] != 0'] },

  { title:'Find All Numbers Disappeared in Array',
    description:'Given array <code>nums</code> of n integers where nums[i] is in range [1, n], return all integers in [1, n] that do not appear in nums.',
    examples:[{input:'nums=[4,3,2,7,8,2,3,1]',output:'[5,6]'},{input:'nums=[1,1]',output:'[2]'}],
    constraints:['n == nums.length','1 ≤ n ≤ 10⁵','1 ≤ nums[i] ≤ n'],
    hints:['Negate value at index nums[i]-1 to mark as visited','Indices with positive values are the missing numbers'] },

  { title:'Rotate Image',
    description:'Given an n×n 2D matrix, rotate it 90 degrees clockwise in-place.',
    examples:[{input:'matrix=[[1,2,3],[4,5,6],[7,8,9]]',output:'[[7,4,1],[8,5,2],[9,6,3]]'},{input:'matrix=[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]',output:'[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]'}],
    constraints:['n == matrix.length == matrix[i].length','1 ≤ n ≤ 20','-1000 ≤ matrix[i][j] ≤ 1000'],
    hints:['First transpose the matrix (swap matrix[i][j] with matrix[j][i])','Then reverse each row'] },

  { title:'Set Matrix Zeroes',
    description:'Given an m×n integer matrix, if an element is 0, set its entire row and column to 0 in-place.',
    examples:[{input:'matrix=[[1,1,1],[1,0,1],[1,1,1]]',output:'[[1,0,1],[0,0,0],[1,0,1]]'},{input:'matrix=[[0,1,2,0],[3,4,5,2],[1,3,1,5]]',output:'[[0,0,0,0],[0,4,5,0],[0,3,1,0]]'}],
    constraints:['m == matrix.length','n == matrix[0].length','1 ≤ m,n ≤ 200','-2³¹ ≤ matrix[i][j] ≤ 2³¹-1'],
    hints:['Use first row and first column as markers','Track separately if first row/col themselves have zeros'] },

  { title:"Pascal's Triangle",
    description:'Given integer <code>numRows</code>, return the first numRows of Pascal\'s triangle where each number is the sum of the two numbers directly above it.',
    examples:[{input:'numRows=5',output:'[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]'},{input:'numRows=1',output:'[[1]]'}],
    constraints:['1 ≤ numRows ≤ 30'],
    hints:['Each row starts and ends with 1','Middle elements: triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j]'] },

  { title:'Majority Element',
    description:'Given array <code>nums</code> of size n, return the majority element (appears more than ⌊n/2⌋ times). The majority element always exists.',
    examples:[{input:'nums=[3,2,3]',output:'3'},{input:'nums=[2,2,1,1,1,2,2]',output:'2'}],
    constraints:['n == nums.length','1 ≤ n ≤ 5×10⁴','-10⁹ ≤ nums[i] ≤ 10⁹'],
    hints:['Boyer-Moore Voting: maintain candidate and count','If count reaches 0, switch candidate to current element'] },

  { title:'Find Minimum in Rotated Sorted Array',
    description:'Given sorted array rotated between 1 and n times, find the minimum element. Array has no duplicates.',
    examples:[{input:'nums=[3,4,5,1,2]',output:'1',explanation:'Original array [1,2,3,4,5] rotated 3 times'},{input:'nums=[4,5,6,7,0,1,2]',output:'0'},{input:'nums=[11,13,15,17]',output:'11'}],
    constraints:['n == nums.length','1 ≤ n ≤ 5000','-5000 ≤ nums[i] ≤ 5000','All integers are unique'],
    hints:['Use binary search','If nums[mid] > nums[right], minimum is in the right half'] },

  { title:'Koko Eating Bananas',
    description:'Koko has piles of bananas. Each hour she eats at most k bananas from one pile. Given h hours, find minimum k such that she can eat all bananas.',
    examples:[{input:'piles=[3,6,7,11], h=8',output:'4'},{input:'piles=[30,11,23,4,20], h=5',output:'30'}],
    constraints:['1 ≤ piles.length ≤ 10⁴','1 ≤ piles[i] ≤ 10⁹','piles.length ≤ h ≤ 10⁹'],
    hints:['Binary search on the answer (speed k)','Check if eating at speed k finishes within h hours'] },

  { title:'Binary Search',
    description:'Given sorted array of n integers and a target, return index of target. If not found, return -1.',
    examples:[{input:'nums=[-1,0,3,5,9,12], target=9',output:'4'},{input:'nums=[-1,0,3,5,9,12], target=2',output:'-1'}],
    constraints:['1 ≤ nums.length ≤ 10⁴','-10⁴ ≤ nums[i],target ≤ 10⁴','All values in nums are unique','nums is sorted in ascending order'],
    hints:['Set left=0, right=n-1','Calculate mid=(left+right)/2, compare nums[mid] with target'] },

  { title:'Capacity To Ship Packages Within D Days',
    description:'Conveyor belt has packages with weights. Ship packages in order within d days. Find minimum weight capacity of ship.',
    examples:[{input:'weights=[1,2,3,4,5,6,7,8,9,10], days=5',output:'15'},{input:'weights=[3,2,2,4,1,4], days=3',output:'6'}],
    constraints:['1 ≤ days ≤ weights.length ≤ 5×10⁴','1 ≤ weights[i] ≤ 500'],
    hints:['Binary search: lo=max(weights), hi=sum(weights)','Check greedily if capacity c can ship all within days'] },

  { title:'Permutation in String',
    description:'Given strings <code>s1</code> and <code>s2</code>, return true if <code>s2</code> contains a permutation of <code>s1</code>.',
    examples:[{input:'s1="ab", s2="eidbaooo"',output:'true',explanation:'"ba" is permutation of "ab"'},{input:'s1="ab", s2="eidboaoo"',output:'false'}],
    constraints:['1 ≤ s1.length, s2.length ≤ 10⁴','s1 and s2 consist of lowercase English letters'],
    hints:['Fixed-size sliding window of length s1','Compare character frequency maps of window and s1'] },

  { title:'Max Consecutive Ones III',
    description:'Given binary array <code>nums</code> and integer <code>k</code>, return maximum consecutive 1s if you can flip at most k 0s.',
    examples:[{input:'nums=[1,1,1,0,0,0,1,1,1,1,0], k=2',output:'6'},{input:'nums=[0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1,0], k=3',output:'10'}],
    constraints:['1 ≤ nums.length ≤ 10⁵','nums[i] is 0 or 1','0 ≤ k ≤ nums.length'],
    hints:['Sliding window: count zeros in window','Shrink window from left when zeros > k'] },

  { title:'Longest Repeating Character Replacement',
    description:'Given string <code>s</code> and integer <code>k</code>, you can replace at most k characters. Find the length of the longest substring with all same characters.',
    examples:[{input:'s="ABAB", k=2',output:'4',explanation:'Replace 2 A\'s with B or vice versa'},{input:'s="AABABBA", k=1',output:'4'}],
    constraints:['1 ≤ s.length ≤ 10⁵','s consists of uppercase English letters','0 ≤ k ≤ s.length'],
    hints:['Window is valid if (window_size - max_frequency) <= k','Max frequency never needs to decrease'] },

  { title:'Min Stack',
    description:'Design a stack that supports push, pop, top, and retrieving the minimum element — all in O(1) time.',
    examples:[{input:'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()',output:'-3, 0, -2',explanation:'After pop: top=0, min=-2'}],
    constraints:['Method calls will always be valid (pop/top/getMin on non-empty stack)','At most 3×10⁴ calls'],
    hints:['Use an auxiliary stack to track minimums','Push to min stack when new value <= current min'] },

  { title:'Evaluate Reverse Polish Notation',
    description:'Evaluate arithmetic expression in Reverse Polish Notation (postfix). Return the integer result.',
    examples:[{input:'tokens=["2","1","+","3","*"]',output:'9',explanation:'((2+1)*3)=9'},{input:'tokens=["4","13","5","/","+"]',output:'6',explanation:'(4+(13/5))=6'}],
    constraints:['1 ≤ tokens.length ≤ 10⁴','tokens[i] is integer or one of "+","-","*","/"'],
    hints:['Use a stack: push numbers, pop two on operator','For division, truncate toward zero'] },

  { title:'Next Greater Element I',
    description:'For each element in <code>nums1</code> (subset of <code>nums2</code>), find the next greater element in <code>nums2</code>. Return -1 if none exists.',
    examples:[{input:'nums1=[4,1,2], nums2=[1,3,4,2]',output:'[-1,3,-1]'},{input:'nums1=[2,4], nums2=[1,2,3,4]',output:'[3,-1]'}],
    constraints:['1 ≤ nums1.length ≤ nums2.length ≤ 1000','0 ≤ nums1[i],nums2[i] ≤ 10⁴','All values are unique'],
    hints:['Use monotonic decreasing stack on nums2','Store result in HashMap: element → next greater'] },

  { title:'Generate Parentheses',
    description:'Given n pairs of parentheses, generate all combinations of well-formed parentheses.',
    examples:[{input:'n=3',output:'["((()))","(()())","(())()","()(())","()()()"]'},{input:'n=1',output:'["()"]'}],
    constraints:['1 ≤ n ≤ 8'],
    hints:['Backtracking: add "(" if open < n, add ")" if close < open','Base case: when string length = 2*n, add to result'] },

  { title:'Merge Two Sorted Lists',
    description:'Merge two sorted linked lists and return the merged list (sorted).',
    examples:[{input:'list1=[1,2,4], list2=[1,3,4]',output:'[1,1,2,3,4,4]'},{input:'list1=[], list2=[]',output:'[]'},{input:'list1=[], list2=[0]',output:'[0]'}],
    constraints:['0 ≤ number of nodes ≤ 50','-100 ≤ Node.val ≤ 100','Both lists are sorted in non-decreasing order'],
    hints:['Use a dummy head node to simplify edge cases','Compare heads, link the smaller one, advance that pointer'] },

  { title:'Add Two Numbers',
    description:'Two non-empty linked lists represent non-negative integers in reverse order. Add and return the sum as a linked list.',
    examples:[{input:'l1=[2,4,3], l2=[5,6,4]',output:'[7,0,8]',explanation:'342+465=807'},{input:'l1=[0], l2=[0]',output:'[0]'},{input:'l1=[9,9,9,9], l2=[9,9,9]',output:'[8,9,9,0,1]'}],
    constraints:['1 ≤ number of nodes ≤ 100','0 ≤ Node.val ≤ 9','No leading zeros except the number 0'],
    hints:['Traverse both lists simultaneously with carry','If one list ends, continue with the other and carry'] },

  { title:'Remove Nth Node From End of List',
    description:'Given linked list, remove the nth node from the end and return the head.',
    examples:[{input:'head=[1,2,3,4,5], n=2',output:'[1,2,3,5]'},{input:'head=[1], n=1',output:'[]'},{input:'head=[1,2], n=1',output:'[1]'}],
    constraints:['1 ≤ sz ≤ 30','0 ≤ Node.val ≤ 100','1 ≤ n ≤ sz'],
    hints:['Two pointers: advance fast pointer n steps first','When fast reaches end, slow is at the node before target'] },

  { title:'Middle of the Linked List',
    description:'Given head of singly linked list, return the middle node. If two middle nodes, return the second.',
    examples:[{input:'head=[1,2,3,4,5]',output:'[3,4,5]',explanation:'Middle node is 3'},{input:'head=[1,2,3,4,5,6]',output:'[4,5,6]',explanation:'Two middles: 3 and 4, return 4'}],
    constraints:['1 ≤ number of nodes ≤ 100','1 ≤ Node.val ≤ 100'],
    hints:['Slow/fast pointer: slow moves 1 step, fast moves 2','When fast reaches end, slow is at middle'] },

  { title:'Palindrome Linked List',
    description:'Given head of linked list, return true if it is a palindrome.',
    examples:[{input:'head=[1,2,2,1]',output:'true'},{input:'head=[1,2]',output:'false'}],
    constraints:['1 ≤ number of nodes ≤ 10⁵','0 ≤ Node.val ≤ 9'],
    hints:['Find middle using slow/fast pointers','Reverse second half and compare with first half'] },

  { title:'Invert Binary Tree',
    description:'Given root of binary tree, invert (mirror) the tree and return its root.',
    examples:[{input:'root=[4,2,7,1,3,6,9]',output:'[4,7,2,9,6,3,1]'},{input:'root=[2,1,3]',output:'[2,3,1]'},{input:'root=[]',output:'[]'}],
    constraints:['0 ≤ number of nodes ≤ 100','-100 ≤ Node.val ≤ 100'],
    hints:['Swap left and right children at every node','Do this recursively for all nodes'] },

  { title:'Diameter of Binary Tree',
    description:'Given root of binary tree, return the length of the diameter (longest path between any two nodes — path may not pass through root).',
    examples:[{input:'root=[1,2,3,4,5]',output:'3',explanation:'Path [4,2,1,3] or [5,2,1,3] has length 3'},{input:'root=[1,2]',output:'1'}],
    constraints:['1 ≤ number of nodes ≤ 10⁴','-100 ≤ Node.val ≤ 100'],
    hints:['At each node: diameter = leftHeight + rightHeight','Track global maximum while computing heights via DFS'] },

  { title:'Binary Tree Right Side View',
    description:'Given root of binary tree, return values of nodes visible when viewed from the right side (top to bottom).',
    examples:[{input:'root=[1,2,3,null,5,null,4]',output:'[1,3,4]'},{input:'root=[1,null,3]',output:'[1,3]'},{input:'root=[]',output:'[]'}],
    constraints:['0 ≤ number of nodes ≤ 100','-100 ≤ Node.val ≤ 100'],
    hints:['BFS level order: take the last element of each level','Or DFS: visit right child first, add node if depth == result.size()'] },

  { title:'Kth Smallest Element in a BST',
    description:'Given root of BST and integer k, return the kth smallest value (1-indexed).',
    examples:[{input:'root=[3,1,4,null,2], k=1',output:'1'},{input:'root=[5,3,6,2,4,null,null,1], k=3',output:'3'}],
    constraints:['1 ≤ k ≤ n ≤ 10⁴','0 ≤ Node.val ≤ 10⁴'],
    hints:['Inorder traversal of BST gives sorted sequence','Count nodes during inorder — return when count == k'] },

  { title:'Construct Binary Tree from Preorder and Inorder',
    description:'Given preorder and inorder traversal arrays, construct and return the binary tree.',
    examples:[{input:'preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]',output:'[3,9,20,null,null,15,7]'},{input:'preorder=[−1], inorder=[−1]',output:'[-1]'}],
    constraints:['1 ≤ n ≤ 3000','-3000 ≤ preorder[i],inorder[i] ≤ 3000','preorder and inorder are permutations of same elements'],
    hints:['preorder[0] is always the root','Find root in inorder to split left/right subtrees','Use HashMap for O(1) inorder index lookup'] },

  { title:'Path Sum',
    description:'Given root of binary tree and integer <code>targetSum</code>, return true if there is a root-to-leaf path where node values sum to targetSum.',
    examples:[{input:'root=[5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum=22',output:'true',explanation:'Path 5→4→11→2 = 22'},{input:'root=[1,2,3], targetSum=5',output:'false'}],
    constraints:['0 ≤ number of nodes ≤ 5000','-1000 ≤ Node.val ≤ 1000','-1000 ≤ targetSum ≤ 1000'],
    hints:['Subtract node value from target at each step','At leaf: check if remaining == 0'] },

  { title:'Sum Root to Leaf Numbers',
    description:'Given binary tree where each node has a digit 0-9, each root-to-leaf path represents a number. Return the total sum of all root-to-leaf numbers.',
    examples:[{input:'root=[1,2,3]',output:'25',explanation:'1→2=12, 1→3=13, total=25'},{input:'root=[4,9,0,5,1]',output:'1026',explanation:'4→9→5=495, 4→9→1=491, 4→0=40, total=1026'}],
    constraints:['1 ≤ number of nodes ≤ 1000','0 ≤ Node.val ≤ 9','Depth ≤ 10'],
    hints:['DFS: pass current number = prevNum*10 + node.val','At leaf node, add current number to total'] },

  { title:'Balanced Binary Tree',
    description:'Given binary tree, determine if it is height-balanced (depth of two subtrees of every node never differs by more than 1).',
    examples:[{input:'root=[3,9,20,null,null,15,7]',output:'true'},{input:'root=[1,2,2,3,3,null,null,4,4]',output:'false'},{input:'root=[]',output:'true'}],
    constraints:['0 ≤ number of nodes ≤ 5000','-10⁴ ≤ Node.val ≤ 10⁴'],
    hints:['Return -1 as sentinel for "unbalanced" from DFS','If |leftH - rightH| > 1 or either child returns -1, return -1'] },

  { title:'Symmetric Tree',
    description:'Given root of binary tree, check if it is a mirror of itself (symmetric around its center).',
    examples:[{input:'root=[1,2,2,3,4,4,3]',output:'true'},{input:'root=[1,2,2,null,3,null,3]',output:'false'}],
    constraints:['1 ≤ number of nodes ≤ 1000','-100 ≤ Node.val ≤ 100'],
    hints:['Recursively check if left.left mirrors right.right','And left.right mirrors right.left'] },

  { title:'Flatten Binary Tree to Linked List',
    description:'Given root of binary tree, flatten it to a linked list in-place (preorder traversal order using right pointers).',
    examples:[{input:'root=[1,2,5,3,4,null,6]',output:'[1,null,2,null,3,null,4,null,5,null,6]'},{input:'root=[]',output:'[]'}],
    constraints:['0 ≤ number of nodes ≤ 2000','-100 ≤ Node.val ≤ 100'],
    hints:['Morris traversal: find rightmost node of left subtree','Attach right subtree there, move left subtree to right'] },

  { title:'House Robber',
    description:'Array of non-negative integers representing money in each house. Cannot rob adjacent houses. Return maximum money you can rob.',
    examples:[{input:'nums=[1,2,3,1]',output:'4',explanation:'Rob house 1 (1) + house 3 (3) = 4'},{input:'nums=[2,7,9,3,1]',output:'12',explanation:'Rob house 1,3,5: 2+9+1=12'}],
    constraints:['1 ≤ nums.length ≤ 100','0 ≤ nums[i] ≤ 400'],
    hints:['dp[i] = max(dp[i-1], dp[i-2] + nums[i])','Optimize to O(1) space with two variables'] },

  { title:'House Robber II',
    description:'Houses arranged in a circle — first and last house are adjacent. Return maximum money you can rob.',
    examples:[{input:'nums=[2,3,2]',output:'3',explanation:'Cannot rob both house 1 and 3'},{input:'nums=[1,2,3,1]',output:'4'},{input:'nums=[1,2,3]',output:'3'}],
    constraints:['1 ≤ nums.length ≤ 100','0 ≤ nums[i] ≤ 1000'],
    hints:['Run House Robber I on nums[0..n-2] and nums[1..n-1]','Take maximum of both results'] },

  { title:'Longest Common Subsequence',
    description:'Given strings <code>text1</code> and <code>text2</code>, return the length of their longest common subsequence. Return 0 if none.',
    examples:[{input:'text1="abcde", text2="ace"',output:'3',explanation:'LCS is "ace"'},{input:'text1="abc", text2="abc"',output:'3'},{input:'text1="abc", text2="def"',output:'0'}],
    constraints:['1 ≤ text1.length,text2.length ≤ 1000','text1 and text2 consist of lowercase English letters'],
    hints:['dp[i][j]: LCS of text1[:i] and text2[:j]','If chars match: dp[i][j] = dp[i-1][j-1]+1, else max(dp[i-1][j], dp[i][j-1])'] },

  { title:'Edit Distance',
    description:'Given strings <code>word1</code> and <code>word2</code>, return minimum operations (insert/delete/replace) to convert word1 to word2.',
    examples:[{input:'word1="horse", word2="ros"',output:'3',explanation:'horse→rorse→rose→ros'},{input:'word1="intention", word2="execution"',output:'5'}],
    constraints:['0 ≤ word1.length,word2.length ≤ 500','words consist of lowercase English letters'],
    hints:['dp[i][j] = min ops to convert word1[:i] to word2[:j]','If chars equal: dp[i-1][j-1], else 1+min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])'] },

  { title:'Partition Equal Subset Sum',
    description:'Given integer array <code>nums</code>, return true if you can partition it into two subsets with equal sum.',
    examples:[{input:'nums=[1,5,11,5]',output:'true',explanation:'[1,5,5] and [11]'},{input:'nums=[1,2,3,5]',output:'false'}],
    constraints:['1 ≤ nums.length ≤ 200','1 ≤ nums[i] ≤ 100'],
    hints:['If total sum is odd, return false immediately','0/1 Knapsack: can we pick subset summing to total/2?','dp[j] = dp[j] || dp[j-num] (iterate j from target down to num)'] },

  { title:'Unique Paths',
    description:'Robot starts at top-left of m×n grid. Can only move right or down. Count paths to bottom-right corner.',
    examples:[{input:'m=3, n=7',output:'28'},{input:'m=3, n=2',output:'3',explanation:'R→D→D, D→R→D, D→D→R'}],
    constraints:['1 ≤ m,n ≤ 100'],
    hints:['dp[i][j] = dp[i-1][j] + dp[i][j-1]','First row and column are all 1s','Or use combinatorics: C(m+n-2, m-1)'] },

  { title:'Longest Increasing Subsequence',
    description:'Given integer array <code>nums</code>, return the length of the longest strictly increasing subsequence.',
    examples:[{input:'nums=[10,9,2,5,3,7,101,18]',output:'4',explanation:'[2,3,7,101]'},{input:'nums=[0,1,0,3,2,3]',output:'4'},{input:'nums=[7,7,7,7,7,7,7]',output:'1'}],
    constraints:['1 ≤ nums.length ≤ 2500','-10⁴ ≤ nums[i] ≤ 10⁴'],
    hints:['O(n²): dp[i] = max(dp[j]+1) for j<i where nums[j]<nums[i]','O(n log n): maintain sorted array, binary search for each element'] },

  { title:'0/1 Knapsack Problem',
    description:'Given weights and values of n items and capacity W, find the maximum value that can be put in a knapsack of capacity W. Each item can be used at most once.',
    examples:[{input:'weights=[1,3,4,5], values=[1,4,5,7], W=7',output:'9',explanation:'Items with weight 3 and 4 (values 4+5)'},{input:'weights=[1,2,3], values=[6,10,12], W=5',output:'22',explanation:'Items 2 and 3 (weights 2+3, values 10+12)'}],
    constraints:['1 ≤ n ≤ 1000','1 ≤ W ≤ 1000','1 ≤ weights[i],values[i] ≤ 1000'],
    hints:['dp[i][w] = max value using first i items with capacity w','Either skip item i or include it if weight[i] <= w','Optimize to 1D: iterate capacity from W down to weight[i]'] },

  { title:'Counting Subsequences',
    description:'Given strings array <code>words</code> and string <code>s</code>, return the number of words that are subsequences of s.',
    examples:[{input:'s="abcde", words=["a","bb","acd","ace"]',output:'3',explanation:'"a","acd","ace" are subsequences'},{input:'s="dsahjpjauf", words=["ahjpjau","ja","ahbwzgqnuk","tnmlanowax"]',output:'2'}],
    constraints:['1 ≤ s.length ≤ 5×10⁴','1 ≤ words.length ≤ 5000','1 ≤ words[i].length ≤ 50'],
    hints:['Group words by their current expected character','Process characters of s one by one, advance matching words'] },

  { title:'Rotting Oranges',
    description:'Grid with 0 (empty), 1 (fresh orange), 2 (rotten orange). Each minute, fresh orange adjacent to rotten becomes rotten. Return minutes until no fresh remain, or -1.',
    examples:[{input:'grid=[[2,1,1],[1,1,0],[0,1,1]]',output:'4'},{input:'grid=[[2,1,1],[0,1,1],[1,0,1]]',output:'-1'},{input:'grid=[[0,2]]',output:'0'}],
    constraints:['m == grid.length','n == grid[i].length','1 ≤ m,n ≤ 10','grid[i][j] is 0, 1, or 2'],
    hints:['Multi-source BFS: enqueue all rotten oranges initially','Count fresh oranges; BFS level by level = minutes','After BFS, if fresh > 0 return -1'] },

  { title:'Pacific Atlantic Water Flow',
    description:'Island m×n grid with heights. Rain water flows to adjacent cells with equal or lower height. Find cells that can flow to both Pacific (top/left) and Atlantic (bottom/right) oceans.',
    examples:[{input:'heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',output:'[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]'},{input:'heights=[[1]]',output:'[[0,0]]'}],
    constraints:['m == heights.length','n == heights[i].length','1 ≤ m,n ≤ 200','0 ≤ heights[i][j] ≤ 10⁵'],
    hints:['Reverse: BFS/DFS from ocean borders, water "flows up"','Cells reachable from both Pacific and Atlantic are answers'] },

  { title:'Flood Fill',
    description:'Given image (2D array), starting pixel <code>(sr,sc)</code> and new color, perform flood fill. Return modified image.',
    examples:[{input:'image=[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2',output:'[[2,2,2],[2,2,0],[2,0,1]]'},{input:'image=[[0,0,0],[0,0,0]], sr=0, sc=0, color=0',output:'[[0,0,0],[0,0,0]]'}],
    constraints:['m == image.length','n == image[i].length','1 ≤ m,n ≤ 50','0 ≤ image[i][j],color ≤ 65535'],
    hints:['DFS from (sr,sc), change all connected same-color cells','If new color == original color, return immediately to avoid infinite loop'] },

  { title:'Find the Town Judge',
    description:'In a town of n people, the judge trusts nobody and is trusted by everyone else. Given trust array [a,b] (a trusts b), find the judge or return -1.',
    examples:[{input:'n=2, trust=[[1,2]]',output:'2'},{input:'n=3, trust=[[1,3],[2,3]]',output:'3'},{input:'n=3, trust=[[1,3],[2,3],[3,1]]',output:'-1'}],
    constraints:['1 ≤ n ≤ 1000','0 ≤ trust.length ≤ 10⁴','trust[i].length == 2','All pairs are unique','a ≠ b'],
    hints:['Track in-degree (trusted by) and out-degree (trusts) for each person','Judge: in-degree == n-1 and out-degree == 0'] },

  { title:'Redundant Connection',
    description:'Tree of n nodes with n edges (one extra creates a cycle). Find the redundant edge (last one that creates cycle).',
    examples:[{input:'edges=[[1,2],[1,3],[2,3]]',output:'[2,3]'},{input:'edges=[[1,2],[2,3],[3,4],[1,4],[1,5]]',output:'[1,4]'}],
    constraints:['n == edges.length','3 ≤ n ≤ 1000','edges[i].length == 2','1 ≤ ai < bi ≤ n','No repeated edges'],
    hints:['Union-Find: for each edge, if both already in same component, it\'s redundant','Use path compression and union by rank'] },

  { title:'Network Delay Time',
    description:'Directed weighted graph of n nodes. Send signal from node k. Return time for all nodes to receive signal, or -1 if impossible.',
    examples:[{input:'times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2',output:'2'},{input:'times=[[1,2,1]], n=2, k=1',output:'1'},{input:'times=[[1,2,1]], n=2, k=2',output:'-1'}],
    constraints:['1 ≤ k ≤ n ≤ 100','1 ≤ times.length ≤ 6000','times[i].length == 3','Positive edge weights'],
    hints:['Dijkstra\'s algorithm from source k','Answer = max of all shortest distances. -1 if any node unreachable'] },

  { title:'Permutations',
    description:'Given array <code>nums</code> of distinct integers, return all possible permutations.',
    examples:[{input:'nums=[1,2,3]',output:'[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'},{input:'nums=[0,1]',output:'[[0,1],[1,0]]'},{input:'nums=[1]',output:'[[1]]'}],
    constraints:['1 ≤ nums.length ≤ 6','-10 ≤ nums[i] ≤ 10','All integers are unique'],
    hints:['Backtracking: swap current index with each remaining index','Recurse, then swap back (undo)'] },

  { title:'Subsets',
    description:'Given integer array <code>nums</code> of unique elements, return all possible subsets (power set).',
    examples:[{input:'nums=[1,2,3]',output:'[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]'},{input:'nums=[0]',output:'[[],[0]]'}],
    constraints:['1 ≤ nums.length ≤ 10','-10 ≤ nums[i] ≤ 10','All elements are unique'],
    hints:['Backtracking: at each index, choose to include or exclude','Or iterate: for each new element, add it to all existing subsets'] },

  { title:'Combination Sum',
    description:'Given array of distinct integers <code>candidates</code> and target, return all unique combinations that sum to target. Each candidate may be used unlimited times.',
    examples:[{input:'candidates=[2,3,6,7], target=7',output:'[[2,2,3],[7]]'},{input:'candidates=[2,3], target=6',output:'[[2,2,2],[3,3]]'}],
    constraints:['1 ≤ candidates.length ≤ 30','2 ≤ candidates[i] ≤ 40','All elements unique','1 ≤ target ≤ 40'],
    hints:['Backtracking starting from index i (allow reuse)','Prune if current sum > target','Sort candidates to enable pruning'] },

  { title:'Letter Combinations of a Phone Number',
    description:'Given string <code>digits</code> (2-9), return all possible letter combinations that the number could represent (phone keypad mapping).',
    examples:[{input:'digits="23"',output:'["ad","ae","af","bd","be","bf","cd","ce","cf"]'},{input:'digits=""',output:'[]'},{input:'digits="2"',output:'["a","b","c"]'}],
    constraints:['0 ≤ digits.length ≤ 4','digits[i] is a digit in range [\'2\',\'9\']'],
    hints:['Use digit-to-letters map: {2:"abc", 3:"def", ...}','Backtracking: for each digit, try each mapped letter'] },

  { title:'N-Queens',
    description:'Place n queens on n×n chessboard so no two queens attack each other. Return all distinct solutions.',
    examples:[{input:'n=4',output:'[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]'},{input:'n=1',output:'[["Q"]]'}],
    constraints:['1 ≤ n ≤ 9'],
    hints:['Track occupied columns, diagonals (r-c), anti-diagonals (r+c) as sets','Place one queen per row using backtracking'] },

  { title:'Reverse Words in a String',
    description:'Given input string <code>s</code>, reverse the order of words. A word is defined as a sequence of non-space characters. Return with single spaces and no leading/trailing spaces.',
    examples:[{input:'s="the sky is blue"',output:'"blue is sky the"'},{input:'s="  hello world  "',output:'"world hello"'},{input:'s="a good   example"',output:'"example good a"'}],
    constraints:['1 ≤ s.length ≤ 10⁴','s contains English letters, digits, and spaces','At least one word in s'],
    hints:['Split by whitespace (handles multiple spaces)','Reverse the array of words and join with single space'] },

  { title:'Longest Common Prefix',
    description:'Find the longest common prefix string among an array of strings. Return "" if none.',
    examples:[{input:'strs=["flower","flow","flight"]',output:'"fl"'},{input:'strs=["dog","racecar","car"]',output:'""'}],
    constraints:['1 ≤ strs.length ≤ 200','0 ≤ strs[i].length ≤ 200','strs[i] consists of lowercase English letters only'],
    hints:['Take first string as prefix','Trim from end until all strings start with it'] },

  { title:'Roman to Integer',
    description:'Given a Roman numeral string, convert it to an integer.',
    examples:[{input:'s="III"',output:'3'},{input:'s="LVIII"',output:'58',explanation:'L=50,V=5,III=3'},{input:'s="MCMXCIV"',output:'1994',explanation:'M=1000,CM=900,XC=90,IV=4'}],
    constraints:['1 ≤ s.length ≤ 15','s contains only I,V,X,L,C,D,M','It is guaranteed to be a valid Roman numeral in range [1,3999]'],
    hints:['Map each symbol to value','If current value < next value, subtract current; otherwise add'] },

  { title:'String to Integer (atoi)',
    description:'Implement myAtoi which converts a string to a 32-bit signed integer. Steps: skip whitespace, read sign, read digits, clamp to 32-bit range.',
    examples:[{input:'s="42"',output:'42'},{input:'s="   -42"',output:'-42'},{input:'s="4193 with words"',output:'4193'},{input:'s="words and 987"',output:'0'}],
    constraints:['0 ≤ s.length ≤ 200','s consists of English letters, digits, spaces, \'+\', \'-\', \'.\''],
    hints:['Skip leading whitespace, then read optional sign','Read digit characters until non-digit, clamp to [-2³¹, 2³¹-1]'] },

  { title:'Count and Say',
    description:'The "count-and-say" sequence: 1 is "1", each term describes the previous. Given n, return nth term.',
    examples:[{input:'n=1',output:'"1"'},{input:'n=4',output:'"1211"',explanation:'1→"11"→"21"→"1211"'}],
    constraints:['1 ≤ n ≤ 30'],
    hints:['Iterate n-1 times, each time encode current string by counting consecutive characters','Count group length and prepend to current character'] },

  { title:'Number of 1 Bits',
    description:'Given unsigned 32-bit integer, return the number of set bits (Hamming weight).',
    examples:[{input:'n=00000000000000000000000000001011',output:'3'},{input:'n=00000000000000000000000010000000',output:'1'},{input:'n=11111111111111111111111111111101',output:'31'}],
    constraints:['Input is a 32-bit unsigned integer'],
    hints:['n & (n-1) removes the lowest set bit','Count how many times you can do this before n becomes 0'] },

  { title:'Reverse Bits',
    description:'Reverse bits of a given 32-bit unsigned integer.',
    examples:[{input:'n=00000010100101000001111010011100',output:'964176192',explanation:'Reversed = 00111001011110000010100101000000'},{input:'n=11111111111111111111111111111101',output:'3221225471'}],
    constraints:['Input is a 32-bit unsigned integer'],
    hints:['Extract LSB (n & 1), shift it left into result, right-shift n','Repeat 32 times'] },

  { title:'Power of Two',
    description:'Given integer n, return true if it is a power of two.',
    examples:[{input:'n=1',output:'true',explanation:'2⁰=1'},{input:'n=16',output:'true',explanation:'2⁴=16'},{input:'n=3',output:'false'}],
    constraints:['-2³¹ ≤ n ≤ 2³¹-1'],
    hints:['n > 0 and (n & (n-1)) == 0','Powers of 2 have exactly one bit set; n-1 has all lower bits set'] },

  { title:'Sum of Two Integers',
    description:'Given two integers a and b, return their sum without using + or - operators.',
    examples:[{input:'a=1, b=2',output:'3'},{input:'a=2, b=3',output:'5'}],
    constraints:['-1000 ≤ a, b ≤ 1000'],
    hints:['XOR gives sum without carry: a ^ b','AND shifted left gives carry: (a & b) << 1','Repeat until no carry'] },

  { title:'Kth Largest Element in an Array',
    description:'Given integer array <code>nums</code> and integer k, return the kth largest element.',
    examples:[{input:'nums=[3,2,1,5,6,4], k=2',output:'5'},{input:'nums=[3,2,3,1,2,4,5,5,6], k=4',output:'4'}],
    constraints:['1 ≤ k ≤ nums.length ≤ 10⁵','-10⁴ ≤ nums[i] ≤ 10⁴'],
    hints:['Min-heap of size k: final top = kth largest','QuickSelect (partition) gives O(n) average'] },

  { title:'Task Scheduler',
    description:'Given tasks array and cooldown n, find minimum intervals needed to execute all tasks (same task needs n interval gap).',
    examples:[{input:'tasks=["A","A","A","B","B","B"], n=2',output:'8',explanation:'A→B→idle→A→B→idle→A→B'},{input:'tasks=["A","A","A","B","B","B"], n=0',output:'6'}],
    constraints:['1 ≤ tasks.length ≤ 10⁴','tasks[i] is uppercase English letter','0 ≤ n ≤ 100'],
    hints:['Math formula: (max_freq-1)*(n+1) + count_of_max_freq','Take max with tasks.length (if enough variety, no idle needed)'] },

  { title:'Last Stone Weight',
    description:'Stones with weights. Each turn smash two heaviest: if equal both destroyed, else heavier gets reduced. Return weight of last stone or 0.',
    examples:[{input:'stones=[2,7,4,1,8,1]',output:'1',explanation:'7&8→1, 2&4→2, 1&1→0, 2&1→1'},{input:'stones=[1]',output:'1'}],
    constraints:['1 ≤ stones.length ≤ 30','1 ≤ stones[i] ≤ 1000'],
    hints:['Use max-heap (priority queue)','Each iteration: pop two largest, push difference if non-zero'] },

  { title:'3Sum Closest',
    description:'Given array <code>nums</code> and target, find three integers whose sum is closest to target. Return the sum.',
    examples:[{input:'nums=[-1,2,1,-4], target=1',output:'2',explanation:'-1+2+1=2 is closest'},{input:'nums=[0,0,0], target=1',output:'0'}],
    constraints:['3 ≤ nums.length ≤ 500','-1000 ≤ nums[i] ≤ 1000','-10⁴ ≤ target ≤ 10⁴'],
    hints:['Sort array, fix one element, use two pointers','Update closest sum, move left/right based on comparison with target'] },

  { title:'Valid Palindrome',
    description:'Given string <code>s</code>, return true if it is a palindrome considering only alphanumeric characters (ignore cases).',
    examples:[{input:'s="A man, a plan, a canal: Panama"',output:'true'},{input:'s="race a car"',output:'false'},{input:'s=" "',output:'true'}],
    constraints:['1 ≤ s.length ≤ 2×10⁵','s consists only of printable ASCII characters'],
    hints:['Two pointers from both ends','Skip non-alphanumeric characters, compare lowercase'] },

  { title:'Sort Colors',
    description:'Given array with values 0, 1, 2 (representing red, white, blue), sort in-place so same colors are adjacent in order 0,1,2.',
    examples:[{input:'nums=[2,0,2,1,1,0]',output:'[0,0,1,1,2,2]'},{input:'nums=[2,0,1]',output:'[0,1,2]'}],
    constraints:['n == nums.length','1 ≤ n ≤ 300','nums[i] is 0, 1, or 2'],
    hints:['Dutch National Flag algorithm: three pointers low, mid, high','Swap based on value at mid: 0→swap with low, 2→swap with high, 1→advance mid'] },

  { title:'Search a 2D Matrix',
    description:'Matrix where each row is sorted and first integer of each row is greater than last of previous. Return true if target exists.',
    examples:[{input:'matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3',output:'true'},{input:'matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=13',output:'false'}],
    constraints:['m == matrix.length','n == matrix[i].length','1 ≤ m,n ≤ 100','-10⁴ ≤ matrix[i][j],target ≤ 10⁴'],
    hints:['Treat matrix as 1D sorted array of m*n elements','Binary search: mid = mid/(n) row, mid%n col'] },

  { title:'Gas Station',
    description:'Circular gas station route. gas[i] is available, cost[i] to travel to next station. Find starting station index to complete circuit, or -1.',
    examples:[{input:'gas=[1,2,3,4,5], cost=[3,4,5,1,2]',output:'3'},{input:'gas=[2,3,4], cost=[3,4,3]',output:'-1'}],
    constraints:['n == gas.length == cost.length','1 ≤ n ≤ 10⁵','0 ≤ gas[i],cost[i] ≤ 10⁴'],
    hints:['If total gas >= total cost, a solution always exists','If cumulative sum drops below 0 at position i, start afresh from i+1'] },

  { title:'Assign Cookies',
    description:'Assign cookies to children. Child i needs greed[i] size, cookie j has size[j]. Cookie j can satisfy child i if size[j] >= greed[i]. Maximize number of satisfied children.',
    examples:[{input:'g=[1,2,3], s=[1,1]',output:'1',explanation:'Only one child can be satisfied'},{input:'g=[1,2], s=[1,2,3]',output:'2'}],
    constraints:['1 ≤ g.length,s.length ≤ 3×10⁴','0 ≤ g[i],s[j] ≤ 2³¹-1'],
    hints:['Sort both arrays','Greedily assign smallest sufficient cookie to least greedy child'] },

  { title:'Pow(x, n)',
    description:'Implement pow(x, n) — x raised to the power n.',
    examples:[{input:'x=2.00000, n=10',output:'1024.00000'},{input:'x=2.10000, n=3',output:'9.26100'},{input:'x=2.00000, n=-2',output:'0.25000',explanation:'1/2²=0.25'}],
    constraints:['-100.0 < x < 100.0','-2³¹ ≤ n ≤ 2³¹-1','-10⁴ ≤ xⁿ ≤ 10⁴','n is an integer'],
    hints:['Fast power: if n is even, pow(x*x, n/2)','If n is odd, x * pow(x, n-1)','For negative n: return 1/pow(x, -n)'] },

  { title:'Excel Sheet Column Number',
    description:'Given a string <code>columnTitle</code> representing column title in Excel sheet, return its corresponding column number (A=1, B=2, ..., Z=26, AA=27...).',
    examples:[{input:'columnTitle="A"',output:'1'},{input:'columnTitle="AB"',output:'28'},{input:'columnTitle="ZY"',output:'701'}],
    constraints:['1 ≤ columnTitle.length ≤ 7','columnTitle consists only of uppercase English letters','columnTitle is in range ["A","FXSHRXW"]'],
    hints:['Base-26 conversion','result = result * 26 + (char - \'A\' + 1)'] },

  { title:'Happy Number',
    description:'A happy number ends at 1 when repeatedly replacing it with sum of squares of its digits. Unhappy numbers loop forever. Return true if happy.',
    examples:[{input:'n=19',output:'true',explanation:'1²+9²=82→68→100→1'},{input:'n=2',output:'false'}],
    constraints:['1 ≤ n ≤ 2³¹-1'],
    hints:['Use HashSet to detect cycles, or Floyd\'s cycle detection','Unhappy numbers always cycle through: 4→16→37→58→89→145→42→20→4'] },

  { title:'LRU Cache',
    description:'Design a data structure that follows LRU (Least Recently Used) eviction policy with O(1) get and put operations.',
    examples:[{input:'LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4), get(1), get(3), get(4)',output:'1, -1, -1, 3, 4',explanation:'Cache capacity 2, evicts least recently used'}],
    constraints:['1 ≤ capacity ≤ 3000','0 ≤ key ≤ 10⁴','0 ≤ value ≤ 10⁵','At most 2×10⁵ calls to get and put'],
    hints:['Use HashMap + Doubly Linked List','HashMap for O(1) key lookup, DLL for O(1) move-to-front and remove-from-end','Use sentinel head and tail nodes'] },

  { title:'Design HashMap',
    description:'Design HashMap without using built-in hash table libraries. Implement put(key,value), get(key), remove(key).',
    examples:[{input:'put(1,1), put(2,2), get(1), get(3), put(2,1), get(2), remove(2), get(2)',output:'1, -1, 1, -1'}],
    constraints:['0 ≤ key,value ≤ 10⁶','At most 10⁴ calls to put, get, remove'],
    hints:['Array of buckets with chaining (LinkedList per bucket)','hash(key) = key % bucketSize','Size 1000-10000 buckets works well'] },
];

async function updateDescriptions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let updated = 0, notFound = 0;

    for (const upd of updates) {
      const result = await Question.updateOne(
        { title: upd.title },
        { $set: {
          description: upd.description,
          examples: upd.examples,
          constraints: upd.constraints,
          hints: upd.hints
        }}
      );

      if (result.matchedCount === 0) {
        console.log(`  NOT FOUND: ${upd.title}`);
        notFound++;
      } else {
        updated++;
        process.stdout.write(`\r  Updated ${updated} questions...`);
      }
    }

    console.log(`\n\nDone! Updated: ${updated}, Not found: ${notFound}`);
  } catch (err) {
    console.error('Update failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

updateDescriptions();
