/**
 * 30-Day Problem-Solving Mastery Curriculum Data (S-Tier Revision)
 * This optimized curriculum introduces foundational data structures (Stacks & Queues)
 * and abstract problem-solving patterns at logically crucial points. The capstone
 * project has been re-aligned to directly synthesize advanced graph algorithms,
 * ensuring a more cohesive and rigorous learning trajectory.
 *
 * Core Resources: Think Python, How to Solve It, Grokking Algorithms
 */
export function initialCurriculum() {
  const days = [
    // WEEK 1: Foundations - Pólya's Method + Python Basics (Days 1-7 Unchanged)
    {
      day: 1,
      title: "Pólya's Problem-Solving Framework",
      readings: [
        "How to Solve It (PDF): Preface, Introduction & Part I - Understanding the Problem (pp. ix-25)",
        "Supplemental Reading: Skim Part IV - Looking Back (pp. 236-250) to understand the full cycle."
      ],
      theory: `PÓLYA'S 4-STEP METHOD:\n1. UNDERSTAND THE PROBLEM\n2. DEVISE A PLAN\n3. CARRY OUT THE PLAN\n4. LOOK BACK`,
      exercises: [`EXERCISE 1: Understand the Problem\nProblem: "A rectangular garden is 3 times as long as it is wide. If the perimeter is 80 meters, find the dimensions."`, `EXERCISE 2: Devise a Plan\nFor the garden problem: Plan: Solve for w, then find l.`, `EXERCISE 3: Create Your Problem-Solving Journal`],
      deliverable: "Problem-solving journal with 3 problems solved using Pólya's method",
      objective: "Internalize Pólya's 4-step framework for approaching any problem"
    },
    {
      day: 2,
      title: "Python Fundamentals - Values & Types",
      readings: [
        "Think Python (PDF): Ch. 1 - The Way of the Program (pp. 1-8)",
        "Think Python (PDF): Ch. 2 - Variables, Expressions and Statements (pp. 9-18)"
      ],
      theory: `VALUES AND TYPES (Think Python Ch. 1-2):\n- Value: Basic unit of data\n- Type: Category of value\n- Variable: Name that refers to a value`,
      exercises: [`EXERCISE 1: Type Exploration`, `EXERCISE 2: Apply Pólya to a Coding Problem: "Calculate the area of a circle given radius r"`, `EXERCISE 3: Build Your Own: Convert hours to seconds, calculate compound interest, convert Celsius to Fahrenheit`],
      deliverable: "Python file with 5 functions: circle_area, hours_to_seconds, compound_interest, celsius_to_fahrenheit, and one problem of your choice",
      objective: "Master Python basics and apply Pólya's method to write simple functions"
    },
    {
      day: 3,
      title: "Functions - Decomposition Strategy",
      readings: [
        "Think Python (PDF): Ch. 3 - Functions (pp. 19-28)",
        "How to Solve It (PDF): Part II - Devising a Plan - Decomposing and Recombining (pp. 65-75)"
      ],
      theory: `FUNCTIONS (Think Python Ch. 3):\n- Function definition & call\n- Parameters and arguments\n- Return values\nDECOMPOSITION (How to Solve It):\nBreak complex problems into simpler sub-problems.`,
      exercises: [`EXERCISE 1: Basic Functions`, `EXERCISE 2: Decomposition Practice: "Check if a year is a leap year"`, `EXERCISE 3: Build Through Decomposition: Calculate distance between two points`],
      deliverable: "Python file with decomposed functions for leap year, distance, triangle area, cylinder volume, and BMI",
      objective: "Master function creation and problem decomposition as a core strategy"
    },
    {
      day: 4,
      title: "Conditionals & Boolean Logic",
      readings: [
        "Think Python (PDF): Ch. 5 - Conditionals and Recursion (pp. 43-50, skip recursion)",
        "Think Python (PDF): Ch. 6 - Fruitful Functions (pp. 51-60)"
      ],
      theory: `CONDITIONALS (Think Python Ch. 5):\nif/elif/else\nBOOLEAN EXPRESSIONS:\n==, !=, >, <, and, or, not\nFRUITFUL FUNCTIONS (Ch. 6): Functions that return values.`,
      exercises: [`EXERCISE 1: Conditional Logic Practice: absolute_value, sign, max_of_two`, `EXERCISE 2: Grade Calculator`, `EXERCISE 3: Complex Conditionals: can_vote, is_triangle`],
      deliverable: "Python file with all conditional exercises: absolute_value, sign, max functions, grade_letter, can_vote, is_triangle, is_between",
      objective: "Master conditional logic and boolean expressions for decision-making"
    },
    {
      day: 5,
      title: "Iteration - The Power of Loops",
      readings: [
        "Think Python (PDF): Ch. 7 - Iteration (pp. 61-70)",
        "How to Solve It (PDF): Working Backwards & Auxiliary Problems (pp. 202-213, 214-220)"
      ],
      theory: `ITERATION (Think Python Ch. 7):\n- while loop\n- for loop\nLOOP PATTERNS:\n- Counter, Accumulator, Sentinel\nWORKING BACKWARDS (Pólya): Start from desired result, work back to what you know.`,
      exercises: [`EXERCISE 1: Basic Iteration Patterns: countdown, sum_first_n`, `EXERCISE 2: Apply Pólya with Loops: factorial`, `EXERCISE 3: Advanced Loop Problems: is_prime, digit_sum`],
      deliverable: "Python file with iteration exercises: countdown, sum_first_n, factorial, power, is_prime, digit_sum, count_digits",
      objective: "Master iteration patterns and apply working-backwards strategy"
    },
    {
      day: 6,
      title: "Strings - Text as Data",
      readings: ["Think Python (PDF): Ch. 8 - Strings (pp. 71-82)"],
      theory: `STRINGS (Think Python Ch. 8):\n- Sequence of characters\n- Indexing, Slicing, Traversal\n- Immutable\nSTRING OPERATIONS: in, .upper(), .find(), .count()`,
      exercises: [`EXERCISE 1: String Traversal: count_vowels, reverse_string`, `EXERCISE 2: String Analysis with Pólya: is_palindrome, is_anagram`, `EXERCISE 3: String Building: remove_vowels, acronym`],
      deliverable: "Python file with string functions: count_vowels, reverse_string, is_palindrome, is_anagram, remove_vowels, acronym, word_count",
      objective: "Master string manipulation and traversal techniques"
    },
    {
      day: 7,
      title: "Week 1 Integration Project",
      readings: [
        "How to Solve It (PDF): Part III - Carrying Out the Plan (pp. 221-235)",
        "Review all Week 1 chapters from Think Python"
      ],
      theory: `CARRYING OUT THE PLAN (Pólya Part III):\n- Check each step of your reasoning.\n- Can you see clearly that each step is correct?\nPROJECT APPROACH:\n1. Decompose\n2. Test\n3. Combine\n4. Review`,
      exercises: [`PROJECT: Text Analysis Tool\nPART 1: Basic Statistics\nPART 2: Content Analysis\nPART 3: Transformations\nPART 4: Validation\nPART 5: Main Program`],
      deliverable: "Complete text analysis tool with all 5 parts, tested and working. Journal entry documenting your problem-solving process.",
      objective: "Integrate Week 1 skills (functions, conditionals, loops, strings) into a cohesive project"
    },
    // WEEK 2: Data Structures & OOP (Days 8-14 Unchanged)
    {
      day: 8,
      title: "Introduction to Recursion",
      readings: [
        "Think Python (PDF): Ch. 5 - Recursion section (pp. 47-50)",
        "Think Python (PDF): Ch. 6 - Recursion examples (pp. 55-58)"
      ],
      theory: `RECURSION:\nA recursive function calls itself. Must have:\n1. BASE CASE: Simplest version, returns immediately.\n2. RECURSIVE CASE: Breaks problem into smaller sub-problem.`,
      exercises: [`EXERCISE 1: Trace Recursive Execution: factorial(4), power(base, exp)`, `EXERCISE 2: Apply Pólya to Recursive Problems: sum_to_n, sum_digits_recursive`, `EXERCISE 3: Iteration vs Recursion: Fibonacci and GCD`],
      deliverable: "Python file with recursive implementations: countdown, factorial, power, sum_to_n, sum_digits, fibonacci (both), gcd (both).",
      objective: "Understand recursion fundamentals and recognize when to use recursion vs iteration"
    },
    {
      day: 9,
      title: "Lists & List Processing",
      readings: ["Think Python (PDF): Ch. 10 - Lists (pp. 93-106)"],
      theory: `LISTS (Think Python Ch. 10):\n- Mutable sequence of values.\nOPERATIONS: Indexing, Slicing, .append(), .pop(), len(), sum()`,
      exercises: [`EXERCISE 1: List Operations Practice`, `EXERCISE 2: List Processing with Pólya: double_list, filter_positive`, `EXERCISE 3: Advanced List Operations: reverse_list, find_max, remove_duplicates`],
      deliverable: "Python file with list operations: double_list, filter_positive, squares, reverse_list, find_max, remove_duplicates",
      objective: "Master list manipulation and processing patterns"
    },
    {
      day: 10,
      title: "Dictionaries - Key-Value Power",
      readings: ["Think Python (PDF): Ch. 11 - Dictionaries (pp. 107-116)"],
      theory: `DICTIONARIES (Think Python Ch. 11):\n- Mapping from keys to values.\n- Keys must be immutable.\nOPERATIONS: Access, Add/Update, Delete, Check key existence`,
      exercises: [`EXERCISE 1: Dictionary Basics: create_gradebook`, `EXERCISE 2: Frequency Counting: word_frequency, letter_frequency`, `EXERCISE 3: Dictionary Applications: histogram, reverse_lookup`],
      deliverable: "Python file with dictionary programs: gradebook, word_frequency, letter_frequency, histogram, reverse_lookup, merge_dicts",
      objective: "Master dictionaries for counting, lookup, and mapping problems"
    },
    {
      day: 11,
      title: "Tuples & Data Structures",
      readings: ["Think Python (PDF): Ch. 12 - Tuples (pp. 117-126)"],
      theory: `TUPLES (Think Python Ch. 12):\n- Immutable sequence.\n- Often used for grouped data and returning multiple values.`,
      exercises: [`EXERCISE 1: Tuples and Unpacking: swap(a,b)`, `EXERCISE 2: DSU (Decorate-Sort-Undecorate): sort_by_length`, `EXERCISE 3: Advanced Tuple Applications: most_common_words`],
      deliverable: "Python file with tuple programs: swap, distance, sort_by_length, most_common_words, group_by_length, zip_lists",
      objective: "Master tuples for immutable data and sophisticated sorting patterns"
    },
    {
      day: 12,
      title: "Files & Persistence",
      readings: ["Think Python (PDF): Ch. 14 - Files (pp. 139-148)"],
      theory: `FILES (Think Python Ch. 14):\n- Persistent storage.\n- Reading ('r'), Writing ('w'), Appending ('a').\n- Using 'with open(...)' for automatic closing.`,
      exercises: [`EXERCISE 1: File Reading: count_lines, find_in_file`, `EXERCISE 2: File Writing with Pólya: log_activity`, `EXERCISE 3: Data Processing: word_frequency_from_file`],
      deliverable: "Python file with file operations: count_lines, log_activity, word_frequency_from_file, filter_long_words, csv_to_dict.",
      objective: "Master file I/O for data persistence and processing"
    },
    {
      day: 13,
      title: "Classes & Object-Oriented Thinking",
      readings: [
        "Think Python (PDF): Ch. 15 - Classes and Objects (pp. 149-156)",
        "Think Python (PDF): Ch. 16 - Classes and Functions (pp. 157-164)"
      ],
      theory: `CLASSES (Think Python Ch. 15-16):\n- Class: template for objects.\n- Object: instance of a class.\n- Attributes: data.\n- Methods: functions.`,
      exercises: [`EXERCISE 1: Create Your First Class: Rectangle, Circle`, `EXERCISE 2: Apply Pólya to OOP: BankAccount`, `EXERCISE 3: Real-World Classes: Student, TodoList`],
      deliverable: "Python file with classes: Point, Rectangle, Circle, BankAccount, Student, TodoList. Include test code demonstrating each class.",
      objective: "Understand object-oriented programming and class design"
    },
    {
      day: 14,
      title: "Week 2 Integration Project",
      readings: [
        "How to Solve It (PDF): Part IV - Looking Back (pp. 236-250)",
        "Review all Week 2 chapters from Think Python"
      ],
      theory: `LOOKING BACK (Pólya Part IV):\n- Can you check the result?\n- Can you derive the result differently?\n- Can you use the result or method for another problem?`,
      exercises: [`PROJECT: Personal Library Management System\nPART 1: Core Classes (Book, Library)\nPART 2: File Persistence (JSON)\nPART 3: Statistics & Analysis\nPART 4: Interactive Interface\nPART 5: Testing & Documentation`],
      deliverable: "Complete Library Management System with Book and Library classes, file persistence, statistics, interactive menu, and comprehensive testing.",
      objective: "Integrate Week 2 skills (recursion, data structures, files, classes) into a cohesive application"
    },
    // WEEK 3: Algorithms - Foundations, Search, Sort (Revised)
    {
      day: 15,
      title: "Stacks & Queues: The Building Blocks of Algorithms",
      readings: [
        "Core Reading: Review Python's 'collections.deque' documentation.",
        "Supplemental Reading: 'Stacks and Queues in Python' on a reputable tutorial site (e.g., Real Python, GeeksforGeeks) for conceptual understanding."
      ],
      theory: `STACK (LIFO - Last-In, First-Out):\n- Analogy: A stack of plates. You add (push) to the top and remove (pop) from the top.\n- Operations: push(), pop(), peek().\n- Use Case: Call stack, undo functionality, parsing expressions.\n\nQUEUE (FIFO - First-In, First-Out):\n- Analogy: A checkout line. First person in line is the first one out.\n- Operations: enqueue(), dequeue().\n- Python's 'collections.deque' is highly efficient for this.\n- Use Case: Task scheduling, breadth-first search.`,
      exercises: [
        `EXERCISE 1: Implement a Stack\n- Create a Stack class using a Python list.\n- Implement push, pop, and is_empty methods.`,
        `EXERCISE 2: Balanced Parentheses\n- Write a function that uses your Stack to check if a string of parentheses '()[]{}' is balanced. This is a classic stack problem.`,
        `EXERCISE 3: Implement a Queue\n- Create a Queue class using 'collections.deque'.\n- Implement enqueue, dequeue, and size methods.`,
        `EXERCISE 4: Printer Simulation\n- Use your Queue to simulate a print queue. Add jobs to the queue and process them in order.`
      ],
      deliverable: "Python file containing Stack and Queue class implementations and functions for the balanced parentheses and printer simulation problems.",
      objective: "Master LIFO and FIFO data structures as foundational tools for complex algorithms."
    },
    {
      day: 16,
      title: "Big O Notation & Algorithm Analysis",
      readings: [
        "Grokking Algorithms (PDF): Ch. 1 - Introduction to Algorithms (pp. 1-18)",
        "Supplemental Reading: 'A Gentle Introduction to Big O Notation' for a less graphical, more mathematical explanation."
      ],
      theory: `BIG O NOTATION:\nDescribes how an algorithm's runtime or space requirements grow with the input size 'n'.\n\nCOMMON RUNTIMES:\n- O(1) - Constant (e.g., hash table lookup, stack push/pop)\n- O(log n) - Logarithmic (e.g., binary search)\n- O(n) - Linear (e.g., simple search, iterating a list)\n- O(n log n) - Log-linear (e.g., efficient sorting)\n- O(n²) - Quadratic (e.g., selection sort, nested loops over a list)`,
      exercises: [`EXERCISE 1: Understand Big O Growth\n- Analyze the Big O of simple functions: get_first(lst), print_all(lst), print_pairs(lst).`, `EXERCISE 2: Apply Pólya to Algorithm Analysis\n- Analyze a naive 'contains_duplicate' function (O(n²)) and an improved version using a set (O(n)).`, `EXERCISE 3: Compare Algorithm Efficiency\n- Implement and time linear search vs. converting to a set for lookups.`],
      deliverable: "Python file analyzing Big O of various functions. Document with comments explaining the analysis. Include timing experiments.",
      objective: "Understand Big O notation and analyze algorithm efficiency"
    },
    {
      day: 17,
      title: "Binary Search - Logarithmic Power",
      readings: [
        "Grokking Algorithms (PDF): Ch. 1 - Binary Search (pp. 3-11)",
        "Supplemental Reading: Think Python's chapter on lists (Ch. 10) - does it have a search function? How does it compare?"
      ],
      theory: `BINARY SEARCH:\n- Works ONLY on sorted lists.\n- Eliminates half the remaining items at each step.\n- O(log n) time complexity.`,
      exercises: [`EXERCISE 1: Implement Binary Search`, `EXERCISE 2: Trace Binary Search on paper`, `EXERCISE 3: Binary Search Variations\n- Find first occurrence of a target in a list with duplicates.\n- Find the insertion point for a target in a sorted list.`],
      deliverable: "Python file with binary_search, traced examples, and two variations. Test each thoroughly.",
      objective: "Master binary search and understand logarithmic time complexity"
    },
    {
      day: 18,
      title: "Selection Sort - O(n²) Sorting",
      readings: [
        "Grokking Algorithms (PDF): Ch. 2 - Selection Sort (pp. 19-34)"
      ],
      theory: `SELECTION SORT:\n- Finds the smallest item and moves it to the front, repeating for the remainder of the list.\n- O(n²) time complexity. Inefficient for large lists but simple to understand.`,
      exercises: [`EXERCISE 1: Implement Selection Sort`, `EXERCISE 2: Implement In-Place Selection Sort (modifies the original array to save space)`, `EXERCISE 3: Selection Sort Analysis\n- Create a version that prints the state of the array after each pass.`],
      deliverable: "Python file with selection sort implementations, traced execution, and performance analysis documenting O(n²) behavior.",
      objective: "Understand selection sort and quadratic time complexity"
    },
    {
      day: 19,
      title: "Recursion Deep Dive & The Call Stack",
      readings: [
        "Grokking Algorithms (PDF): Ch. 3 - Recursion (pp. 35-48)",
        "Supplemental Reading: Re-read Day 15's theory on Stacks. The call stack is a direct application of this data structure."
      ],
      theory: `THE CALL STACK:\n- Recursion is managed by the call stack (a LIFO structure!).\n- Each recursive call adds a 'frame' to the stack.\n- The stack unwinds as base cases are hit and functions return.`,
      exercises: [`EXERCISE 1: Visualize Call Stack\n- Create a recursive countdown function that prints when it's called and when it returns to visualize the stack's operation.`, `EXERCISE 2: Apply Pólya to Recursive Problems\n- Recursively count items in a list.`, `EXERCISE 3: Recursive Problem Set\n- Implement recursive reverse_string and recursive is_palindrome.`],
      deliverable: "Python file with recursive functions: countdown with stack visualization, count, reverse_string, is_palindrome. Include call stack diagrams in comments.",
      objective: "Master recursion and understand the call stack deeply"
    },
    {
      day: 20,
      title: "Quicksort - Divide and Conquer",
      readings: [
        "Grokking Algorithms (PDF): Ch. 4 - Quicksort (pp. 49-64)",
        "Supplemental Reading: Compare the recursive nature of Quicksort to the recursive functions from the previous day. How is the divide-and-conquer strategy different?"
      ],
      theory: `QUICKSORT:\nA divide-and-conquer algorithm.\n1. Pick a pivot.\n2. Partition the array into elements smaller and larger than the pivot.\n3. Recursively sort the two partitions.\n- Average Time: O(n log n)\n- Worst Case: O(n²)`,
      exercises: [`EXERCISE 1: Implement Quicksort`, `EXERCISE 2: Trace Quicksort Execution on paper`, `EXERCISE 3: Quicksort Analysis\n- Create a traced version to visualize the recursive calls. Compare its performance to selection sort.`],
      deliverable: "Python file with quicksort implementation, traced execution, and comparison with selection sort. Document Big O analysis.",
      objective: "Master quicksort and understand the divide-and-conquer strategy"
    },
    {
      day: 21,
      title: "Week 3 Integration Project",
      readings: [
        "Grokking Algorithms (PDF): Ch. 5 - Hash Tables (pp. 65-82)",
        "Review Grokking Algorithms Ch. 1-4"
      ],
      theory: `HASH TABLES:\n- The data structure behind Python's dictionaries.\n- Provides average O(1) time for insert, lookup, and delete.\n- Uses a hash function to map keys to array indices.\nUSE CASES:\n- Lookups (e.g., phone books)\n- Caching/Memoization\n- Preventing duplicates (using sets)`,
      exercises: [`PROJECT: Spell Checker & Autocomplete System\nPART 1: Dictionary Management (use a Set for O(1) lookups)\nPART 2: Spell Checking\nPART 3: Suggestion Engine (find words with small edit distance)\nPART 4: Autocomplete\nPART 5: Performance Analysis (compare Set vs List for lookups)`],
      deliverable: "Complete spell checker system with dictionary management, spell checking, suggestions, autocomplete, and performance benchmarks.",
      objective: "Integrate Week 3 concepts (Big O, search, sort, recursion, hash tables) into a sophisticated application"
    },
    // WEEK 4: Advanced Algorithms & Problem-Solving Mastery (Revised)
    {
      day: 22,
      title: "Breadth-First Search - Graph Traversal",
      readings: [
        "Grokking Algorithms (PDF): Ch. 6 - Breadth-First Search (pp. 83-104)",
        "Supplemental Reading: Re-read Day 15's theory on Queues. BFS is the canonical application of the queue data structure."
      ],
      theory: `GRAPHS:\n- A set of nodes (vertices) and connections (edges).\n- Can be represented by a hash table: {node: [neighbors]}.\n\nBREADTH-FIRST SEARCH (BFS):\n- Traverses a graph level by level.\n- Finds the SHORTEST path in an UNWEIGHTED graph.\n- Uses a Queue (FIFO) to manage which node to visit next.`,
      exercises: [`EXERCISE 1: Implement Graph and BFS\n- Represent a social network as a graph. Implement BFS to check if a path exists between two people.`, `EXERCISE 2: Find Shortest Path\n- Modify your BFS to return the actual path (a list of nodes).`, `EXERCISE 3: BFS Applications\n- Calculate 'degrees of separation' between two nodes.`],
      deliverable: "Python file with BFS implementation, shortest path finder, and degrees of separation calculator. Create a sample graph to test.",
      objective: "Master BFS for graph traversal and shortest path problems"
    },
    {
      day: 23,
      title: "Dijkstra's Algorithm - Weighted Graphs",
      readings: [
        "Grokking Algorithms (PDF): Ch. 7 - Dijkstra's Algorithm (pp. 105-126)"
      ],
      theory: `DIJKSTRA'S ALGORITHM:\n- Finds the LOWEST-COST path in a WEIGHTED, DIRECTED, ACYCLIC graph.\n- Cannot handle negative weights.\n- Key Idea: Greedily process the "cheapest" node you haven't processed yet and update the costs of its neighbors.`,
      exercises: [`EXERCISE 1: Implement Dijkstra's Algorithm`, `EXERCISE 2: Apply Dijkstra to Route Planning\n- Model a simple map with travel times as weights. Find the fastest route.`, `EXERCISE 3: Reconstruct the Path\n- Modify your implementation to not only find the lowest cost, but also store the parent of each node to reconstruct the path itself.`],
      deliverable: "Python file with a complete Dijkstra's implementation, including path reconstruction, applied to a route-planning problem.",
      objective: "Master Dijkstra's algorithm for finding the lowest-cost path in weighted graphs"
    },
    {
      day: 24,
      title: "Greedy Algorithms",
      readings: [
        "Grokking Algorithms (PDF): Ch. 8 - Greedy Algorithms (pp. 127-142)",
        "Supplemental Reading: 'Introduction to Greedy Algorithms' on a site like TopCoder or Codeforces for more examples."
      ],
      theory: `GREEDY ALGORITHMS:\n- At each step, make the locally optimal choice.\n- Doesn't always find the globally optimal solution, but is often a good approximation and simple to implement.\n- Examples: Dijkstra's is a greedy algorithm.`,
      exercises: [`EXERCISE 1: The Set-Covering Problem\n- Implement a greedy algorithm to find the smallest combination of radio stations to cover a set of states.`, `EXERCISE 2: The Change-Making Problem\n- Write a greedy function to make change using the fewest number of coins (quarters, dimes, etc.). Discuss when this greedy approach fails (e.g., with an unusual set of coin denominations).`],
      deliverable: "Python implementations of greedy solutions for the set-covering and change-making problems, with comments analyzing their effectiveness.",
      objective: "Understand the greedy approach and recognize when it is an appropriate heuristic"
    },
    {
      day: 25,
      title: "Dynamic Programming - Part 1",
      readings: [
        "Grokking Algorithms (PDF): Ch. 9 - Dynamic Programming (pp. 143-162)",
        "Supplemental Reading: Watch a video explanation of the knapsack problem. Visualizing the DP table is crucial."
      ],
      theory: `DYNAMIC PROGRAMMING (DP):\n- A method for solving complex problems by breaking them down into simpler, overlapping subproblems.\n- Key Idea: Solve each subproblem only once and store its result in a table (memoization) to avoid re-computation.\n- Bottom-up vs. Top-down (memoization) approaches.`,
      exercises: [`EXERCISE 1: The Knapsack Problem\n- Understand the classic 0/1 knapsack problem.`, `EXERCISE 2: Longest Common Subsequence\n- Implement a DP solution to find the longest common subsequence between two strings. Start by drawing the grid on paper to understand the subproblems.`],
      deliverable: "A Python implementation of the longest common subsequence problem using a DP grid. Include a detailed explanation of the logic in your comments.",
      objective: "Grasp the core concept of dynamic programming: solving and storing overlapping subproblems"
    },
    {
      day: 26,
      title: "Dynamic Programming - Part 2",
      readings: [
        "Review Grokking Algorithms Ch. 9",
        "Supplemental Reading: 'From recursion to dynamic programming' article to see the direct link between a naive recursive solution and a memoized/DP one."
      ],
      theory: `RECOGNIZING DP PROBLEMS:\n- Does the problem have optimal substructure? (Optimal solution can be constructed from optimal solutions of subproblems).\n- Does the problem have overlapping subproblems? (The same subproblem is solved multiple times).\n- The grid is your best friend for visualization.`,
      exercises: [`EXERCISE 1: Longest Common Substring\n- How is this different from subsequence? Implement a DP solution.`, `EXERCISE 2: Fibonacci with DP\n- Re-implement the Fibonacci sequence using a bottom-up DP approach (a simple array/table). Compare its O(n) performance to the naive recursive O(2^n) solution.`],
      deliverable: "Python file with DP solutions for longest common substring and Fibonacci, with performance comparisons.",
      objective: "Solidify DP skills and learn to identify problems suitable for a DP solution"
    },
    {
      day: 27,
      title: "Algorithmic Problem-Solving Patterns",
      readings: [
        "Core Reading: Search for articles on 'Two Pointers Algorithm' and 'Sliding Window Algorithm'.",
        "Supplemental Reading: Explore other patterns like 'Backtracking' and 'Fast & Slow Pointers'."
      ],
      theory: `PATTERNS BEYOND NAMED ALGORITHMS:\n- These are reusable templates for solving classes of problems.\n\nTWO POINTERS:\n- Used on sorted arrays. Two pointers start at opposite ends and move towards each other.\n- Use Case: Finding a pair that sums to a target.\n\nSLIDING WINDOW:\n- Used on linear data structures (arrays, strings).\n- A "window" of a certain size slides over the data.\n- Use Case: Finding the max/min sum of a subarray of a fixed size.`,
      exercises: [
        `EXERCISE 1: Two Pointers\n- Given a sorted array, write an O(n) function to find if there exists a pair of elements that sum up to a given target.`,
        `EXERCISE 2: Sliding Window\n- Given an array of integers and a number k, find the maximum sum of a subarray of size k. Solve it in O(n) time.`,
        `EXERCISE 3: Pattern Recognition\n- Look back at previous problems. Could any of them have been solved with these patterns?`
      ],
      deliverable: "Python file with efficient O(n) solutions for the Two Pointers and Sliding Window exercises.",
      objective: "Learn to recognize and apply common algorithmic patterns to solve novel problems."
    },
    {
      day: 28,
      title: "Week 4 Integration Project: GPS Route Planner",
      readings: ["Review Grokking Algorithms Ch. 6, 7, 8"],
      theory: `SYNTHESIS OF GRAPH ALGORITHMS:\nReal-world problems rarely have one 'correct' algorithm. The goal is to choose the right tool for the job based on the constraints and the question being asked.\n- Need the ABSOLUTE FASTEST route? Dijkstra's.\n- Need the route with FEWEST STOPS? BFS.\n- Need a 'good enough' route that visits many cities? Greedy algorithm.`,
      exercises: [
        `PROJECT: GPS Route Planner\nPART 1: Graph Modeling\n- Design OOP classes: 'City' and 'Route'.\n- Create a 'Map' class to hold the graph data.\n- Represent a map of cities as a weighted, directed graph. {city: {neighbor: travel_time}}`,
        `PART 2: Finding the Fastest Route\n- Implement a method in your 'Map' class 'fastest_route(start_city, end_city)' that uses Dijkstra's algorithm to find the path with the minimum total travel time.`,
        `PART 3: Finding the Route with Fewest Stops\n- Implement 'route_with_fewest_stops(start_city, end_city)' that uses BFS. Notice how this ignores the edge weights.`
      ],
      deliverable: "Python files for the GPS Route Planner project, Parts 1-3. Include a sample map to test your pathfinding methods.",
      objective: "Synthesize graph algorithms to build a multi-faceted route planning application, demonstrating mastery of algorithmic trade-offs."
    },
    {
      day: 29,
      title: "Final Project Continued & Next Steps",
      readings: [
        "Grokking Algorithms (PDF): Ch. 11 - Where to Go From Here (pp. 187-196)",
        "Supplemental Reading: Browse the problem sets on LeetCode or HackerRank to see how these concepts are tested in interviews."
      ],
      theory: `CONTINUING THE JOURNEY:\n- Trees (Binary Search Trees, Heaps)\n- More advanced algorithms (A* search)\n- Distributed algorithms (MapReduce)\n- Online platforms for practice (LeetCode, HackerRank)`,
      exercises: [
        `PROJECT PART 4: Complex Itinerary\n- Implement a greedy or backtracking method 'best_itinerary(start_city, cities_to_visit)' that attempts to find a reasonable path to visit a list of cities. This is a simplified version of the Traveling Salesperson Problem.`,
        `PROJECT PART 5: User Interface & Analysis\n- Build a simple command-line interface (CLI) to interact with your route planner.\n- Allow users to find different types of routes and compare the results (e.g., the fastest route might have many stops, while the route with fewest stops might be much slower).`
      ],
      deliverable: "A complete, interactive GPS Route Planner with all features implemented. A journal entry reflecting on the entire 30-day curriculum.",
      objective: "Complete the capstone project and create a plan for continued learning in computer science."
    },
    {
      day: 30,
      title: "Curriculum Review & Problem-Solving Mastery",
      readings: [
        "Review your Problem-Solving Journal from Day 1 to Day 29.",
        "How to Solve It (PDF): Re-read Part III: 'Short Dictionary of Heuristic' section."
      ],
      theory: `THE PÓLYA FEEDBACK LOOP:\nProblem-solving is not a linear path, but a cycle.\nThe 'Look Back' step from Day 1 is the most critical. By reviewing past problems and solutions, you internalize patterns, identify weaknesses, and build intuition. This intuition is the hallmark of an expert problem-solver.`,
      exercises: [
        `EXERCISE 1: Code Review\n- Go back to your Week 1 project. How would you rewrite it now with your knowledge of classes, hash tables, and Big O? Refactor one key function for clarity and efficiency.`,
        `EXERCISE 2: Journal Synthesis\n- Read through your entire problem-solving journal. Write a one-page summary of the most important things you learned about your own thinking process. What are your strengths? Where do you still struggle?`,
        `EXERCISE 3: The Next Challenge\n- Find a medium-level problem on a platform like LeetCode. Apply the full Pólya method, documenting each step in your journal as you solve it. This is your first step on the continuing path.`
      ],
      deliverable: "A refactored function from your Week 1 project, a summary of your journal insights, and a fully documented solution to a new coding challenge.",
      objective: "Internalize the problem-solving process and transition from guided learning to independent practice."
    }
  ];
  
  return days.map(d => ({
    ...d,
    completed: false,
    notes: "",
    completedAt: null,
    // Ensure all new fields are preserved
    objective: d.objective || "",
    theory: d.theory || ""
  }));
}

