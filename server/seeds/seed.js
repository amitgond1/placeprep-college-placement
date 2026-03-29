require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Question = require('../models/Question');

const questions = [
// ===== 1. TWO SUM =====
{
  questionNumber:1,title:'Two Sum',slug:'two-sum',
  difficulty:'Easy',topic:'Array',topics:['Array','Hash Table'],
  companies:['Amazon','Google','Microsoft','Meta','Flipkart'],frequency:95,acceptance:52.3,
  rounds:['Round 1','Online Test'],
  description:'Given an array <code>nums</code> and integer <code>target</code>, return indices of the two numbers that add up to target.',
  examples:[{input:'nums=[2,7,11,15], target=9',output:'[0,1]',explanation:'nums[0]+nums[1]=9'},{input:'nums=[3,2,4], target=6',output:'[1,2]'}],
  constraints:['2 ≤ n ≤ 10⁴','Exactly one valid answer'],
  hints:['For each number, check if its complement exists in a map'],
  similarQuestions:['3Sum','Two Sum II'],
  testCases:[
    {input:'4\n2 7 11 15\n9',output:'[0,1]',isHidden:false},
    {input:'3\n3 2 4\n6',output:'[1,2]',isHidden:false},
    {input:'2\n3 3\n6',output:'[0,1]',isHidden:true},
    {input:'5\n1 2 3 4 5\n9',output:'[3,4]',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here

    }
};
int main() {
    int n; cin>>n; vector<int> nums(n);
    for(int i=0;i<n;i++) cin>>nums[i];
    int t; cin>>t;
    auto r=Solution().twoSum(nums,t);
    cout<<"["; for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];} cout<<"]\\n";
}`,
    java:`import java.util.*;
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt(); int[] nums=new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        int[] r=new Solution().twoSum(nums,sc.nextInt());
        StringBuilder sb=new StringBuilder("[");
        for(int i=0;i<r.length;i++){if(i>0)sb.append(",");sb.append(r[i]);}
        System.out.println(sb+"]");
    }
}`,
    python:`from typing import List
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here
        pass
if __name__=="__main__":
    n=int(input()); nums=list(map(int,input().split())); t=int(input())
    print('['+','.join(map(str,Solution().twoSum(nums,t)))+']')`
  },
  editorial:{
    approach1:{name:'Brute Force',timeComplexity:'O(n²)',spaceComplexity:'O(1)',explanation:'Check every pair.',code:{cpp:'for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(nums[i]+nums[j]==target) return{i,j};',java:'',python:''}},
    approach2:{name:'HashMap One-pass',timeComplexity:'O(n)',spaceComplexity:'O(n)',explanation:'Store complement in map, check on each step.',
      code:{cpp:'unordered_map<int,int> mp;\nfor(int i=0;i<(int)nums.size();i++){\n  if(mp.count(target-nums[i])) return{mp[target-nums[i]],i};\n  mp[nums[i]]=i;\n}',
            java:'Map<Integer,Integer> m=new HashMap<>();\nfor(int i=0;i<nums.length;i++){\n  if(m.containsKey(target-nums[i])) return new int[]{m.get(target-nums[i]),i};\n  m.put(nums[i],i);\n}',
            python:'seen={}\nfor i,v in enumerate(nums):\n  if target-v in seen: return[seen[target-v],i]\n  seen[v]=i'}},
    companyNote:'Amazon: sorted array → Two Pointers. Google: multiple valid answers.',
    striverLink:'https://takeuforward.org/data-structure/two-sum-check-if-a-pair-with-given-sum-exists-in-array/'
  },
  solution:{code:'HashMap',language:'cpp',explanation:'One-pass HashMap',timeComplexity:'O(n)',spaceComplexity:'O(n)',followUpTips:'Two Pointer for sorted input'}
},
// ===== 2. VALID PARENTHESES =====
{
  questionNumber:20,title:'Valid Parentheses',slug:'valid-parentheses',
  difficulty:'Easy',topic:'Stack',topics:['String','Stack'],
  companies:['Amazon','Google','Microsoft','Meta'],frequency:88,acceptance:41.2,
  rounds:['Round 1','Online Test'],
  description:'Given string with <code>()[]{}></code>, determine if it is valid. Open brackets must be closed by same type in correct order.',
  examples:[{input:'s="()"',output:'true'},{input:'s="()[]{}"',output:'true'},{input:'s="(]"',output:'false'}],
  constraints:['1 ≤ s.length ≤ 10⁴'],hints:['Use a stack'],
  testCases:[
    {input:'()',output:'true',isHidden:false},{input:'()[]{}',output:'true',isHidden:false},
    {input:'(]',output:'false',isHidden:true},{input:'([)]',output:'false',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool isValid(string s) {
        // Write your solution here

    }
};
int main() { string s; cin>>s; cout<<(Solution().isValid(s)?"true":"false")<<"\\n"; }`,
    java:`import java.util.*;
class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}
class Main { public static void main(String[] args) {
    System.out.println(new Solution().isValid(new Scanner(System.in).next())?"true":"false"); }}`,
    python:`class Solution:
    def isValid(self, s: str) -> bool:
        # Write your solution here
        pass
if __name__=="__main__": print(str(Solution().isValid(input().strip())).lower())`
  },
  editorial:{
    approach1:{name:'Stack',timeComplexity:'O(n)',spaceComplexity:'O(n)',explanation:'Push opening. For closing, check top matches.',
      code:{cpp:"stack<char> st;\nfor(char c:s){\n  if(c=='('||c=='['||c=='{') st.push(c);\n  else{\n    if(st.empty()) return false;\n    char t=st.top();st.pop();\n    if((c==')'&&t!='(')||(c==']'&&t!='[')||(c=='}'&&t!='{')) return false;\n  }\n}\nreturn st.empty();",java:'',python:''}},
    companyNote:'Amazon follow-up: angle brackets. Classic Google phone screen.'
  },
  solution:{code:'Stack',language:'cpp',explanation:'Stack',timeComplexity:'O(n)',spaceComplexity:'O(n)',followUpTips:'O(1) space impossible in general'}
},
// ===== 3. MAXIMUM SUBARRAY =====
{
  questionNumber:53,title:'Maximum Subarray',slug:'maximum-subarray',
  difficulty:'Easy',topic:'Array',topics:['Array','Dynamic Programming'],
  companies:['Amazon','Google','Microsoft','Meta','TCS'],frequency:90,acceptance:50.1,
  rounds:['Round 1','DSA Round'],
  description:'Find the subarray with the largest sum and return its sum.',
  examples:[{input:'nums=[-2,1,-3,4,-1,2,1,-5,4]',output:'6',explanation:'[4,-1,2,1]=6'},{input:'nums=[1]',output:'1'}],
  constraints:['1 ≤ n ≤ 10⁵'],hints:["Kadane: reset when current sum goes negative"],
  testCases:[
    {input:'9\n-2 1 -3 4 -1 2 1 -5 4',output:'6',isHidden:false},
    {input:'1\n1',output:'1',isHidden:false},
    {input:'4\n-2 -1 -3 -4',output:'-1',isHidden:true},
    {input:'5\n5 4 -1 7 8',output:'23',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your solution here

    }
};
int main() { int n; cin>>n; vector<int> v(n); for(auto&x:v)cin>>x; cout<<Solution().maxSubArray(v)<<"\\n"; }`,
    java:`import java.util.*;
class Solution { public int maxSubArray(int[] nums) { /* your code */ return 0; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] v=new int[n];
    for(int i=0;i<n;i++) v[i]=sc.nextInt();
    System.out.println(new Solution().maxSubArray(v)); }}`,
    python:`from typing import List
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        # Write your solution here
        pass
if __name__=="__main__": n=int(input()); print(Solution().maxSubArray(list(map(int,input().split()))))`
  },
  editorial:{
    approach1:{name:"Kadane's",timeComplexity:'O(n)',spaceComplexity:'O(1)',explanation:'curr=max(x,curr+x). Track global max.',
      code:{cpp:'int res=nums[0],cur=nums[0];\nfor(int i=1;i<(int)nums.size();i++){cur=max(nums[i],cur+nums[i]);res=max(res,cur);}\nreturn res;',java:'',python:'cur=res=nums[0]\nfor n in nums[1:]:\n  cur=max(n,cur+n);res=max(res,cur)\nreturn res'}},
    companyNote:"Amazon: Return indices too. Google: Divide & conquer O(n log n)."
  },
  solution:{code:"Kadane's",language:'cpp',explanation:"Kadane's",timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Track start/end for indices'}
},
// ===== 4. CLIMBING STAIRS =====
{
  questionNumber:70,title:'Climbing Stairs',slug:'climbing-stairs',
  difficulty:'Easy',topic:'Dynamic Programming',topics:['Math','Dynamic Programming'],
  companies:['Amazon','Google','Adobe','Flipkart','TCS'],frequency:82,acceptance:52.8,
  rounds:['Round 1','Online Test'],
  description:'Reach top of n stairs. Can climb 1 or 2 at a time. How many distinct ways?',
  examples:[{input:'n=2',output:'2',explanation:'1+1 or 2'},{input:'n=3',output:'3'}],
  constraints:['1 ≤ n ≤ 45'],hints:['Fibonacci! f(n)=f(n-1)+f(n-2)'],
  testCases:[
    {input:'2',output:'2',isHidden:false},{input:'3',output:'3',isHidden:false},
    {input:'10',output:'89',isHidden:true},{input:'45',output:'1836311903',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int climbStairs(int n) {
        // Write your solution here

    }
};
int main() { int n; cin>>n; cout<<Solution().climbStairs(n)<<"\\n"; }`,
    java:`import java.util.*;
class Solution { public int climbStairs(int n) { /* your code */ return 0; } }
class Main { public static void main(String[] args) {
    System.out.println(new Solution().climbStairs(new Scanner(System.in).nextInt())); }}`,
    python:`class Solution:
    def climbStairs(self, n: int) -> int:
        # Write your solution here
        pass
if __name__=="__main__": print(Solution().climbStairs(int(input())))`
  },
  editorial:{
    approach1:{name:'DP Fibonacci',timeComplexity:'O(n)',spaceComplexity:'O(1)',explanation:'f(n)=f(n-1)+f(n-2) with rolling vars.',
      code:{cpp:'if(n<=2)return n;\nint a=1,b=2;\nfor(int i=3;i<=n;i++){int c=a+b;a=b;b=c;}\nreturn b;',java:'if(n<=2)return n;int a=1,b=2;for(int i=3;i<=n;i++){int c=a+b;a=b;b=c;}return b;',python:'a,b=1,2\nfor _ in range(n-2): a,b=b,a+b\nreturn b if n>1 else 1'}},
    companyNote:'Amazon: k steps. Google: matrix exponentiation O(log n).'
  },
  solution:{code:'Fibonacci DP',language:'cpp',explanation:'f(n)=f(n-1)+f(n-2)',timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'k-step generalization'}
},
// ===== 5. BEST TIME TO BUY AND SELL =====
{
  questionNumber:121,title:'Best Time to Buy and Sell Stock',slug:'best-time-to-buy-and-sell-stock',
  difficulty:'Easy',topic:'Array',topics:['Array','Dynamic Programming'],
  companies:['Amazon','Meta','Google','Microsoft','Apple','Netflix'],frequency:85,acceptance:54.2,
  rounds:['Round 1','Online Test'],
  description:'prices[i] = stock price on day i. Choose one day to buy and one future day to sell. Return max profit.',
  examples:[{input:'prices=[7,1,5,3,6,4]',output:'5',explanation:'Buy at 1, sell at 6'},{input:'prices=[7,6,4,3,1]',output:'0'}],
  constraints:['1 ≤ n ≤ 10⁵'],hints:['Track minimum price seen so far'],
  testCases:[
    {input:'6\n7 1 5 3 6 4',output:'5',isHidden:false},{input:'5\n7 6 4 3 1',output:'0',isHidden:false},
    {input:'1\n1',output:'0',isHidden:true},{input:'4\n2 4 1 7',output:'6',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your solution here

    }
};
int main() { int n; cin>>n; vector<int> p(n); for(auto&x:p)cin>>x; cout<<Solution().maxProfit(p)<<"\\n"; }`,
    java:`import java.util.*;
class Solution { public int maxProfit(int[] prices) { /* your code */ return 0; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] p=new int[n];
    for(int i=0;i<n;i++) p[i]=sc.nextInt();
    System.out.println(new Solution().maxProfit(p)); }}`,
    python:`from typing import List
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        # Write your solution here
        pass
if __name__=="__main__": n=int(input()); print(Solution().maxProfit(list(map(int,input().split()))))`
  },
  editorial:{
    approach1:{name:'One-pass Min Tracking',timeComplexity:'O(n)',spaceComplexity:'O(1)',explanation:'Track minPrice. profit=price-minPrice.',
      code:{cpp:'int mn=INT_MAX,res=0;\nfor(int p:prices){mn=min(mn,p);res=max(res,p-mn);}\nreturn res;',java:'int mn=Integer.MAX_VALUE,res=0;\nfor(int p:prices){mn=Math.min(mn,p);res=Math.max(res,p-mn);}\nreturn res;',python:'mn,res=float("inf"),0\nfor p in prices: mn=min(mn,p);res=max(res,p-mn)\nreturn res'}},
    companyNote:'Meta: unlimited transactions. Amazon: with cooldown.'
  },
  solution:{code:'Track min',language:'cpp',explanation:'One-pass',timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Multiple transactions variant'}
},
// ===== 6. LONGEST SUBSTRING WITHOUT REPEATING =====
{
  questionNumber:3,title:'Longest Substring Without Repeating Characters',slug:'longest-substring-without-repeating-characters',
  difficulty:'Medium',topic:'String',topics:['Hash Table','String','Sliding Window'],
  companies:['Amazon','Google','Microsoft','Meta','Flipkart'],frequency:90,acceptance:34.1,
  rounds:['Round 1','Round 2'],
  description:'Find the length of the longest substring without repeating characters.',
  examples:[{input:'s="abcabcbb"',output:'3'},{input:'s="bbbbb"',output:'1'},{input:'s="pwwkew"',output:'3'}],
  constraints:['0 ≤ s.length ≤ 5×10⁴'],hints:['Sliding window with char→last_index map'],
  testCases:[
    {input:'abcabcbb',output:'3',isHidden:false},{input:'bbbbb',output:'1',isHidden:false},
    {input:'pwwkew',output:'3',isHidden:true},{input:' ',output:'1',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your solution here

    }
};
int main() { string s; getline(cin,s); cout<<Solution().lengthOfLongestSubstring(s)<<"\\n"; }`,
    java:`import java.util.*;
class Solution { public int lengthOfLongestSubstring(String s) { /* your code */ return 0; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in);
    System.out.println(new Solution().lengthOfLongestSubstring(sc.hasNextLine()?sc.nextLine():"")); }}`,
    python:`class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your solution here
        pass
if __name__=="__main__": print(Solution().lengthOfLongestSubstring(input()))`
  },
  editorial:{
    approach1:{name:'Sliding Window + HashMap',timeComplexity:'O(n)',spaceComplexity:'O(min(m,n))',explanation:'Map char→last_index. Left pointer jumps past last duplicate.',
      code:{cpp:'unordered_map<char,int> mp;int l=0,res=0;\nfor(int r=0;r<(int)s.size();r++){\n  if(mp.count(s[r])) l=max(l,mp[s[r]]+1);\n  mp[s[r]]=r;res=max(res,r-l+1);\n}\nreturn res;',java:'',python:'seen={};l=res=0\nfor r,c in enumerate(s):\n  if c in seen:l=max(l,seen[c]+1)\n  seen[c]=r;res=max(res,r-l+1)\nreturn res'}},
    companyNote:'Amazon: at-most k distinct. Google: return actual substring.'
  },
  solution:{code:'Sliding window',language:'cpp',explanation:'Sliding window',timeComplexity:'O(n)',spaceComplexity:'O(n)',followUpTips:'At-most-k-distinct variant'}
},
// ===== 7. MERGE INTERVALS =====
{
  questionNumber:56,title:'Merge Intervals',slug:'merge-intervals',
  difficulty:'Medium',topic:'Array',topics:['Array','Sorting'],
  companies:['Amazon','Google','Microsoft','Meta','Flipkart'],frequency:80,acceptance:46.2,
  rounds:['Round 2','DSA Round'],
  description:'Given array of intervals, merge all overlapping intervals.',
  examples:[{input:'[[1,3],[2,6],[8,10],[15,18]]',output:'[[1,6],[8,10],[15,18]]'},{input:'[[1,4],[4,5]]',output:'[[1,5]]'}],
  constraints:['1 ≤ n ≤ 10⁴'],hints:['Sort by start. If overlap, extend last merged.'],
  testCases:[
    {input:'4\n1 3\n2 6\n8 10\n15 18',output:'[[1,6],[8,10],[15,18]]',isHidden:false},
    {input:'2\n1 4\n4 5',output:'[[1,5]]',isHidden:false},
    {input:'1\n1 4',output:'[[1,4]]',isHidden:true},
    {input:'3\n1 4\n2 3\n5 6',output:'[[1,4],[5,6]]',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        // Write your solution here

    }
};
int main() {
    int n; cin>>n; vector<vector<int>> iv(n,vector<int>(2));
    for(int i=0;i<n;i++) cin>>iv[i][0]>>iv[i][1];
    auto r=Solution().merge(iv);
    cout<<"["; for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<"["<<r[i][0]<<","<<r[i][1]<<"]";} cout<<"]\\n";
}`,
    java:`import java.util.*;
class Solution { public int[][] merge(int[][] iv) { /* your code */ return new int[0][0]; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[][] iv=new int[n][2];
    for(int i=0;i<n;i++){iv[i][0]=sc.nextInt();iv[i][1]=sc.nextInt();}
    int[][] r=new Solution().merge(iv);
    StringBuilder sb=new StringBuilder("[");
    for(int i=0;i<r.length;i++){if(i>0)sb.append(",");sb.append("[").append(r[i][0]).append(",").append(r[i][1]).append("]");}
    System.out.println(sb+"]"); }}`,
    python:`from typing import List
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        # Write your solution here
        pass
if __name__=="__main__":
    n=int(input()); iv=[list(map(int,input().split())) for _ in range(n)]
    r=Solution().merge(iv); print('['+','.join(['['+str(a)+','+str(b)+']' for a,b in r])+']')`
  },
  editorial:{
    approach1:{name:'Sort + Greedy',timeComplexity:'O(n log n)',spaceComplexity:'O(n)',explanation:'Sort by start. Extend last if overlap else add new.',
      code:{cpp:'sort(iv.begin(),iv.end());\nvector<vector<int>> r;\nfor(auto& c:intervals){\n  if(r.empty()||c[0]>r.back()[1]) r.push_back(c);\n  else r.back()[1]=max(r.back()[1],c[1]);\n}\nreturn r;',java:'',python:''}},
    companyNote:'Amazon: Insert Interval. Google: Meeting Rooms II.'
  },
  solution:{code:'Sort merge',language:'cpp',explanation:'Sort + greedy',timeComplexity:'O(n log n)',spaceComplexity:'O(n)',followUpTips:'Insert Interval variant'}
},
// ===== 8. NUMBER OF ISLANDS =====
{
  questionNumber:200,title:'Number of Islands',slug:'number-of-islands',
  difficulty:'Medium',topic:'Graph',topics:['Array','DFS','BFS','Union Find'],
  companies:['Amazon','Google','Microsoft','Meta','Flipkart'],frequency:85,acceptance:58.1,
  rounds:['Round 2','DSA Round'],
  description:"Given m×n grid of '1's (land) and '0's (water), return the number of islands.",
  examples:[{input:"grid=[['1','1','0'],['0','1','0'],['0','0','1']]",output:'2'}],
  constraints:['1 ≤ m,n ≤ 300'],hints:['DFS from each unvisited 1. Mark as 0.'],
  testCases:[
    {input:'4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0',output:'1',isHidden:false},
    {input:'4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1',output:'3',isHidden:false},
    {input:'1 1\n1',output:'1',isHidden:true},{input:'2 2\n1 0\n0 1',output:'2',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // Write your solution here

    }
};
int main() {
    int m,n; cin>>m>>n;
    vector<vector<char>> g(m,vector<char>(n));
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){int x;cin>>x;g[i][j]='0'+x;}
    cout<<Solution().numIslands(g)<<"\\n";
}`,
    java:`import java.util.*;
class Solution { public int numIslands(char[][] g) { /* your code */ return 0; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int m=sc.nextInt(),n=sc.nextInt();
    char[][] g=new char[m][n];
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) g[i][j]=(char)('0'+sc.nextInt());
    System.out.println(new Solution().numIslands(g)); }}`,
    python:`from typing import List
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        # Write your solution here
        pass
if __name__=="__main__":
    m,n=map(int,input().split())
    g=[[str(x) for x in input().split()] for _ in range(m)]
    print(Solution().numIslands(g))`
  },
  editorial:{
    approach1:{name:'DFS Flood Fill',timeComplexity:'O(m×n)',spaceComplexity:'O(m×n)',explanation:'For each unvisited 1: count++, DFS to mark all connected land as 0.',
      code:{cpp:"int cnt=0;\nfunction<void(int,int)> dfs=[&](int i,int j){\n  if(i<0||i>=(int)grid.size()||j<0||j>=(int)grid[0].size()||grid[i][j]!='1') return;\n  grid[i][j]='0';\n  dfs(i+1,j);dfs(i-1,j);dfs(i,j+1);dfs(i,j-1);\n};\nfor(int i=0;i<(int)grid.size();i++)\n  for(int j=0;j<(int)grid[0].size();j++)\n    if(grid[i][j]=='1'){cnt++;dfs(i,j);}\nreturn cnt;",java:'',python:''}},
    companyNote:'Amazon: Max Area of Island. Google: Distinct Islands. Union-Find approach also valid.'
  },
  solution:{code:'DFS',language:'cpp',explanation:'DFS flood fill',timeComplexity:'O(mn)',spaceComplexity:'O(mn)',followUpTips:'Union Find for dynamic'}
},
// ===== 9. COIN CHANGE =====
{
  questionNumber:322,title:'Coin Change',slug:'coin-change',
  difficulty:'Medium',topic:'Dynamic Programming',topics:['Array','Dynamic Programming','BFS'],
  companies:['Amazon','Google','Microsoft','Meta','Zoho'],frequency:78,acceptance:43.2,
  rounds:['Round 2','DSA Round'],
  description:'Given coins and an amount, return fewest coins to make amount. Return -1 if impossible.',
  examples:[{input:'coins=[1,5,11], amount=11',output:'1'},{input:'coins=[1,2,5], amount=11',output:'3'},{input:'coins=[2], amount=3',output:'-1'}],
  constraints:['0 ≤ amount ≤ 10⁴'],hints:['Bottom-up DP. dp[i]=min coins for amount i.'],
  testCases:[
    {input:'3\n1 5 11\n11',output:'1',isHidden:false},
    {input:'3\n1 2 5\n11',output:'3',isHidden:false},
    {input:'1\n2\n3',output:'-1',isHidden:true},
    {input:'1\n1\n0',output:'0',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Write your solution here

    }
};
int main() {
    int n; cin>>n; vector<int> c(n); for(auto&x:c)cin>>x;
    int a; cin>>a; cout<<Solution().coinChange(c,a)<<"\\n";
}`,
    java:`import java.util.*;
class Solution { public int coinChange(int[] coins, int amount) { /* your code */ return -1; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] c=new int[n];
    for(int i=0;i<n;i++) c[i]=sc.nextInt();
    System.out.println(new Solution().coinChange(c,sc.nextInt())); }}`,
    python:`from typing import List
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        # Write your solution here
        pass
if __name__=="__main__":
    n=int(input()); c=list(map(int,input().split())); a=int(input())
    print(Solution().coinChange(c,a))`
  },
  editorial:{
    approach1:{name:'Bottom-up DP',timeComplexity:'O(amount×n)',spaceComplexity:'O(amount)',explanation:'dp[i]=min coins. For each amount try all coins.',
      code:{cpp:'vector<int> dp(amount+1,INT_MAX); dp[0]=0;\nfor(int i=1;i<=amount;i++)\n  for(int c:coins)\n    if(c<=i&&dp[i-c]!=INT_MAX)\n      dp[i]=min(dp[i],dp[i-c]+1);\nreturn dp[amount]==INT_MAX?-1:dp[amount];',java:'',python:'dp=[float("inf")]*(amount+1); dp[0]=0\nfor i in range(1,amount+1):\n  for c in coins:\n    if c<=i and dp[i-c]!=float("inf"): dp[i]=min(dp[i],dp[i-c]+1)\nreturn dp[amount] if dp[amount]!=float("inf") else -1'}},
    companyNote:'Amazon: Count ways. Google: With limited coin supply.'
  },
  solution:{code:'DP',language:'cpp',explanation:'Bottom-up DP',timeComplexity:'O(S×n)',spaceComplexity:'O(S)',followUpTips:'Count ways variant'}
},
// ===== 10. PRODUCT EXCEPT SELF =====
{
  questionNumber:238,title:'Product of Array Except Self',slug:'product-of-array-except-self',
  difficulty:'Medium',topic:'Array',topics:['Array','Prefix Sum'],
  companies:['Amazon','Meta','Google','Microsoft','Apple','Netflix'],frequency:82,acceptance:65.2,
  rounds:['Round 1','Round 2'],
  description:'Return array where answer[i]=product of all nums except nums[i]. O(n), no division.',
  examples:[{input:'nums=[1,2,3,4]',output:'[24,12,8,6]'},{input:'nums=[-1,1,0,-3,3]',output:'[0,0,9,0,0]'}],
  constraints:['2 ≤ n ≤ 10⁵','No division'],hints:['Prefix from left × suffix from right'],
  testCases:[
    {input:'4\n1 2 3 4',output:'[24,12,8,6]',isHidden:false},
    {input:'5\n-1 1 0 -3 3',output:'[0,0,9,0,0]',isHidden:false},
    {input:'2\n1 2',output:'[2,1]',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        // Write your solution here

    }
};
int main() {
    int n; cin>>n; vector<int> v(n); for(auto&x:v)cin>>x;
    auto r=Solution().productExceptSelf(v);
    cout<<"["; for(int i=0;i<n;i++){if(i)cout<<",";cout<<r[i];} cout<<"]\\n";
}`,
    java:`import java.util.*;
class Solution { public int[] productExceptSelf(int[] nums) { /* your code */ return new int[0]; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] v=new int[n];
    for(int i=0;i<n;i++) v[i]=sc.nextInt();
    int[] r=new Solution().productExceptSelf(v);
    StringBuilder sb=new StringBuilder("[");
    for(int i=0;i<r.length;i++){if(i>0)sb.append(",");sb.append(r[i]);}
    System.out.println(sb+"]"); }}`,
    python:`from typing import List
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        # Write your solution here
        pass
if __name__=="__main__":
    n=int(input()); v=list(map(int,input().split()))
    print('['+','.join(map(str,Solution().productExceptSelf(v)))+']')`
  },
  editorial:{
    approach1:{name:'Prefix × Suffix',timeComplexity:'O(n)',spaceComplexity:'O(1)',explanation:'Left pass: prefix products. Right pass: multiply suffix.',
      code:{cpp:'int n=nums.size(); vector<int> r(n,1);\nint p=1;\nfor(int i=0;i<n;i++){r[i]=p;p*=nums[i];}\nint s=1;\nfor(int i=n-1;i>=0;i--){r[i]*=s;s*=nums[i];}\nreturn r;',java:'',python:'n=len(nums);r=[1]*n;p=1\nfor i in range(n): r[i]=p;p*=nums[i]\ns=1\nfor i in range(n-1,-1,-1): r[i]*=s;s*=nums[i]\nreturn r'}},
    companyNote:"Meta: zeros? Amazon: divide & conquer?"
  },
  solution:{code:'Prefix×Suffix',language:'cpp',explanation:'Two-pass O(1) space',timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Handle zeros carefully'}
},
// ===== 11. TOP K FREQUENT =====
{
  questionNumber:347,title:'Top K Frequent Elements',slug:'top-k-frequent-elements',
  difficulty:'Medium',topic:'Heap',topics:['Array','Hash Table','Heap','Bucket Sort'],
  companies:['Amazon','Google','Meta','Microsoft','Flipkart'],frequency:76,acceptance:65.4,
  rounds:['Round 2','DSA Round'],
  description:'Return the k most frequent elements from array nums.',
  examples:[{input:'nums=[1,1,1,2,2,3], k=2',output:'[1,2]'},{input:'nums=[1], k=1',output:'[1]'}],
  constraints:['1 ≤ n ≤ 10⁵'],hints:['Count with map. Bucket sort: index=frequency.'],
  testCases:[
    {input:'6\n1 1 1 2 2 3\n2',output:'[1,2]',isHidden:false},
    {input:'1\n1\n1',output:'[1]',isHidden:false},
    {input:'5\n4 1 1 4 4\n1',output:'[4]',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        // Write your solution here

    }
};
int main() {
    int n; cin>>n; vector<int> v(n); for(auto&x:v)cin>>x;
    int k; cin>>k;
    auto r=Solution().topKFrequent(v,k); sort(r.begin(),r.end());
    cout<<"["; for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];} cout<<"]\\n";
}`,
    java:`import java.util.*;
class Solution { public int[] topKFrequent(int[] nums, int k) { /* your code */ return new int[0]; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] v=new int[n];
    for(int i=0;i<n;i++) v[i]=sc.nextInt(); int k=sc.nextInt();
    int[] r=new Solution().topKFrequent(v,k); Arrays.sort(r);
    StringBuilder sb=new StringBuilder("[");
    for(int i=0;i<r.length;i++){if(i>0)sb.append(",");sb.append(r[i]);}
    System.out.println(sb+"]"); }}`,
    python:`from typing import List
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        # Write your solution here
        pass
if __name__=="__main__":
    n=int(input()); v=list(map(int,input().split())); k=int(input())
    print('['+','.join(map(str,sorted(Solution().topKFrequent(v,k))))+']')`
  },
  editorial:{
    approach1:{name:'Bucket Sort O(n)',timeComplexity:'O(n)',spaceComplexity:'O(n)',explanation:'bucket[freq]=list of nums. Collect top k from end.',
      code:{cpp:'unordered_map<int,int> cnt;\nfor(int x:nums) cnt[x]++;\nvector<vector<int>> bkt(nums.size()+1);\nfor(auto&[v,f]:cnt) bkt[f].push_back(v);\nvector<int> r;\nfor(int i=bkt.size()-1;i>=0&&(int)r.size()<k;i--)\n  for(int v:bkt[i]) if((int)r.size()<k) r.push_back(v);\nreturn r;',java:'',python:''}},
    companyNote:'Amazon: O(n). Google: Top-k in stream.'
  },
  solution:{code:'Bucket sort',language:'cpp',explanation:'O(n)',timeComplexity:'O(n)',spaceComplexity:'O(n)',followUpTips:'Min-heap O(n log k)'}
},
// ===== 12. JUMP GAME =====
{
  questionNumber:55,title:'Jump Game',slug:'jump-game',
  difficulty:'Medium',topic:'Greedy',topics:['Array','Dynamic Programming','Greedy'],
  companies:['Amazon','Microsoft','Google','Meta','Cognizant'],frequency:72,acceptance:38.5,
  rounds:['Round 1','Round 2'],
  description:'At each index, nums[i]=max jump length. Can you reach the last index?',
  examples:[{input:'nums=[2,3,1,1,4]',output:'true'},{input:'nums=[3,2,1,0,4]',output:'false'}],
  constraints:['1 ≤ n ≤ 10⁴'],hints:['Track maxReach. If i>maxReach, impossible.'],
  testCases:[
    {input:'5\n2 3 1 1 4',output:'true',isHidden:false},{input:'5\n3 2 1 0 4',output:'false',isHidden:false},
    {input:'1\n0',output:'true',isHidden:true},{input:'2\n0 1',output:'false',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool canJump(vector<int>& nums) {
        // Write your solution here

    }
};
int main() { int n; cin>>n; vector<int> v(n); for(auto&x:v)cin>>x; cout<<(Solution().canJump(v)?"true":"false")<<"\\n"; }`,
    java:`import java.util.*;
class Solution { public boolean canJump(int[] nums) { /* your code */ return false; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] v=new int[n];
    for(int i=0;i<n;i++) v[i]=sc.nextInt();
    System.out.println(new Solution().canJump(v)?"true":"false"); }}`,
    python:`from typing import List
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        # Write your solution here
        pass
if __name__=="__main__": n=int(input()); print(str(Solution().canJump(list(map(int,input().split())))).lower())`
  },
  editorial:{
    approach1:{name:'Greedy',timeComplexity:'O(n)',spaceComplexity:'O(1)',explanation:'Update maxReach=max(maxReach,i+nums[i]). If i>maxReach return false.',
      code:{cpp:'int mx=0;\nfor(int i=0;i<(int)nums.size();i++){\n  if(i>mx) return false;\n  mx=max(mx,i+nums[i]);\n}\nreturn true;',java:'int mx=0;\nfor(int i=0;i<nums.length;i++){if(i>mx)return false;mx=Math.max(mx,i+nums[i]);}\nreturn true;',python:'mx=0\nfor i,v in enumerate(nums):\n  if i>mx:return False\n  mx=max(mx,i+v)\nreturn True'}},
    companyNote:'Amazon: Jump Game II (min jumps). Microsoft: DP approach.'
  },
  solution:{code:'Greedy',language:'cpp',explanation:'Greedy maxReach',timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Jump Game II'}
},
// ===== 13. TRAPPING RAIN WATER =====
{
  questionNumber:42,title:'Trapping Rain Water',slug:'trapping-rain-water',
  difficulty:'Hard',topic:'Array',topics:['Array','Two Pointers','Dynamic Programming','Monotonic Stack'],
  companies:['Amazon','Google','Microsoft','Meta','Apple'],frequency:88,acceptance:60.1,
  rounds:['Round 2','Final Round','DSA Round'],
  description:'Compute how much water an elevation map can trap.',
  examples:[{input:'height=[0,1,0,2,1,0,1,3,2,1,2,1]',output:'6'},{input:'height=[4,2,0,3,2,5]',output:'9'}],
  constraints:['1 ≤ n ≤ 2×10⁴'],hints:['Two pointer: move smaller-max side, accumulate water'],
  testCases:[
    {input:'12\n0 1 0 2 1 0 1 3 2 1 2 1',output:'6',isHidden:false},
    {input:'6\n4 2 0 3 2 5',output:'9',isHidden:false},
    {input:'1\n3',output:'0',isHidden:true},{input:'3\n0 0 0',output:'0',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int trap(vector<int>& height) {
        // Write your solution here

    }
};
int main() { int n; cin>>n; vector<int> h(n); for(auto&x:h)cin>>x; cout<<Solution().trap(h)<<"\\n"; }`,
    java:`import java.util.*;
class Solution { public int trap(int[] height) { /* your code */ return 0; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] h=new int[n];
    for(int i=0;i<n;i++) h[i]=sc.nextInt();
    System.out.println(new Solution().trap(h)); }}`,
    python:`from typing import List
class Solution:
    def trap(self, height: List[int]) -> int:
        # Write your solution here
        pass
if __name__=="__main__": n=int(input()); print(Solution().trap(list(map(int,input().split()))))`
  },
  editorial:{
    approach1:{name:'Two Pointers O(1)',timeComplexity:'O(n)',spaceComplexity:'O(1)',explanation:'l,r pointers. Move smaller-max side. water+=maxSide-height.',
      code:{cpp:'int l=0,r=(int)height.size()-1,lm=0,rm=0,res=0;\nwhile(l<r){\n  if(height[l]<height[r]){\n    lm=max(lm,height[l]);res+=lm-height[l];l++;\n  } else {\n    rm=max(rm,height[r]);res+=rm-height[r];r--;\n  }\n}\nreturn res;',java:'int l=0,r=height.length-1,lm=0,rm=0,res=0;\nwhile(l<r){if(height[l]<height[r]){lm=Math.max(lm,height[l]);res+=lm-height[l];l++;}else{rm=Math.max(rm,height[r]);res+=rm-height[r];r--;}}\nreturn res;',python:'l,r,lm,rm,res=0,len(h)-1,0,0,0\nwhile l<r:\n  if h[l]<h[r]: lm=max(lm,h[l]);res+=lm-h[l];l+=1\n  else: rm=max(rm,h[r]);res+=rm-h[r];r-=1\nreturn res'}},
    companyNote:'FAANG #1 hard. Follow-up: 3D (LC 407).'
  },
  solution:{code:'Two pointers',language:'cpp',explanation:'O(1) space',timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'3D variant LC 407'}
},
// ===== 14. SINGLE NUMBER =====
{
  questionNumber:136,title:'Single Number',slug:'single-number',
  difficulty:'Easy',topic:'Array',topics:['Array','Bit Manipulation'],
  companies:['Amazon','Google','TCS','Wipro','Infosys','Cognizant'],frequency:80,acceptance:72.8,
  rounds:['Online Test','Round 1'],
  description:'Every element appears twice except one. Find it. O(n) time, O(1) space.',
  examples:[{input:'nums=[2,2,1]',output:'1'},{input:'nums=[4,1,2,1,2]',output:'4'}],
  constraints:['1 ≤ n ≤ 3×10⁴'],hints:['XOR: a^a=0, a^0=a'],
  testCases:[
    {input:'3\n2 2 1',output:'1',isHidden:false},{input:'5\n4 1 2 1 2',output:'4',isHidden:false},
    {input:'1\n1',output:'1',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int singleNumber(vector<int>& nums) {
        // Write your solution here

    }
};
int main() { int n; cin>>n; vector<int> v(n); for(auto&x:v)cin>>x; cout<<Solution().singleNumber(v)<<"\\n"; }`,
    java:`import java.util.*;
class Solution { public int singleNumber(int[] nums) { /* your code */ return 0; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] v=new int[n];
    for(int i=0;i<n;i++) v[i]=sc.nextInt();
    System.out.println(new Solution().singleNumber(v)); }}`,
    python:`from typing import List
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        # Write your solution here
        pass
if __name__=="__main__": n=int(input()); print(Solution().singleNumber(list(map(int,input().split()))))`
  },
  editorial:{
    approach1:{name:'XOR',timeComplexity:'O(n)',spaceComplexity:'O(1)',explanation:'XOR all. Pairs cancel. Single remains.',
      code:{cpp:'int r=0; for(int x:nums) r^=x; return r;',java:'int r=0; for(int x:nums) r^=x; return r;',python:'from functools import reduce\nfrom operator import xor\nreturn reduce(xor,nums)'}},
    companyNote:'TCS NQT favourite. Amazon: two non-repeating using XOR + bit trick.'
  },
  solution:{code:'int r=0;for(int x:nums)r^=x;return r;',language:'cpp',explanation:'XOR all',timeComplexity:'O(n)',spaceComplexity:'O(1)',followUpTips:'Two single numbers'}
},
// ===== 15. FIND PEAK ELEMENT =====
{
  questionNumber:162,title:'Find Peak Element',slug:'find-peak-element',
  difficulty:'Medium',topic:'Binary Search',topics:['Array','Binary Search'],
  companies:['Google','Meta','Amazon','Microsoft'],frequency:70,acceptance:52.6,
  rounds:['Phone Screen','Round 1'],
  description:'Find a peak element (strictly greater than neighbors). Must be O(log n).',
  examples:[{input:'nums=[1,2,3,1]',output:'2'},{input:'nums=[1,2,1,3,5,6,4]',output:'5'}],
  constraints:['1 ≤ n ≤ 1000'],hints:['If nums[mid]<nums[mid+1], peak is on right side'],
  testCases:[
    {input:'4\n1 2 3 1',output:'2',isHidden:false},{input:'7\n1 2 1 3 5 6 4',output:'5',isHidden:false},
    {input:'1\n1',output:'0',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        // Write your solution here

    }
};
int main() { int n; cin>>n; vector<int> v(n); for(auto&x:v)cin>>x; cout<<Solution().findPeakElement(v)<<"\\n"; }`,
    java:`import java.util.*;
class Solution { public int findPeakElement(int[] nums) { /* your code */ return 0; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] v=new int[n];
    for(int i=0;i<n;i++) v[i]=sc.nextInt();
    System.out.println(new Solution().findPeakElement(v)); }}`,
    python:`from typing import List
class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        # Write your solution here
        pass
if __name__=="__main__": n=int(input()); print(Solution().findPeakElement(list(map(int,input().split()))))`
  },
  editorial:{
    approach1:{name:'Binary Search',timeComplexity:'O(log n)',spaceComplexity:'O(1)',explanation:'If nums[mid]<nums[mid+1] go right, else go left.',
      code:{cpp:'int lo=0,hi=(int)nums.size()-1;\nwhile(lo<hi){\n  int mid=(lo+hi)/2;\n  if(nums[mid]<nums[mid+1]) lo=mid+1; else hi=mid;\n}\nreturn lo;',java:'int lo=0,hi=nums.length-1;\nwhile(lo<hi){int mid=(lo+hi)/2;if(nums[mid]<nums[mid+1])lo=mid+1;else hi=mid;}\nreturn lo;',python:'lo,hi=0,len(nums)-1\nwhile lo<hi:\n  mid=(lo+hi)//2\n  if nums[mid]<nums[mid+1]:lo=mid+1\n  else:hi=mid\nreturn lo'}},
    companyNote:'Google classic. Follow-up: 2D peak finding.'
  },
  solution:{code:'Binary search',language:'cpp',explanation:'Binary search',timeComplexity:'O(log n)',spaceComplexity:'O(1)',followUpTips:'2D peak'}
},
// ===== 16. SLIDING WINDOW MAXIMUM =====
{
  questionNumber:239,title:'Sliding Window Maximum',slug:'sliding-window-maximum',
  difficulty:'Hard',topic:'Queue',topics:['Array','Queue','Sliding Window','Monotonic Queue'],
  companies:['Amazon','Google','Microsoft','Flipkart'],frequency:75,acceptance:46.7,
  rounds:['DSA Round','Final Round'],
  description:'Sliding window of size k across array. Return max in each window.',
  examples:[{input:'nums=[1,3,-1,-3,5,3,6,7], k=3',output:'[3,3,5,5,6,7]'}],
  constraints:['1 ≤ n ≤ 10⁵'],hints:['Monotonic deque: front=max. Remove out-of-window indices.'],
  testCases:[
    {input:'8\n1 3 -1 -3 5 3 6 7\n3',output:'[3,3,5,5,6,7]',isHidden:false},
    {input:'1\n1\n1',output:'[1]',isHidden:false},
    {input:'4\n4 3 2 1\n2',output:'[4,3,2]',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        // Write your solution here

    }
};
int main() {
    int n; cin>>n; vector<int> v(n); for(auto&x:v)cin>>x;
    int k; cin>>k;
    auto r=Solution().maxSlidingWindow(v,k);
    cout<<"["; for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];} cout<<"]\\n";
}`,
    java:`import java.util.*;
class Solution { public int[] maxSlidingWindow(int[] nums, int k) { /* your code */ return new int[0]; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] v=new int[n];
    for(int i=0;i<n;i++) v[i]=sc.nextInt(); int k=sc.nextInt();
    int[] r=new Solution().maxSlidingWindow(v,k);
    StringBuilder sb=new StringBuilder("[");
    for(int i=0;i<r.length;i++){if(i>0)sb.append(",");sb.append(r[i]);}
    System.out.println(sb+"]"); }}`,
    python:`from typing import List
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        # Write your solution here
        pass
if __name__=="__main__":
    n=int(input()); v=list(map(int,input().split())); k=int(input())
    print('['+','.join(map(str,Solution().maxSlidingWindow(v,k)))+']')`
  },
  editorial:{
    approach1:{name:'Monotonic Deque',timeComplexity:'O(n)',spaceComplexity:'O(k)',explanation:'Deque holds indices decreasing in value. Front=max. Pop front if out of window.',
      code:{cpp:'deque<int> dq; vector<int> r;\nfor(int i=0;i<(int)nums.size();i++){\n  while(!dq.empty()&&dq.front()<i-k+1) dq.pop_front();\n  while(!dq.empty()&&nums[dq.back()]<nums[i]) dq.pop_back();\n  dq.push_back(i);\n  if(i>=k-1) r.push_back(nums[dq.front()]);\n}\nreturn r;',java:'',python:''}},
    companyNote:'Amazon hardest. Master monotonic deque!'
  },
  solution:{code:'Deque',language:'cpp',explanation:'Monotonic deque O(n)',timeComplexity:'O(n)',spaceComplexity:'O(k)',followUpTips:'Min variant'}
},
// ===== 17. 3SUM =====
{
  questionNumber:15,title:'3Sum',slug:'3sum',
  difficulty:'Medium',topic:'Array',topics:['Array','Two Pointers','Sorting'],
  companies:['Google','Amazon','Meta','Microsoft','Apple'],frequency:78,acceptance:33.8,
  rounds:['Round 2','DSA Round'],
  description:'Find all unique triplets that sum to 0. No duplicate triplets.',
  examples:[{input:'nums=[-1,0,1,2,-1,-4]',output:'[[-1,-1,2],[-1,0,1]]'},{input:'nums=[0,0,0]',output:'[[0,0,0]]'}],
  constraints:['3 ≤ n ≤ 3000'],hints:['Sort. Fix i. Two pointers l,r.'],
  testCases:[
    {input:'6\n-1 0 1 2 -1 -4',output:'[[-1,-1,2],[-1,0,1]]',isHidden:false},
    {input:'3\n0 0 0',output:'[[0,0,0]]',isHidden:false},
    {input:'3\n0 1 1',output:'[]',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // Write your solution here

    }
};
int main() {
    int n; cin>>n; vector<int> v(n); for(auto&x:v)cin>>x;
    auto r=Solution().threeSum(v);
    cout<<"["; for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<"["<<r[i][0]<<","<<r[i][1]<<","<<r[i][2]<<"]";} cout<<"]\\n";
}`,
    java:`import java.util.*;
class Solution { public List<List<Integer>> threeSum(int[] nums) { /* your code */ return new ArrayList<>(); } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(); int[] v=new int[n];
    for(int i=0;i<n;i++) v[i]=sc.nextInt();
    var r=new Solution().threeSum(v);
    StringBuilder sb=new StringBuilder("[");
    for(int i=0;i<r.size();i++){if(i>0)sb.append(",");sb.append("[").append(r.get(i).get(0)).append(",").append(r.get(i).get(1)).append(",").append(r.get(i).get(2)).append("]");}
    System.out.println(sb+"]"); }}`,
    python:`from typing import List
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        # Write your solution here
        pass
if __name__=="__main__":
    n=int(input()); v=list(map(int,input().split()))
    r=Solution().threeSum(v)
    print('['+','.join(['['+','.join(map(str,t))+']' for t in r])+']')`
  },
  editorial:{
    approach1:{name:'Sort + Two Pointers',timeComplexity:'O(n²)',spaceComplexity:'O(1)',explanation:'Sort. Fix i. l=i+1,r=n-1. Skip duplicates.',
      code:{cpp:'sort(nums.begin(),nums.end());\nvector<vector<int>> r;\nfor(int i=0;i<(int)nums.size()-2;i++){\n  if(i>0&&nums[i]==nums[i-1]) continue;\n  int l=i+1,ri=(int)nums.size()-1;\n  while(l<ri){\n    int s=nums[i]+nums[l]+nums[ri];\n    if(s==0){r.push_back({nums[i],nums[l],nums[ri]});\n      while(l<ri&&nums[l]==nums[l+1])l++;\n      while(l<ri&&nums[ri]==nums[ri-1])ri--;\n      l++;ri--;}\n    else if(s<0)l++; else ri--;\n  }\n}\nreturn r;',java:'',python:''}},
    companyNote:'Google: 4Sum. Meta: stream? Amazon: Closest 3Sum.'
  },
  solution:{code:'Sort+two ptr',language:'cpp',explanation:'O(n²)',timeComplexity:'O(n²)',spaceComplexity:'O(1)',followUpTips:'4Sum generalization'}
},
// ===== 18. WORD SEARCH =====
{
  questionNumber:79,title:'Word Search',slug:'word-search',
  difficulty:'Medium',topic:'Backtracking',topics:['Array','Backtracking','Matrix'],
  companies:['Amazon','Microsoft','Google','Meta','Accenture'],frequency:72,acceptance:41.8,
  rounds:['Round 2','DSA Round'],
  description:'Given m×n character grid, return true if word exists via adjacent horizontal/vertical cells without reuse.',
  examples:[{input:'board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED"',output:'true'}],
  constraints:['1 ≤ m,n ≤ 6','1 ≤ word.length ≤ 15'],hints:['DFS from each cell. Mark # then restore.'],
  testCases:[
    {input:'3 4\nA B C E\nS F C S\nA D E E\nABCCED',output:'true',isHidden:false},
    {input:'3 4\nA B C E\nS F C S\nA D E E\nSEE',output:'true',isHidden:false},
    {input:'3 4\nA B C E\nS F C S\nA D E E\nABCB',output:'false',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        // Write your solution here

    }
};
int main() {
    int m,n; cin>>m>>n;
    vector<vector<char>> b(m,vector<char>(n));
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){char c;cin>>c;b[i][j]=c;}
    string w; cin>>w;
    cout<<(Solution().exist(b,w)?"true":"false")<<"\\n";
}`,
    java:`import java.util.*;
class Solution { public boolean exist(char[][] b, String word) { /* your code */ return false; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int m=sc.nextInt(),n=sc.nextInt();
    char[][] b=new char[m][n];
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) b[i][j]=sc.next().charAt(0);
    System.out.println(new Solution().exist(b,sc.next())?"true":"false"); }}`,
    python:`from typing import List
class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        # Write your solution here
        pass
if __name__=="__main__":
    m,n=map(int,input().split())
    b=[input().split() for _ in range(m)]
    print(str(Solution().exist(b,input().strip())).lower())`
  },
  editorial:{
    approach1:{name:'DFS + Backtracking',timeComplexity:'O(m×n×4^L)',spaceComplexity:'O(L)',explanation:'For each start cell, DFS 4 dirs. Mark # during explore, restore after.',
      code:{cpp:"int m=board.size(),n=board[0].size();\nfunction<bool(int,int,int)> dfs=[&](int i,int j,int k)->bool{\n  if(k==(int)word.size()) return true;\n  if(i<0||i>=m||j<0||j>=n||board[i][j]!=word[k]) return false;\n  char t=board[i][j]; board[i][j]='#';\n  bool r=dfs(i+1,j,k+1)||dfs(i-1,j,k+1)||dfs(i,j+1,k+1)||dfs(i,j-1,k+1);\n  board[i][j]=t; return r;\n};\nfor(int i=0;i<m;i++) for(int j=0;j<n;j++) if(dfs(i,j,0)) return true;\nreturn false;",java:'',python:''}},
    companyNote:'Amazon: Word Search II (Trie). Microsoft: Count all occurrences.'
  },
  solution:{code:'DFS backtrack',language:'cpp',explanation:'DFS+Backtrack',timeComplexity:'O(mn×4^L)',spaceComplexity:'O(L)',followUpTips:'Word Search II Trie'}
},
// ===== 19. COURSE SCHEDULE =====
{
  questionNumber:207,title:'Course Schedule',slug:'course-schedule',
  difficulty:'Medium',topic:'Graph',topics:['DFS','BFS','Graph','Topological Sort'],
  companies:['Google','Amazon','Meta','Microsoft','Zoho'],frequency:75,acceptance:46.5,
  rounds:['Round 2','DSA Round'],
  description:'numCourses courses with prerequisites. Return true if all can be finished (no cycle).',
  examples:[{input:'n=2, pre=[[1,0]]',output:'true'},{input:'n=2, pre=[[1,0],[0,1]]',output:'false'}],
  constraints:['1 ≤ numCourses ≤ 2000'],hints:["Kahn's BFS or DFS cycle detection"],
  testCases:[
    {input:'2\n1\n1 0',output:'true',isHidden:false},
    {input:'2\n2\n1 0\n0 1',output:'false',isHidden:false},
    {input:'1\n0',output:'true',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // Write your solution here

    }
};
int main() {
    int n,m; cin>>n>>m;
    vector<vector<int>> pre(m,vector<int>(2));
    for(int i=0;i<m;i++) cin>>pre[i][0]>>pre[i][1];
    cout<<(Solution().canFinish(n,pre)?"true":"false")<<"\\n";
}`,
    java:`import java.util.*;
class Solution { public boolean canFinish(int n, int[][] pre) { /* your code */ return false; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in); int n=sc.nextInt(),m=sc.nextInt();
    int[][] pre=new int[m][2];
    for(int i=0;i<m;i++){pre[i][0]=sc.nextInt();pre[i][1]=sc.nextInt();}
    System.out.println(new Solution().canFinish(n,pre)?"true":"false"); }}`,
    python:`from typing import List
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        # Write your solution here
        pass
if __name__=="__main__":
    n=int(input()); m=int(input())
    pre=[list(map(int,input().split())) for _ in range(m)] if m else []
    print(str(Solution().canFinish(n,pre)).lower())`
  },
  editorial:{
    approach1:{name:"Kahn's BFS Topological Sort",timeComplexity:'O(V+E)',spaceComplexity:'O(V+E)',explanation:'Count in-degrees. BFS from 0-indegree nodes. All processed = acyclic.',
      code:{cpp:'vector<int> indeg(numCourses,0);\nvector<vector<int>> adj(numCourses);\nfor(auto&p:prerequisites){adj[p[1]].push_back(p[0]);indeg[p[0]]++;}\nqueue<int> q;\nfor(int i=0;i<numCourses;i++) if(!indeg[i]) q.push(i);\nint cnt=0;\nwhile(!q.empty()){int u=q.front();q.pop();cnt++;for(int v:adj[u]) if(--indeg[v]==0) q.push(v);}\nreturn cnt==numCourses;',java:'',python:''}},
    companyNote:'Google: Course Schedule II (return order). Meta: Alien Dictionary. Amazon: Task Scheduler.'
  },
  solution:{code:'Kahn BFS',language:'cpp',explanation:'Topological sort',timeComplexity:'O(V+E)',spaceComplexity:'O(V+E)',followUpTips:'Course Schedule II'}
},
// ===== 20. MEDIAN OF TWO SORTED ARRAYS =====
{
  questionNumber:4,title:'Median of Two Sorted Arrays',slug:'median-of-two-sorted-arrays',
  difficulty:'Hard',topic:'Binary Search',topics:['Array','Binary Search','Divide and Conquer'],
  companies:['Google','Amazon','Microsoft','Meta','Apple'],frequency:80,acceptance:39.2,
  rounds:['Final Round','DSA Round'],
  description:'Given two sorted arrays, return the median. Required: O(log(m+n)).',
  examples:[{input:'nums1=[1,3], nums2=[2]',output:'2.00000'},{input:'nums1=[1,2], nums2=[3,4]',output:'2.50000'}],
  constraints:['0 ≤ m,n ≤ 1000'],hints:['Binary search on smaller array partition'],
  testCases:[
    {input:'2\n1 3\n1\n2',output:'2.00000',isHidden:false},
    {input:'2\n1 2\n2\n3 4',output:'2.50000',isHidden:false},
    {input:'1\n3\n2\n1 2',output:'2.00000',isHidden:true},
  ],
  starterCode:{
    cpp:`#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // Write your solution here

    }
};
int main() {
    int m; cin>>m; vector<int> a(m); for(auto&x:a)cin>>x;
    int n; cin>>n; vector<int> b(n); for(auto&x:b)cin>>x;
    cout<<fixed<<setprecision(5)<<Solution().findMedianSortedArrays(a,b)<<"\\n";
}`,
    java:`import java.util.*;
class Solution { public double findMedianSortedArrays(int[] a, int[] b) { /* your code */ return 0; } }
class Main { public static void main(String[] args) {
    Scanner sc=new Scanner(System.in);
    int m=sc.nextInt(); int[] a=new int[m]; for(int i=0;i<m;i++) a[i]=sc.nextInt();
    int n=sc.nextInt(); int[] b=new int[n]; for(int i=0;i<n;i++) b[i]=sc.nextInt();
    System.out.printf("%.5f%n",new Solution().findMedianSortedArrays(a,b)); }}`,
    python:`from typing import List
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        # Write your solution here
        pass
if __name__=="__main__":
    m=int(input()); a=list(map(int,input().split())) if m else []
    n=int(input()); b=list(map(int,input().split())) if n else []
    print(f"{Solution().findMedianSortedArrays(a,b):.5f}")`
  },
  editorial:{
    approach1:{name:'Binary Search Partition',timeComplexity:'O(log(min(m,n)))',spaceComplexity:'O(1)',explanation:'Binary search on smaller array. Partition so left count = right count.',
      code:{cpp:'if(nums1.size()>nums2.size()) return findMedianSortedArrays(nums2,nums1);\nint m=nums1.size(),n=nums2.size(),lo=0,hi=m;\nwhile(lo<=hi){\n  int i=(lo+hi)/2,j=(m+n+1)/2-i;\n  int lm1=i?nums1[i-1]:INT_MIN,rm1=i<m?nums1[i]:INT_MAX;\n  int lm2=j?nums2[j-1]:INT_MIN,rm2=j<n?nums2[j]:INT_MAX;\n  if(lm1<=rm2&&lm2<=rm1){\n    if((m+n)%2) return max(lm1,lm2);\n    return(max(lm1,lm2)+min(rm1,rm2))/2.0;\n  }\n  else if(lm1>rm2) hi=i-1; else lo=i+1;\n}\nreturn 0;',java:'',python:''}},
    companyNote:'Google onsite must-know! Follow-up: kth element.'
  },
  solution:{code:'Binary partition',language:'cpp',explanation:'O(log min(m,n))',timeComplexity:'O(log(m+n))',spaceComplexity:'O(1)',followUpTips:'Kth element generalization'}
}
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placeprep');
    console.log('MongoDB connected');
    await Question.deleteMany({});
    console.log('Cleared questions');
    const inserted = await Question.insertMany(questions);
    console.log(`\n✅ Seeded ${inserted.length} FAANG questions!`);
    const counts = {Easy:0,Medium:0,Hard:0};
    inserted.forEach(q => counts[q.difficulty]++);
    console.log(`   Easy: ${counts.Easy} | Medium: ${counts.Medium} | Hard: ${counts.Hard}`);
    const allCompanies = [...new Set(inserted.flatMap(q=>q.companies))].sort();
    console.log(`   Companies covered: ${allCompanies.join(', ')}`);
  } catch(err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Done.');
  }
}

seed();
