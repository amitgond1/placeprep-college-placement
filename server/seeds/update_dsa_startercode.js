require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Question = require('../models/Question');

// Helper to build standard array-input starterCode
function makeArrayStarter(fnName, retType = 'int', params = 'vector<int>& nums') {
  return {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    ${retType} ${fnName}(${params}) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    cout << Solution().${fnName}(nums) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public ${retType === 'vector<int>' ? 'int[]' : retType} ${fnName}(int[] nums) {
        // Write your solution here
        return ${retType === 'boolean' ? 'false' : '0'};
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i = 0; i < n; i++) nums[i] = sc.nextInt();
        System.out.println(new Solution().${fnName}(nums));
    }
}`,
    python: `from typing import List
class Solution:
    def ${fnName}(self, nums: List[int]) -> ${retType === 'boolean' ? 'bool' : 'int'}:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    print(Solution().${fnName}(nums))`
  };
}

const updates = [

// ── ARRAYS ──
{ title: 'Container With Most Water',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int maxArea(vector<int>& height) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> h(n);
    for(int& x : h) cin >> x;
    cout << Solution().maxArea(h) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int maxArea(int[] height) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] h = new int[n];
        for(int i=0;i<n;i++) h[i]=sc.nextInt();
        System.out.println(new Solution().maxArea(h));
    }
}`,
    python: `from typing import List
class Solution:
    def maxArea(self, height: List[int]) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    h = list(map(int, input().split()))
    print(Solution().maxArea(h))`
  },
  testCases: [
    { input: '9\n1 8 6 2 5 4 8 3 7', output: '49', isHidden: false },
    { input: '2\n1 1', output: '1', isHidden: false },
    { input: '6\n4 3 2 1 4 100', output: '100', isHidden: true },
    { input: '4\n1 2 1 3', output: '3', isHidden: true },
  ]
},

{ title: 'Move Zeroes',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    Solution().moveZeroes(nums);
    for(int i=0;i<n;i++) cout << nums[i] << " \\n"[i==n-1];
}`,
    java: `import java.util.*;
class Solution {
    public void moveZeroes(int[] nums) {
        // Write your solution here
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        new Solution().moveZeroes(nums);
        StringBuilder sb = new StringBuilder();
        for(int i=0;i<n;i++){if(i>0)sb.append(" ");sb.append(nums[i]);}
        System.out.println(sb);
    }
}`,
    python: `from typing import List
class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        # Write your solution here (modify in place)
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    Solution().moveZeroes(nums)
    print(' '.join(map(str, nums)))`
  },
  testCases: [
    { input: '5\n0 1 0 3 12', output: '1 3 12 0 0', isHidden: false },
    { input: '1\n0', output: '0', isHidden: false },
    { input: '5\n0 0 1 0 2', output: '1 2 0 0 0', isHidden: true },
    { input: '4\n1 2 3 4', output: '1 2 3 4', isHidden: true },
  ]
},

{ title: 'Find All Numbers Disappeared in Array',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> findDisappearedNumbers(vector<int>& nums) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    auto r = Solution().findDisappearedNumbers(nums);
    for(int i=0;i<(int)r.size();i++) cout<<r[i]<<" \\n"[i==(int)r.size()-1];
}`,
    java: `import java.util.*;
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        List<Integer> r = new Solution().findDisappearedNumbers(nums);
        StringBuilder sb = new StringBuilder();
        for(int i=0;i<r.size();i++){if(i>0)sb.append(" ");sb.append(r.get(i));}
        System.out.println(sb);
    }
}`,
    python: `from typing import List
class Solution:
    def findDisappearedNumbers(self, nums: List[int]) -> List[int]:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    print(' '.join(map(str, Solution().findDisappearedNumbers(nums))))`
  },
  testCases: [
    { input: '8\n4 3 2 7 8 2 3 1', output: '5 6', isHidden: false },
    { input: '2\n1 1', output: '2', isHidden: false },
    { input: '5\n1 1 2 2 5', output: '3 4', isHidden: true },
    { input: '4\n4 3 2 1', output: '', isHidden: true },
  ]
},

{ title: 'Rotate Image',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<vector<int>> m(n, vector<int>(n));
    for(auto& row : m) for(int& x : row) cin >> x;
    Solution().rotate(m);
    for(auto& row : m){ for(int i=0;i<n;i++) cout<<row[i]<<" \\n"[i==n-1]; }
}`,
    java: `import java.util.*;
class Solution {
    public void rotate(int[][] matrix) {
        // Write your solution here
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] m = new int[n][n];
        for(int i=0;i<n;i++) for(int j=0;j<n;j++) m[i][j]=sc.nextInt();
        new Solution().rotate(m);
        for(int i=0;i<n;i++){
            StringBuilder sb=new StringBuilder();
            for(int j=0;j<n;j++){if(j>0)sb.append(" ");sb.append(m[i][j]);}
            System.out.println(sb);
        }
    }
}`,
    python: `from typing import List
class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        # Write your solution here (modify in place)
        pass
if __name__ == "__main__":
    n = int(input())
    matrix = [list(map(int, input().split())) for _ in range(n)]
    Solution().rotate(matrix)
    for row in matrix:
        print(' '.join(map(str, row)))`
  },
  testCases: [
    { input: '3\n1 2 3\n4 5 6\n7 8 9', output: '7 4 1\n8 5 2\n9 6 3', isHidden: false },
    { input: '2\n1 2\n3 4', output: '3 1\n4 2', isHidden: false },
    { input: '4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16', output: '15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11', isHidden: true },
    { input: '1\n5', output: '5', isHidden: true },
  ]
},

{ title: 'Set Matrix Zeroes',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        // Write your solution here

    }
};
int main() {
    int m, n; cin >> m >> n;
    vector<vector<int>> mat(m, vector<int>(n));
    for(auto& row : mat) for(int& x : row) cin >> x;
    Solution().setZeroes(mat);
    for(auto& row : mat){ for(int i=0;i<n;i++) cout<<row[i]<<" \\n"[i==n-1]; }
}`,
    java: `import java.util.*;
class Solution {
    public void setZeroes(int[][] matrix) {
        // Write your solution here
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m=sc.nextInt(), n=sc.nextInt();
        int[][] mat = new int[m][n];
        for(int i=0;i<m;i++) for(int j=0;j<n;j++) mat[i][j]=sc.nextInt();
        new Solution().setZeroes(mat);
        for(int i=0;i<m;i++){
            StringBuilder sb=new StringBuilder();
            for(int j=0;j<n;j++){if(j>0)sb.append(" ");sb.append(mat[i][j]);}
            System.out.println(sb);
        }
    }
}`,
    python: `from typing import List
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        # Write your solution here (modify in place)
        pass
if __name__ == "__main__":
    m, n = map(int, input().split())
    matrix = [list(map(int, input().split())) for _ in range(m)]
    Solution().setZeroes(matrix)
    for row in matrix:
        print(' '.join(map(str, row)))`
  },
  testCases: [
    { input: '3 3\n1 1 1\n1 0 1\n1 1 1', output: '1 0 1\n0 0 0\n1 0 1', isHidden: false },
    { input: '3 4\n0 1 2 0\n3 4 5 2\n1 3 1 5', output: '0 0 0 0\n0 4 5 0\n0 3 1 0', isHidden: false },
    { input: '2 2\n0 0\n0 0', output: '0 0\n0 0', isHidden: true },
    { input: '2 2\n1 2\n3 4', output: '1 2\n3 4', isHidden: true },
  ]
},

{ title: "Pascal's Triangle",
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    auto r = Solution().generate(n);
    for(auto& row : r){
        for(int i=0;i<(int)row.size();i++) cout<<row[i]<<" \\n"[i==(int)row.size()-1];
    }
}`,
    java: `import java.util.*;
class Solution {
    public List<List<Integer>> generate(int numRows) {
        // Write your solution here
        return new ArrayList<>();
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<List<Integer>> r = new Solution().generate(n);
        for(List<Integer> row : r){
            StringBuilder sb=new StringBuilder();
            for(int i=0;i<row.size();i++){if(i>0)sb.append(" ");sb.append(row.get(i));}
            System.out.println(sb);
        }
    }
}`,
    python: `from typing import List
class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    r = Solution().generate(n)
    for row in r:
        print(' '.join(map(str, row)))`
  },
  testCases: [
    { input: '5', output: '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1', isHidden: false },
    { input: '1', output: '1', isHidden: false },
    { input: '3', output: '1\n1 1\n1 2 1', isHidden: true },
    { input: '6', output: '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n1 5 10 10 5 1', isHidden: true },
  ]
},

{ title: 'Majority Element',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    cout << Solution().majorityElement(nums) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int majorityElement(int[] nums) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        System.out.println(new Solution().majorityElement(nums));
    }
}`,
    python: `from typing import List
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    print(Solution().majorityElement(nums))`
  },
  testCases: [
    { input: '3\n3 2 3', output: '3', isHidden: false },
    { input: '7\n2 2 1 1 1 2 2', output: '2', isHidden: false },
    { input: '5\n1 1 2 1 3', output: '1', isHidden: true },
    { input: '1\n7', output: '7', isHidden: true },
  ]
},

// ── BINARY SEARCH ──
{ title: 'Binary Search',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    int t; cin >> t;
    cout << Solution().search(nums, t) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        System.out.println(new Solution().search(nums, sc.nextInt()));
    }
}`,
    python: `from typing import List
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    t = int(input())
    print(Solution().search(nums, t))`
  },
  testCases: [
    { input: '6\n-1 0 3 5 9 12\n9', output: '4', isHidden: false },
    { input: '6\n-1 0 3 5 9 12\n2', output: '-1', isHidden: false },
    { input: '5\n1 3 5 7 9\n7', output: '3', isHidden: true },
    { input: '3\n1 2 3\n4', output: '-1', isHidden: true },
  ]
},

{ title: 'Find Minimum in Rotated Sorted Array',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int findMin(vector<int>& nums) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    cout << Solution().findMin(nums) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int findMin(int[] nums) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        System.out.println(new Solution().findMin(nums));
    }
}`,
    python: `from typing import List
class Solution:
    def findMin(self, nums: List[int]) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    print(Solution().findMin(nums))`
  },
  testCases: [
    { input: '5\n3 4 5 1 2', output: '1', isHidden: false },
    { input: '7\n4 5 6 7 0 1 2', output: '0', isHidden: false },
    { input: '4\n11 13 15 17', output: '11', isHidden: true },
    { input: '6\n6 1 2 3 4 5', output: '1', isHidden: true },
  ]
},

{ title: 'Koko Eating Bananas',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> piles(n);
    for(int& x : piles) cin >> x;
    int h; cin >> h;
    cout << Solution().minEatingSpeed(piles, h) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] piles = new int[n];
        for(int i=0;i<n;i++) piles[i]=sc.nextInt();
        System.out.println(new Solution().minEatingSpeed(piles, sc.nextInt()));
    }
}`,
    python: `from typing import List
class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    piles = list(map(int, input().split()))
    h = int(input())
    print(Solution().minEatingSpeed(piles, h))`
  },
  testCases: [
    { input: '4\n3 6 7 11\n8', output: '4', isHidden: false },
    { input: '5\n30 11 23 4 20\n5', output: '30', isHidden: false },
    { input: '5\n30 11 23 4 20\n6', output: '23', isHidden: true },
    { input: '3\n1 1 1\n3', output: '1', isHidden: true },
  ]
},

{ title: 'Capacity To Ship Packages Within D Days',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int shipWithinDays(vector<int>& weights, int days) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> w(n);
    for(int& x : w) cin >> x;
    int d; cin >> d;
    cout << Solution().shipWithinDays(w, d) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int shipWithinDays(int[] weights, int days) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] w = new int[n];
        for(int i=0;i<n;i++) w[i]=sc.nextInt();
        System.out.println(new Solution().shipWithinDays(w, sc.nextInt()));
    }
}`,
    python: `from typing import List
class Solution:
    def shipWithinDays(self, weights: List[int], days: int) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    weights = list(map(int, input().split()))
    days = int(input())
    print(Solution().shipWithinDays(weights, days))`
  },
  testCases: [
    { input: '10\n1 2 3 4 5 6 7 8 9 10\n5', output: '15', isHidden: false },
    { input: '6\n3 2 2 4 1 4\n3', output: '6', isHidden: false },
    { input: '5\n1 2 3 1 1\n4', output: '3', isHidden: true },
    { input: '4\n10 10 10 10\n4', output: '10', isHidden: true },
  ]
},

// ── SLIDING WINDOW ──
{ title: 'Permutation in String',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        // Write your solution here

    }
};
int main() {
    string s1, s2; cin >> s1 >> s2;
    cout << (Solution().checkInclusion(s1, s2) ? "true" : "false") << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public boolean checkInclusion(String s1, String s2) {
        // Write your solution here
        return false;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(new Solution().checkInclusion(sc.next(), sc.next()));
    }
}`,
    python: `class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        # Write your solution here
        pass
if __name__ == "__main__":
    s1 = input()
    s2 = input()
    print(Solution().checkInclusion(s1, s2))`
  },
  testCases: [
    { input: 'ab\neidbaooo', output: 'true', isHidden: false },
    { input: 'ab\neidboaoo', output: 'false', isHidden: false },
    { input: 'adc\ndcda', output: 'true', isHidden: true },
    { input: 'hello\nooolleoooleh', output: 'false', isHidden: true },
  ]
},

{ title: 'Max Consecutive Ones III',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    int k; cin >> k;
    cout << Solution().longestOnes(nums, k) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int longestOnes(int[] nums, int k) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        System.out.println(new Solution().longestOnes(nums, sc.nextInt()));
    }
}`,
    python: `from typing import List
class Solution:
    def longestOnes(self, nums: List[int], k: int) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    k = int(input())
    print(Solution().longestOnes(nums, k))`
  },
  testCases: [
    { input: '11\n1 1 1 0 0 0 1 1 1 1 0\n2', output: '6', isHidden: false },
    { input: '20\n0 0 1 1 0 0 1 1 1 0 1 1 0 0 0 1 1 1 1 0\n3', output: '10', isHidden: false },
    { input: '5\n0 0 0 0 0\n0', output: '0', isHidden: true },
    { input: '5\n1 1 1 1 1\n3', output: '5', isHidden: true },
  ]
},

{ title: 'Longest Repeating Character Replacement',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int characterReplacement(string s, int k) {
        // Write your solution here

    }
};
int main() {
    string s; int k;
    cin >> s >> k;
    cout << Solution().characterReplacement(s, k) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int characterReplacement(String s, int k) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next(); int k = sc.nextInt();
        System.out.println(new Solution().characterReplacement(s, k));
    }
}`,
    python: `class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    s = input()
    k = int(input())
    print(Solution().characterReplacement(s, k))`
  },
  testCases: [
    { input: 'ABAB\n2', output: '4', isHidden: false },
    { input: 'AABABBA\n1', output: '4', isHidden: false },
    { input: 'AAAA\n0', output: '4', isHidden: true },
    { input: 'ABCDE\n2', output: '3', isHidden: true },
  ]
},

// ── STACK ──
{ title: 'Next Greater Element I',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        // Write your solution here

    }
};
int main() {
    int m; cin >> m;
    vector<int> n1(m);
    for(int& x : n1) cin >> x;
    int n; cin >> n;
    vector<int> n2(n);
    for(int& x : n2) cin >> x;
    auto r = Solution().nextGreaterElement(n1, n2);
    for(int i=0;i<(int)r.size();i++) cout<<r[i]<<" \\n"[i==(int)r.size()-1];
}`,
    java: `import java.util.*;
class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        // Write your solution here
        return new int[]{};
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int[] n1 = new int[m];
        for(int i=0;i<m;i++) n1[i]=sc.nextInt();
        int n = sc.nextInt();
        int[] n2 = new int[n];
        for(int i=0;i<n;i++) n2[i]=sc.nextInt();
        int[] r = new Solution().nextGreaterElement(n1, n2);
        StringBuilder sb = new StringBuilder();
        for(int i=0;i<r.length;i++){if(i>0)sb.append(" ");sb.append(r[i]);}
        System.out.println(sb);
    }
}`,
    python: `from typing import List
class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        # Write your solution here
        pass
if __name__ == "__main__":
    m = int(input())
    nums1 = list(map(int, input().split()))
    n = int(input())
    nums2 = list(map(int, input().split()))
    print(' '.join(map(str, Solution().nextGreaterElement(nums1, nums2))))`
  },
  testCases: [
    { input: '3\n4 1 2\n4\n1 3 4 2', output: '-1 3 -1', isHidden: false },
    { input: '2\n2 4\n4\n1 2 3 4', output: '3 -1', isHidden: false },
    { input: '1\n1\n3\n1 3 2', output: '3', isHidden: true },
    { input: '3\n1 2 3\n3\n3 2 1', output: '-1 -1 -1', isHidden: true },
  ]
},

{ title: 'Generate Parentheses',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<string> generateParenthesis(int n) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    auto r = Solution().generateParenthesis(n);
    sort(r.begin(), r.end());
    for(auto& s : r) cout << s << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public List<String> generateParenthesis(int n) {
        // Write your solution here
        return new ArrayList<>();
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> r = new Solution().generateParenthesis(sc.nextInt());
        Collections.sort(r);
        for(String s : r) System.out.println(s);
    }
}`,
    python: `from typing import List
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    r = sorted(Solution().generateParenthesis(n))
    for s in r:
        print(s)`
  },
  testCases: [
    { input: '1', output: '()', isHidden: false },
    { input: '3', output: '((()))\n(()())\n(())()\n()(())\n()()()', isHidden: false },
    { input: '2', output: '(())\n()()', isHidden: true },
    { input: '4', output: '(((())))\n((()()))\n((())())\n((()))()\n(()(()))\n(()()())\n(()())()\n(())(())\n(())()()\n()((()))\n()(()())\n()(())()\n()()(())\n()()()()', isHidden: true },
  ]
},

// ── STRINGS ──
{ title: 'Valid Palindrome',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool isPalindrome(string s) {
        // Write your solution here

    }
};
int main() {
    string s; getline(cin, s);
    cout << (Solution().isPalindrome(s) ? "true" : "false") << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public boolean isPalindrome(String s) {
        // Write your solution here
        return false;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(new Solution().isPalindrome(sc.nextLine()));
    }
}`,
    python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Write your solution here
        pass
if __name__ == "__main__":
    s = input()
    print(Solution().isPalindrome(s))`
  },
  testCases: [
    { input: 'A man, a plan, a canal: Panama', output: 'true', isHidden: false },
    { input: 'race a car', output: 'false', isHidden: false },
    { input: ' ', output: 'true', isHidden: true },
    { input: '0P', output: 'false', isHidden: true },
  ]
},

{ title: 'Sort Colors',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    void sortColors(vector<int>& nums) {
        // Write your solution here (Dutch National Flag)

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    Solution().sortColors(nums);
    for(int i=0;i<n;i++) cout<<nums[i]<<" \\n"[i==n-1];
}`,
    java: `import java.util.*;
class Solution {
    public void sortColors(int[] nums) {
        // Write your solution here (Dutch National Flag)
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        new Solution().sortColors(nums);
        StringBuilder sb=new StringBuilder();
        for(int i=0;i<n;i++){if(i>0)sb.append(" ");sb.append(nums[i]);}
        System.out.println(sb);
    }
}`,
    python: `from typing import List
class Solution:
    def sortColors(self, nums: List[int]) -> None:
        # Write your solution here (Dutch National Flag, modify in place)
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    Solution().sortColors(nums)
    print(' '.join(map(str, nums)))`
  },
  testCases: [
    { input: '6\n2 0 2 1 1 0', output: '0 0 1 1 2 2', isHidden: false },
    { input: '3\n2 0 1', output: '0 1 2', isHidden: false },
    { input: '4\n0 0 1 2', output: '0 0 1 2', isHidden: true },
    { input: '5\n1 2 0 1 0', output: '0 0 1 1 2', isHidden: true },
  ]
},

{ title: 'Longest Common Prefix',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<string> strs(n);
    for(string& s : strs) cin >> s;
    cout << Solution().longestCommonPrefix(strs) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public String longestCommonPrefix(String[] strs) {
        // Write your solution here
        return "";
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] strs = new String[n];
        for(int i=0;i<n;i++) strs[i]=sc.next();
        System.out.println(new Solution().longestCommonPrefix(strs));
    }
}`,
    python: `from typing import List
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    strs = [input() for _ in range(n)]
    print(Solution().longestCommonPrefix(strs))`
  },
  testCases: [
    { input: '3\nflower\nflow\nflight', output: 'fl', isHidden: false },
    { input: '3\ndog\nracecar\ncar', output: '', isHidden: false },
    { input: '2\nabc\nabc', output: 'abc', isHidden: true },
    { input: '4\ninterspecies\ninterstellar\ninteractive\ninter', output: 'inter', isHidden: true },
  ]
},

{ title: 'Roman to Integer',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int romanToInt(string s) {
        // Write your solution here

    }
};
int main() {
    string s; cin >> s;
    cout << Solution().romanToInt(s) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int romanToInt(String s) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        System.out.println(new Solution().romanToInt(new Scanner(System.in).next()));
    }
}`,
    python: `class Solution:
    def romanToInt(self, s: str) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    print(Solution().romanToInt(input()))`
  },
  testCases: [
    { input: 'III', output: '3', isHidden: false },
    { input: 'MCMXCIV', output: '1994', isHidden: false },
    { input: 'LVIII', output: '58', isHidden: true },
    { input: 'IX', output: '9', isHidden: true },
  ]
},

{ title: 'Reverse Words in a String',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    string reverseWords(string s) {
        // Write your solution here

    }
};
int main() {
    string s; getline(cin, s);
    cout << Solution().reverseWords(s) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public String reverseWords(String s) {
        // Write your solution here
        return "";
    }
}
class Main {
    public static void main(String[] args) {
        System.out.println(new Solution().reverseWords(new Scanner(System.in).nextLine()));
    }
}`,
    python: `class Solution:
    def reverseWords(self, s: str) -> str:
        # Write your solution here
        pass
if __name__ == "__main__":
    print(Solution().reverseWords(input()))`
  },
  testCases: [
    { input: 'the sky is blue', output: 'blue is sky the', isHidden: false },
    { input: '  hello world  ', output: 'world hello', isHidden: false },
    { input: 'a good   example', output: 'example good a', isHidden: true },
    { input: 'Let s take LeetCode contest', output: 'contest LeetCode take s Let', isHidden: true },
  ]
},

{ title: 'Count and Say',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    string countAndSay(int n) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    cout << Solution().countAndSay(n) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public String countAndSay(int n) {
        // Write your solution here
        return "";
    }
}
class Main {
    public static void main(String[] args) {
        System.out.println(new Solution().countAndSay(new Scanner(System.in).nextInt()));
    }
}`,
    python: `class Solution:
    def countAndSay(self, n: int) -> str:
        # Write your solution here
        pass
if __name__ == "__main__":
    print(Solution().countAndSay(int(input())))`
  },
  testCases: [
    { input: '1', output: '1', isHidden: false },
    { input: '4', output: '1211', isHidden: false },
    { input: '5', output: '111221', isHidden: true },
    { input: '6', output: '312211', isHidden: true },
  ]
},

// ── BIT MANIPULATION ──
{ title: 'Number of 1 Bits',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int hammingWeight(uint32_t n) {
        // Write your solution here

    }
};
int main() {
    uint32_t n; cin >> n;
    cout << Solution().hammingWeight(n) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int hammingWeight(int n) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        System.out.println(new Solution().hammingWeight(new Scanner(System.in).nextInt()));
    }
}`,
    python: `class Solution:
    def hammingWeight(self, n: int) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    print(Solution().hammingWeight(int(input())))`
  },
  testCases: [
    { input: '11', output: '3', isHidden: false },
    { input: '128', output: '1', isHidden: false },
    { input: '4294967293', output: '31', isHidden: true },
    { input: '7', output: '3', isHidden: true },
  ]
},

{ title: 'Power of Two',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool isPowerOfTwo(int n) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    cout << (Solution().isPowerOfTwo(n) ? "true" : "false") << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public boolean isPowerOfTwo(int n) {
        // Write your solution here
        return false;
    }
}
class Main {
    public static void main(String[] args) {
        System.out.println(new Solution().isPowerOfTwo(new Scanner(System.in).nextInt()));
    }
}`,
    python: `class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        # Write your solution here
        pass
if __name__ == "__main__":
    print(Solution().isPowerOfTwo(int(input())))`
  },
  testCases: [
    { input: '1', output: 'true', isHidden: false },
    { input: '16', output: 'true', isHidden: false },
    { input: '3', output: 'false', isHidden: true },
    { input: '0', output: 'false', isHidden: true },
  ]
},

{ title: 'Sum of Two Integers',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int getSum(int a, int b) {
        // Write your solution here (without + or -)

    }
};
int main() {
    int a, b; cin >> a >> b;
    cout << Solution().getSum(a, b) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int getSum(int a, int b) {
        // Write your solution here (without + or -)
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(new Solution().getSum(sc.nextInt(), sc.nextInt()));
    }
}`,
    python: `class Solution:
    def getSum(self, a: int, b: int) -> int:
        # Write your solution here (without + or -)
        pass
if __name__ == "__main__":
    a, b = map(int, input().split())
    print(Solution().getSum(a, b))`
  },
  testCases: [
    { input: '1 2', output: '3', isHidden: false },
    { input: '2 3', output: '5', isHidden: false },
    { input: '-1 1', output: '0', isHidden: true },
    { input: '100 200', output: '300', isHidden: true },
  ]
},

// ── DYNAMIC PROGRAMMING ──
{ title: 'House Robber',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int rob(vector<int>& nums) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    cout << Solution().rob(nums) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int rob(int[] nums) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        System.out.println(new Solution().rob(nums));
    }
}`,
    python: `from typing import List
class Solution:
    def rob(self, nums: List[int]) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    print(Solution().rob(nums))`
  },
  testCases: [
    { input: '4\n1 2 3 1', output: '4', isHidden: false },
    { input: '5\n2 7 9 3 1', output: '12', isHidden: false },
    { input: '3\n2 1 1', output: '3', isHidden: true },
    { input: '6\n1 2 3 4 5 6', output: '12', isHidden: true },
  ]
},

{ title: 'House Robber II',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int rob(vector<int>& nums) {
        // Write your solution here (circular arrangement)

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    cout << Solution().rob(nums) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int rob(int[] nums) {
        // Write your solution here (circular arrangement)
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        System.out.println(new Solution().rob(nums));
    }
}`,
    python: `from typing import List
class Solution:
    def rob(self, nums: List[int]) -> int:
        # Write your solution here (circular arrangement)
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    print(Solution().rob(nums))`
  },
  testCases: [
    { input: '3\n2 3 2', output: '3', isHidden: false },
    { input: '4\n1 2 3 1', output: '4', isHidden: false },
    { input: '3\n1 2 3', output: '3', isHidden: true },
    { input: '5\n5 1 1 5 3', output: '11', isHidden: true },
  ]
},

{ title: 'Unique Paths',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int uniquePaths(int m, int n) {
        // Write your solution here

    }
};
int main() {
    int m, n; cin >> m >> n;
    cout << Solution().uniquePaths(m, n) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int uniquePaths(int m, int n) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(new Solution().uniquePaths(sc.nextInt(), sc.nextInt()));
    }
}`,
    python: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    m, n = map(int, input().split())
    print(Solution().uniquePaths(m, n))`
  },
  testCases: [
    { input: '3 7', output: '28', isHidden: false },
    { input: '3 2', output: '3', isHidden: false },
    { input: '1 1', output: '1', isHidden: true },
    { input: '5 5', output: '70', isHidden: true },
  ]
},

{ title: 'Longest Increasing Subsequence',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    cout << Solution().lengthOfLIS(nums) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int lengthOfLIS(int[] nums) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        System.out.println(new Solution().lengthOfLIS(nums));
    }
}`,
    python: `from typing import List
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    print(Solution().lengthOfLIS(nums))`
  },
  testCases: [
    { input: '8\n10 9 2 5 3 7 101 18', output: '4', isHidden: false },
    { input: '6\n0 1 0 3 2 3', output: '4', isHidden: false },
    { input: '7\n7 7 7 7 7 7 7', output: '1', isHidden: true },
    { input: '5\n1 3 2 4 3', output: '3', isHidden: true },
  ]
},

{ title: 'Partition Equal Subset Sum',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool canPartition(vector<int>& nums) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    cout << (Solution().canPartition(nums) ? "true" : "false") << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public boolean canPartition(int[] nums) {
        // Write your solution here
        return false;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        System.out.println(new Solution().canPartition(nums));
    }
}`,
    python: `from typing import List
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    print(Solution().canPartition(nums))`
  },
  testCases: [
    { input: '4\n1 5 11 5', output: 'true', isHidden: false },
    { input: '4\n1 2 3 5', output: 'false', isHidden: false },
    { input: '3\n3 3 3', output: 'false', isHidden: true },
    { input: '4\n2 2 3 5', output: 'false', isHidden: true },
  ]
},

{ title: 'Longest Common Subsequence',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        // Write your solution here

    }
};
int main() {
    string t1, t2; cin >> t1 >> t2;
    cout << Solution().longestCommonSubsequence(t1, t2) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(new Solution().longestCommonSubsequence(sc.next(), sc.next()));
    }
}`,
    python: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    t1, t2 = input(), input()
    print(Solution().longestCommonSubsequence(t1, t2))`
  },
  testCases: [
    { input: 'abcde\nace', output: '3', isHidden: false },
    { input: 'abc\nabc', output: '3', isHidden: false },
    { input: 'abc\ndef', output: '0', isHidden: true },
    { input: 'ezupkr\nubmrapg', output: '2', isHidden: true },
  ]
},

{ title: 'Edit Distance',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int minDistance(string word1, string word2) {
        // Write your solution here

    }
};
int main() {
    string w1, w2; cin >> w1 >> w2;
    cout << Solution().minDistance(w1, w2) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int minDistance(String word1, String word2) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(new Solution().minDistance(sc.next(), sc.next()));
    }
}`,
    python: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    w1, w2 = input(), input()
    print(Solution().minDistance(w1, w2))`
  },
  testCases: [
    { input: 'horse\nros', output: '3', isHidden: false },
    { input: 'intention\nexecution', output: '5', isHidden: false },
    { input: 'abc\nabc', output: '0', isHidden: true },
    { input: 'abc\n', output: '3', isHidden: true },
  ]
},

{ title: '0/1 Knapsack Problem',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int knapSack(int W, vector<int>& wt, vector<int>& val) {
        // Write your solution here

    }
};
int main() {
    int n, W; cin >> n >> W;
    vector<int> wt(n), val(n);
    for(int& x : wt) cin >> x;
    for(int& x : val) cin >> x;
    cout << Solution().knapSack(W, wt, val) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int knapSack(int W, int[] wt, int[] val) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n=sc.nextInt(), W=sc.nextInt();
        int[] wt=new int[n], val=new int[n];
        for(int i=0;i<n;i++) wt[i]=sc.nextInt();
        for(int i=0;i<n;i++) val[i]=sc.nextInt();
        System.out.println(new Solution().knapSack(W,wt,val));
    }
}`,
    python: `from typing import List
class Solution:
    def knapSack(self, W: int, wt: List[int], val: List[int]) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n, W = map(int, input().split())
    wt = list(map(int, input().split()))
    val = list(map(int, input().split()))
    print(Solution().knapSack(W, wt, val))`
  },
  testCases: [
    { input: '4 7\n1 3 4 5\n1 4 5 7', output: '9', isHidden: false },
    { input: '3 5\n1 2 3\n6 10 12', output: '22', isHidden: false },
    { input: '2 3\n2 3\n3 4', output: '4', isHidden: true },
    { input: '1 10\n5\n100', output: '100', isHidden: true },
  ]
},

// ── GRAPHS ──
{ title: 'Flood Fill',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        // Write your solution here

    }
};
int main() {
    int m, n; cin >> m >> n;
    vector<vector<int>> img(m, vector<int>(n));
    for(auto& row : img) for(int& x : row) cin >> x;
    int sr, sc, col; cin >> sr >> sc >> col;
    auto r = Solution().floodFill(img, sr, sc, col);
    for(auto& row : r){ for(int i=0;i<n;i++) cout<<row[i]<<" \\n"[i==n-1]; }
}`,
    java: `import java.util.*;
class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        // Write your solution here
        return image;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner s=new Scanner(System.in);
        int m=s.nextInt(),n=s.nextInt();
        int[][] img=new int[m][n];
        for(int i=0;i<m;i++) for(int j=0;j<n;j++) img[i][j]=s.nextInt();
        int[][] r=new Solution().floodFill(img,s.nextInt(),s.nextInt(),s.nextInt());
        for(int[] row:r){StringBuilder sb=new StringBuilder();for(int i=0;i<n;i++){if(i>0)sb.append(" ");sb.append(row[i]);}System.out.println(sb);}
    }
}`,
    python: `from typing import List
class Solution:
    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
        # Write your solution here
        pass
if __name__ == "__main__":
    m, n = map(int, input().split())
    image = [list(map(int, input().split())) for _ in range(m)]
    sr, sc, col = map(int, input().split())
    r = Solution().floodFill(image, sr, sc, col)
    for row in r:
        print(' '.join(map(str, row)))`
  },
  testCases: [
    { input: '3 3\n1 1 1\n1 1 0\n1 0 1\n1 1 2', output: '2 2 2\n2 2 0\n2 0 1', isHidden: false },
    { input: '2 3\n0 0 0\n0 0 0\n0 0 0', output: '0 0 0\n0 0 0\n0 0 0', isHidden: false },
    { input: '1 1\n0\n0 0 1', output: '1', isHidden: true },
    { input: '3 3\n1 2 3\n4 1 4\n3 2 1\n1 1 5', output: '5 2 3\n4 5 4\n3 2 5', isHidden: true },
  ]
},

{ title: 'Find the Town Judge',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int findJudge(int n, vector<vector<int>>& trust) {
        // Write your solution here

    }
};
int main() {
    int n, t; cin >> n >> t;
    vector<vector<int>> trust(t, vector<int>(2));
    for(auto& e : trust) cin >> e[0] >> e[1];
    cout << Solution().findJudge(n, trust) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int findJudge(int n, int[][] trust) {
        // Write your solution here
        return -1;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt(),t=sc.nextInt();
        int[][] trust=new int[t][2];
        for(int i=0;i<t;i++){trust[i][0]=sc.nextInt();trust[i][1]=sc.nextInt();}
        System.out.println(new Solution().findJudge(n,trust));
    }
}`,
    python: `from typing import List
class Solution:
    def findJudge(self, n: int, trust: List[List[int]]) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n, t = map(int, input().split())
    trust = [list(map(int, input().split())) for _ in range(t)]
    print(Solution().findJudge(n, trust))`
  },
  testCases: [
    { input: '2 1\n1 2', output: '2', isHidden: false },
    { input: '3 2\n1 3\n2 3', output: '3', isHidden: false },
    { input: '3 3\n1 3\n2 3\n3 1', output: '-1', isHidden: true },
    { input: '1 0', output: '1', isHidden: true },
  ]
},

{ title: 'Rotting Oranges',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        // Write your solution here

    }
};
int main() {
    int m, n; cin >> m >> n;
    vector<vector<int>> grid(m, vector<int>(n));
    for(auto& row : grid) for(int& x : row) cin >> x;
    cout << Solution().orangesRotting(grid) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int orangesRotting(int[][] grid) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int m=sc.nextInt(),n=sc.nextInt();
        int[][] grid=new int[m][n];
        for(int i=0;i<m;i++) for(int j=0;j<n;j++) grid[i][j]=sc.nextInt();
        System.out.println(new Solution().orangesRotting(grid));
    }
}`,
    python: `from typing import List
class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    m, n = map(int, input().split())
    grid = [list(map(int, input().split())) for _ in range(m)]
    print(Solution().orangesRotting(grid))`
  },
  testCases: [
    { input: '3 3\n2 1 1\n1 1 0\n0 1 1', output: '4', isHidden: false },
    { input: '3 3\n2 1 1\n0 1 1\n1 0 1', output: '-1', isHidden: false },
    { input: '1 2\n0 2', output: '0', isHidden: true },
    { input: '2 2\n1 1\n1 1', output: '-1', isHidden: true },
  ]
},

// ── BACKTRACKING ──
{ title: 'Permutations',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    auto r = Solution().permute(nums);
    sort(r.begin(), r.end());
    for(auto& p : r){
        for(int i=0;i<(int)p.size();i++) cout<<p[i]<<" \\n"[i==(int)p.size()-1];
    }
}`,
    java: `import java.util.*;
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        int[] nums=new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        List<List<Integer>> r=new Solution().permute(nums);
        r.sort((a,b)->{for(int i=0;i<Math.min(a.size(),b.size());i++){int c=a.get(i).compareTo(b.get(i));if(c!=0)return c;}return 0;});
        for(List<Integer> p:r){StringBuilder sb=new StringBuilder();for(int i=0;i<p.size();i++){if(i>0)sb.append(" ");sb.append(p.get(i));}System.out.println(sb);}
    }
}`,
    python: `from typing import List
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    r = sorted(Solution().permute(nums))
    for p in r:
        print(' '.join(map(str, p)))`
  },
  testCases: [
    { input: '3\n1 2 3', output: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', isHidden: false },
    { input: '1\n1', output: '1', isHidden: false },
    { input: '2\n0 1', output: '0 1\n1 0', isHidden: true },
    { input: '2\n-1 2', output: '-1 2\n2 -1', isHidden: true },
  ]
},

{ title: 'Subsets',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    auto r = Solution().subsets(nums);
    sort(r.begin(), r.end());
    cout << r.size() << "\\n";
    for(auto& s : r){
        for(int i=0;i<(int)s.size();i++) cout<<s[i]<<(i<(int)s.size()-1?" ":"");
        cout<<"\\n";
    }
}`,
    java: `import java.util.*;
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        int[] nums=new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        List<List<Integer>> r=new Solution().subsets(nums);
        r.sort((a,b)->{int s=Integer.compare(a.size(),b.size());if(s!=0)return s;for(int i=0;i<Math.min(a.size(),b.size());i++){int c=a.get(i).compareTo(b.get(i));if(c!=0)return c;}return 0;});
        System.out.println(r.size());
        for(List<Integer> s:r){StringBuilder sb=new StringBuilder();for(int i=0;i<s.size();i++){if(i>0)sb.append(" ");sb.append(s.get(i));}System.out.println(sb);}
    }
}`,
    python: `from typing import List
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    r = sorted(Solution().subsets(nums), key=lambda x:(len(x),x))
    print(len(r))
    for s in r:
        print(' '.join(map(str, s)))`
  },
  testCases: [
    { input: '3\n1 2 3', output: '8\n\n1\n2\n3\n1 2\n1 3\n2 3\n1 2 3', isHidden: false },
    { input: '1\n0', output: '2\n\n0', isHidden: false },
    { input: '2\n1 2', output: '4\n\n1\n2\n1 2', isHidden: true },
    { input: '0\n', output: '1\n', isHidden: true },
  ]
},

{ title: 'Combination Sum',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> c(n);
    for(int& x : c) cin >> x;
    int t; cin >> t;
    auto r = Solution().combinationSum(c, t);
    sort(r.begin(), r.end());
    cout << r.size() << "\\n";
    for(auto& v : r){
        for(int i=0;i<(int)v.size();i++) cout<<v[i]<<(i<(int)v.size()-1?" ":"\\n");
    }
}`,
    java: `import java.util.*;
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        // Write your solution here
        return new ArrayList<>();
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        int[] c=new int[n];
        for(int i=0;i<n;i++) c[i]=sc.nextInt();
        List<List<Integer>> r=new Solution().combinationSum(c,sc.nextInt());
        r.sort((a,b)->{for(int i=0;i<Math.min(a.size(),b.size());i++){int x=a.get(i).compareTo(b.get(i));if(x!=0)return x;}return Integer.compare(a.size(),b.size());});
        System.out.println(r.size());
        for(List<Integer> v:r){StringBuilder sb=new StringBuilder();for(int i=0;i<v.size();i++){if(i>0)sb.append(" ");sb.append(v.get(i));}System.out.println(sb);}
    }
}`,
    python: `from typing import List
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    candidates = list(map(int, input().split()))
    target = int(input())
    r = sorted(Solution().combinationSum(candidates, target))
    print(len(r))
    for v in r:
        print(' '.join(map(str, v)))`
  },
  testCases: [
    { input: '4\n2 3 6 7\n7', output: '2\n2 2 3\n7', isHidden: false },
    { input: '2\n2 3\n6', output: '2\n2 2 2\n3 3', isHidden: false },
    { input: '1\n2\n1', output: '0\n', isHidden: true },
    { input: '3\n2 3 5\n8', output: '3\n2 2 2 2\n2 3 3\n3 5', isHidden: true },
  ]
},

// ── HEAP ──
{ title: 'Kth Largest Element in an Array',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    int k; cin >> k;
    cout << Solution().findKthLargest(nums, k) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        int[] nums=new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        System.out.println(new Solution().findKthLargest(nums,sc.nextInt()));
    }
}`,
    python: `from typing import List
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    k = int(input())
    print(Solution().findKthLargest(nums, k))`
  },
  testCases: [
    { input: '6\n3 2 1 5 6 4\n2', output: '5', isHidden: false },
    { input: '9\n3 2 3 1 2 4 5 5 6\n4', output: '4', isHidden: false },
    { input: '5\n1 2 3 4 5\n1', output: '5', isHidden: true },
    { input: '3\n7 6 5\n3', output: '5', isHidden: true },
  ]
},

{ title: 'Last Stone Weight',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int lastStoneWeight(vector<int>& stones) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> stones(n);
    for(int& x : stones) cin >> x;
    cout << Solution().lastStoneWeight(stones) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int lastStoneWeight(int[] stones) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        int[] s=new int[n];
        for(int i=0;i<n;i++) s[i]=sc.nextInt();
        System.out.println(new Solution().lastStoneWeight(s));
    }
}`,
    python: `from typing import List
class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    stones = list(map(int, input().split()))
    print(Solution().lastStoneWeight(stones))`
  },
  testCases: [
    { input: '6\n2 7 4 1 8 1', output: '1', isHidden: false },
    { input: '1\n1', output: '1', isHidden: false },
    { input: '2\n5 5', output: '0', isHidden: true },
    { input: '4\n3 3 3 3', output: '0', isHidden: true },
  ]
},

// ── MATH ──
{ title: 'Pow(x, n)',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    double myPow(double x, long long n) {
        // Write your solution here

    }
};
int main() {
    double x; long long n; cin >> x >> n;
    cout << fixed << setprecision(5) << Solution().myPow(x, n) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public double myPow(double x, int n) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        System.out.printf("%.5f%n",new Solution().myPow(sc.nextDouble(),sc.nextInt()));
    }
}`,
    python: `class Solution:
    def myPow(self, x: float, n: int) -> float:
        # Write your solution here
        pass
if __name__ == "__main__":
    x, n = input().split()
    print(f"{Solution().myPow(float(x), int(n)):.5f}")`
  },
  testCases: [
    { input: '2.00000 10', output: '1024.00000', isHidden: false },
    { input: '2.10000 3', output: '9.26100', isHidden: false },
    { input: '2.00000 -2', output: '0.25000', isHidden: true },
    { input: '1.00000 2147483647', output: '1.00000', isHidden: true },
  ]
},

{ title: 'Excel Sheet Column Number',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int titleToNumber(string columnTitle) {
        // Write your solution here

    }
};
int main() {
    string s; cin >> s;
    cout << Solution().titleToNumber(s) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int titleToNumber(String columnTitle) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        System.out.println(new Solution().titleToNumber(new Scanner(System.in).next()));
    }
}`,
    python: `class Solution:
    def titleToNumber(self, columnTitle: str) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    print(Solution().titleToNumber(input()))`
  },
  testCases: [
    { input: 'A', output: '1', isHidden: false },
    { input: 'AB', output: '28', isHidden: false },
    { input: 'ZY', output: '701', isHidden: true },
    { input: 'FXSHRXW', output: '2147483647', isHidden: true },
  ]
},

{ title: 'Happy Number',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool isHappy(int n) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    cout << (Solution().isHappy(n) ? "true" : "false") << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public boolean isHappy(int n) {
        // Write your solution here
        return false;
    }
}
class Main {
    public static void main(String[] args) {
        System.out.println(new Solution().isHappy(new Scanner(System.in).nextInt()));
    }
}`,
    python: `class Solution:
    def isHappy(self, n: int) -> bool:
        # Write your solution here
        pass
if __name__ == "__main__":
    print(Solution().isHappy(int(input())))`
  },
  testCases: [
    { input: '19', output: 'true', isHidden: false },
    { input: '2', output: 'false', isHidden: false },
    { input: '7', output: 'true', isHidden: true },
    { input: '4', output: 'false', isHidden: true },
  ]
},

{ title: '3Sum Closest',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int threeSumClosest(vector<int>& nums, int target) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int& x : nums) cin >> x;
    int t; cin >> t;
    cout << Solution().threeSumClosest(nums, t) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int threeSumClosest(int[] nums, int target) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        int[] nums=new int[n];
        for(int i=0;i<n;i++) nums[i]=sc.nextInt();
        System.out.println(new Solution().threeSumClosest(nums,sc.nextInt()));
    }
}`,
    python: `from typing import List
class Solution:
    def threeSumClosest(self, nums: List[int], target: int) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    t = int(input())
    print(Solution().threeSumClosest(nums, t))`
  },
  testCases: [
    { input: '4\n-1 2 1 -4\n1', output: '2', isHidden: false },
    { input: '3\n0 0 0\n1', output: '0', isHidden: false },
    { input: '5\n1 1 1 0 0\n100', output: '3', isHidden: true },
    { input: '4\n-3 -2 -5 3\n-1', output: '-2', isHidden: true },
  ]
},

{ title: 'Gas Station',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> gas(n), cost(n);
    for(int& x : gas) cin >> x;
    for(int& x : cost) cin >> x;
    cout << Solution().canCompleteCircuit(gas, cost) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        // Write your solution here
        return -1;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        int[] gas=new int[n],cost=new int[n];
        for(int i=0;i<n;i++) gas[i]=sc.nextInt();
        for(int i=0;i<n;i++) cost[i]=sc.nextInt();
        System.out.println(new Solution().canCompleteCircuit(gas,cost));
    }
}`,
    python: `from typing import List
class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    gas = list(map(int, input().split()))
    cost = list(map(int, input().split()))
    print(Solution().canCompleteCircuit(gas, cost))`
  },
  testCases: [
    { input: '5\n1 2 3 4 5\n3 4 5 1 2', output: '3', isHidden: false },
    { input: '3\n2 3 4\n3 4 3', output: '-1', isHidden: false },
    { input: '1\n5\n4', output: '0', isHidden: true },
    { input: '3\n1 2 3\n3 2 1', output: '2', isHidden: true },
  ]
},

{ title: 'Assign Cookies',
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int findContentChildren(vector<int>& g, vector<int>& s) {
        // Write your solution here

    }
};
int main() {
    int n; cin >> n;
    vector<int> g(n);
    for(int& x : g) cin >> x;
    int m; cin >> m;
    vector<int> s(m);
    for(int& x : s) cin >> x;
    cout << Solution().findContentChildren(g, s) << "\\n";
}`,
    java: `import java.util.*;
class Solution {
    public int findContentChildren(int[] g, int[] s) {
        // Write your solution here
        return 0;
    }
}
class Main {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        int[] g=new int[n];
        for(int i=0;i<n;i++) g[i]=sc.nextInt();
        int m=sc.nextInt();
        int[] s=new int[m];
        for(int i=0;i<m;i++) s[i]=sc.nextInt();
        System.out.println(new Solution().findContentChildren(g,s));
    }
}`,
    python: `from typing import List
class Solution:
    def findContentChildren(self, g: List[int], s: List[int]) -> int:
        # Write your solution here
        pass
if __name__ == "__main__":
    n = int(input())
    g = list(map(int, input().split()))
    m = int(input())
    s = list(map(int, input().split()))
    print(Solution().findContentChildren(g, s))`
  },
  testCases: [
    { input: '3\n1 2 3\n2\n1 1', output: '1', isHidden: false },
    { input: '2\n1 2\n3\n1 2 3', output: '2', isHidden: false },
    { input: '3\n3 2 1\n3\n3 2 1', output: '3', isHidden: true },
    { input: '2\n5 10\n2\n1 2', output: '0', isHidden: true },
  ]
},

// ── For remaining questions without test runners — add minimal starters ──
// These are tree/linked list problems — mark solved approach
...[
  'Permutation in String', 'Min Stack', 'Evaluate Reverse Polish Notation',
  'Merge Two Sorted Lists', 'Add Two Numbers', 'Remove Nth Node From End of List',
  'Middle of the Linked List', 'Palindrome Linked List',
  'Invert Binary Tree', 'Diameter of Binary Tree', 'Binary Tree Right Side View',
  'Kth Smallest Element in a BST', 'Construct Binary Tree from Preorder and Inorder',
  'Path Sum', 'Sum Root to Leaf Numbers', 'Balanced Binary Tree',
  'Symmetric Tree', 'Flatten Binary Tree to Linked List',
  'Pacific Atlantic Water Flow', 'Redundant Connection', 'Network Delay Time',
  'Letter Combinations of a Phone Number', 'N-Queens', 'Task Scheduler',
  'String to Integer (atoi)', 'Reverse Bits', 'Counting Subsequences',
  'LRU Cache', 'Design HashMap',
].map(title => ({ title, _skipIfExists: true }))
].filter(u => !u._skipIfExists || true);

async function updateStarterCode() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    let updated = 0, skipped = 0, notFound = 0;

    for (const upd of updates) {
      if (!upd.starterCode && !upd.testCases) { skipped++; continue; }
      const result = await Question.updateOne(
        { title: upd.title },
        { $set: { ...(upd.starterCode && { starterCode: upd.starterCode }), ...(upd.testCases && { testCases: upd.testCases }) } }
      );
      if (result.matchedCount === 0) { console.log(`  NOT FOUND: ${upd.title}`); notFound++; }
      else { updated++; process.stdout.write(`\r  Updated ${updated}...`); }
    }

    console.log(`\n\nDone! Updated: ${updated}, Skipped: ${skipped}, Not found: ${notFound}`);
  } catch (err) {
    console.error('Failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

updateStarterCode();
