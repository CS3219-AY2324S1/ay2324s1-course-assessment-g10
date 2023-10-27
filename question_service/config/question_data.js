const questions = [
    {
      title: 'Reverse a string',
      description: `
      Write a function that reverses a string. The input string is given as an array
      of characters s.
      You must do this by modifying the input array in-place with O(1) extra
      memory.
      Example 1:
      Input: s = ["h","e","l","l","o"]
      Output: ["o","l","l","e","h"]
      Example 2:
      Input: s = ["H","a","n","n","a","h"]
      Output: ["h","a","n","n","a","H"]
      Constraints:
      - 1 <= s.length <= 105
      - s[i] is a printable ascii character.
      `,
      topics: ['String', 'Algorithms'],
      difficulty: 1.0,
    },
    {
        title: 'Linked List Cycle Detection',
        description: `
        Given head, the head of a linked list, determine if the linked list has a cycle
        in it.
        There is a cycle in a linked list if there is some node in the list that can be
        reached again by continuously following the next pointer. Internally, pos is
        used to denote the index of the node that tail's next pointer is connected to.
        Note that pos is not passed as a parameter.
        Return true if there is a cycle in the linked list. Otherwise, return false.
        
        ![Example 1](../images/ll_cycle_1.png)
        
        Input: head = [3,2,0,-4], pos = 1
        Output: true
        Explanation: There is a cycle in the linked list, where the tail connects to the
        1st node (0-indexed).

        ![Example 2](../images/ll_cycle_2.png)

        Input: head = [1,2], pos = 0
        Output: true
        Explanation: There is a cycle in the linked list, where the tail connects to the
        0th node.
        Example 3:
        Input: head = [1], pos = -1
        Output: false
        Explanation: There is no cycle in the linked list.
        Constraints:
         The number of the nodes in the list is in the range [0, 104].
         -105 <= Node.val <= 105
         pos is -1 or a valid index in the linked-list.
        Follow up: Can you solve it using O(1) (i.e. constant) memory?
        `,
        topics: ['Data Structures', 'Algorithms'],
        difficulty: 1.1,
      },
      {
        title: 'Roman to Integer',
        description: `
        Roman numerals are represented by seven different symbols: I, V, X, L, C, D
        and M.
        Symbol Value
        I 1
        V 5
        X 10
        L 50
        C 100
        D 500
        M 1000
        For example, 2 is written as II in Roman numeral, just two ones added
        together. 12 is written as XII, which is simply X + II. The number 27 is written
        as XXVII, which is XX + V + II.
        Roman numerals are usually written largest to smallest from left to right.
        However, the numeral for four is not IIII. Instead, the number four is written
        as IV. Because the one is before the five we subtract it making four. The
        same principle applies to the number nine, which is written as IX. There are
        six instances where subtraction is used:
        I can be placed before V (5) and X (10) to make 4 and 9.
        X can be placed before L (50) and C (100) to make 40 and 90.
        C can be placed before D (500) and M (1000) to make 400 and 900.
        Given a roman numeral, convert it to an integer.
        Example 1:
        Input: s = "III"
        Output: 3
        Explanation: III = 3.
        Example 2:
        Input: s = "LVIII"
        Output: 58
        Explanation: L = 50, V= 5, III = 3.
        Example 3:
        Input: s = "MCMXCIV"
        Output: 1994
        Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.
        Constraints:
         1 <= s.length <= 15
         s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').
         It is guaranteed that s is a valid roman numeral in the range [1,
        3999].
        `,
        topics: ['Algorithms'],
        difficulty: 2.1,
      },
      {
        title: 'Add Binary',
        description: `
        Given two binary strings a and b, return their sum as a binary string.
        Example 1:
        Input: a = "11", b = "1"
        Output: "100"
        Example 2:
        Input: a = "1010", b = "1011"
        Output: "10101"
        Constraints:
         1 <= a.length, b.length <= 104
         a and b consist only of '0' or '1' characters.
         Each string does not contain leading zeros except for the zero itself.
        5 The Fibonacci numbers, commonly denoted F(n) form a sequence, called the
        Fibonacci sequence, such that each number is the sum of the two preceding
        ones, starting from 0 and 1. That is,
        F(0) = 0, F(1) = 1
        F(n) = F(n - 1) + F(n - 2), for n > 1.
        Given n, calculate F(n).
        Example 1:
        Input: n = 2
        Output: 1
        Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.
        Example 2:
        Input: n = 3
        Output: 2
        Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2.
        Example 3:
        Input: n = 4
        Output: 3
        Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.
        Constraints:
         0 <= n <= 30
        `,
        topics: ['Bit Manipulation', 'Algorithms'],
        difficulty: 1.4,
      },
      {
        title: 'Fibonacci Number',
        description: `
        The Fibonacci numbers, commonly denoted F(n) form a sequence, called the
        Fibonacci sequence, such that each number is the sum of the two preceding
        ones, starting from 0 and 1. That is,
        F(0) = 0, F(1) = 1
        F(n) = F(n - 1) + F(n - 2), for n > 1.
        Given n, calculate F(n).
        Example 1:
        Input: n = 2
        Output: 1
        Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.
        Example 2:
        Input: n = 3
        Output: 2
        Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2.
        Example 3:
        Input: n = 4
        Output: 3
        Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.
        Constraints:
         0 <= n <= 30
        `,
        topics: ['Recursion', 'Algorithms'],
        difficulty: 1.8,
      },
      {
        title: 'Repeated DNA Sequences',
        description: `
        The DNA sequence is composed of a series of nucleotides abbreviated as 'A',
        'C', 'G', and 'T'.
        For example, "ACGAATTCCG" is a DNA sequence.
        When studying DNA, it is useful to identify repeated sequences within the
        DNA.
        Given a string s that represents a DNA sequence, return all the 10-letter-
        long sequences (substrings) that occur more than once in a DNA molecule.
        You may return the answer in any order.
        Example 1:
        Input: s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"
        Output: ["AAAAACCCCC","CCCCCAAAAA"]
        Example 2:
        Input: s = "AAAAAAAAAAAAA"
        Output: ["AAAAAAAAAA"]
        Constraints:
         1 <= s.length <= 105
         s[i] is either 'A', 'C', 'G', or 'T'.
        `,
        topics: ['Bit Manipulation', 'Algorithms'],
        difficulty: 3.7,
      },
      {
        title: 'Course Schedule',
        description: `
        There are a total of numCourses courses you have to take, labeled from 0 to
        numCourses - 1. You are given an array prerequisites where prerequisites[i]
        = [ai, bi] indicates that you must take course bi first if you want to take
        course ai.
        For example, the pair [0, 1], indicates that to take course 0 you have to first
        take course 1.
        Return true if you can finish all courses. Otherwise, return false.
        Example 1:
        Input: numCourses = 2, prerequisites = [[1,0]]
        Output: true
        Explanation: There are a total of 2 courses to take.
        To take course 1 you should have finished course 0. So it is possible.
        Example 2:
        Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
        Output: false
        Explanation: There are a total of 2 courses to take.
        To take course 1 you should have finished course 0, and to take course 0
        you should also have finished course 1. So it is impossible.
        Constraints:
         1 <= numCourses <= 2000
         0 <= prerequisites.length <= 5000
         prerequisites[i].length == 2
         0 <= ai, bi < numCourses
         All the pairs prerequisites[i] are unique.
        `,
        topics: ['Data Structures', 'Algorithms'],
        difficulty: 4.5,
      },
      {
        title: 'Sliding Window Maximum',
        description: `
        You are given an array of integers nums, there is a sliding window of size k
        which is moving from the very left of the array to the very right. You can
        only see the k numbers in the window. Each time the sliding window moves
        right by one position.
        Return the max sliding window.
        Example 1:
        Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
        Output: [3,3,5,5,6,7]
        Explanation:
        Window position Max
        --------------- -----
        [1 3 -1] -3 5 3 6 7 3
        1 [3 -1 -3] 5 3 6 7 3
        1 3 [-1 -3 5] 3 6 7 5
        1 3 -1 [-3 5 3] 6 7 5
        1 3 -1 -3 [5 3 6] 7 6
        1 3 -1 -3 5 [3 6 7] 7
        Example 2:
        Input: nums = [1], k = 1
        Output: [1]
        Constraints:
         1 <= nums.length <= 105
         -104 <= nums[i] <= 104
         1 <= k <= nums.length
        `,
        topics: ['Arrays', 'Algorithms'],
        difficulty: 7.9,
      },
      {
        title: 'N-Queen Problem',
        description: `
        The n-queens puzzle is the problem of placing n queens on an n x n
        chessboard such that no two queens attack each other.
        Given an integer n, return all distinct solutions to the n-queens puzzle. You
        may return the answer in any order.
        Each solution contains a distinct board configuration of the n-queens'
        placement, where 'Q' and '.' both indicate a queen and an empty space,
        respectively.

        ![Example Image 1](../images/N_Queens.png)

        Input: n = 4
        Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
        Explanation: There exist two distinct solutions to the 4-queens puzzle as
        shown above
        Example 2:
        Input: n = 1
        Output: [["Q"]]
        Constraints:
         1 <= n <= 9
        `,
        topics: ['Algorithms'],
        difficulty: 9,
      },
  ];
  
  module.exports = questions;