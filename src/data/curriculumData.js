/**
 * 30-Day Problem-Solving Mastery Curriculum Data (S-Tier Revision)
 * This optimized curriculum introduces foundational data structures (Stacks & Queues)
 * and abstract problem-solving patterns at logically crucial points. The capstone
 * project has been re-aligned to directly synthesize advanced graph algorithms,
 * ensuring a more cohesive and rigorous learning trajectory.
 *
 * Core Resources ONLY: Think Python (Allen B. Downey), Grokking Algorithms (Aditya Bhargava)
 */
export function initialCurriculum() {
  const days = [
    {
      day: 1,
      title: "The Problem-Solving Loop + Translating Problems to Code",
      readings: [
        "Think Python (Downey): Ch. 1 — The Way of the Program (mindset, debugging)",
        "Think Python: Ch. 2 — Variables, Expressions, and Statements",
        "Grokking Algorithms (Bhargava): Introduction — What is an algorithm?",
        "MIT OCW 6.0001: Lecture 1 notes — Problem solving process (decompose → implement → test → refine)"
      ],
      theory: `Anchor: The Problem-Solving Loop
Understand → Plan → Implement → Test → Reflect
- Understand: Restate the problem, define inputs/outputs, identify constraints and edge cases.
- Plan: Choose a strategy (decompose, simpler case, table/diagram), identify invariants, outline steps.
- Implement: Write small, testable functions with clear names and docstrings.
- Test: Start with simple, decisive tests; add edge cases.
- Reflect: Summarize what worked, pitfalls, and a reusable pattern.

Today’s emphasis: Translating English → variables/operators → small functions. Use your app’s Markdown notes editor as your journal.`,
      exercises: [
        `EXERCISE 1: Translate and Solve Two Word Problems
Problem A: “A rectangular garden is 3× as long as it is wide. Perimeter is 80. Find dimensions.”
Problem B: “Given a trip of d miles at s mph, compute arrival time given a start time.”
Read → Apply links:
- Use Think Python Ch. 2 for variables/expressions.
- Use MIT 6.0001 L1 for decompose → implement → test.
Do:
1) Understand: Write inputs, outputs, constraints, units in your Notes editor.
2) Plan: Introduce variables w, l; write perimeter equation; outline steps for time arithmetic.
3) Implement: functions garden_dims(perimeter, ratio) and arrival_time(start_hhmm, distance, speed_mph).
4) Test: At least 3 tests each (normal, boundary, invalid).
5) Reflect (Notes): One paragraph: what pattern is reusable?`,
        `EXERCISE 2: Micro-Functions From Specs (test-first)
Write: seconds_in(days), compound_interest(principal, rate, years), bmi(kg, meters).
Read → Apply: Think Python Ch. 2 (expressions), GA Intro (algorithm = plan).
Do:
- For each function: write a 1–2 line spec in the Notes editor, then 2–3 assert-style tests, then the implementation.
- Edge cases: zeros, negatives where applicable.
- Reflect: What assumptions did you make?`,
        `EXERCISE 3: Notes Template Setup (use your app’s Markdown editor)
Paste and use this template daily:
# Day X Notes
## Understand
- Problem summary:
- Inputs/Outputs:
- Constraints/Edge cases:
## Plan
- Strategy/steps:
- Invariants/checks:
## Implement
- Helpers you wrote:
## Test
- Test cases:
- Failures found/fixed:
## Reflect
- What worked/what didn’t:
- Pattern to reuse next time:`
      ],
      deliverable: "Python file with garden_dims and arrival_time plus the three micro-functions; Day 1 Notes entry using the provided template.",
      objective: "Adopt the Problem-Solving Loop and practice translating word problems into small, testable functions."
    },
    {
      day: 2,
      title: "Conditionals, Boolean Logic, and Invariants",
      readings: [
        "Think Python: Ch. 5 — Conditionals (sections 5.1–5.7)",
        "Think Python: Ch. 6 — Fruitful Functions (return values, pre/post-conditions)",
        "MIT 6.102/6.005: Invariants (lecture handout/notes — framing correctness conditions)"
      ],
      theory: `Key ideas:
- Boolean expressions (and, or, not), comparisons, chained comparisons.
- Decision tables to cover all cases.
- Invariants: Statements that remain true during execution (boundary handling, ranges).
- Pre/post-conditions in docstrings to lock intent and correctness.`,
      exercises: [
        `EXERCISE 1: Boundary-Heavy Decisions
Implement: sign(n) → {-1, 0, 1}, clamp(x, lo, hi), letter_grade(score) with +/- thresholds.
Read → Apply: Think Python Ch. 5 (conditionals), Ch. 6 (fruitful functions).
Do:
- For letter_grade, write a decision table in your Notes editor (boundaries: 89.5, 90.0, etc.).
- Tests: Include boundary cases (exact cutoffs), invalid inputs (negatives >100).`,
        `EXERCISE 2: Triangle Classification with Invariants
Function: classify_triangle(a,b,c) → "equilateral"/"isosceles"/"scalene"/"invalid".
Read → Apply: Invariants (triangle inequality), Think Python Ch. 5.
Do:
- Invariant: a+b>c, b+c>a, a+c>b for valid triangles; all sides > 0.
- Tests: All invalid cases, permutations (3,4,5), duplicates (2,2,3), degenerate (1,2,3).`,
        `EXERCISE 3: Piecewise Functions and Spec Clarity
Implement: fare(distance_miles) with tiered pricing; discount rules by day/time.
Read → Apply: Decision tables; pre/post-conditions in docstring.
Do:
- Write a short spec in your Notes editor (tiers, rounding, timezone assumptions).
- Implement with clear branches; add tests for every tier edge.`
      ],
      deliverable: "Python file with sign, clamp, letter_grade, classify_triangle, fare; Day 2 Notes with decision table(s) and invariants.",
      objective: "Design correct branching logic by enumerating cases and preserving invariants."
    },
    {
      day: 3,
      title: "Decomposition with Functions + Test-First Habits",
      readings: [
        "Think Python: Ch. 3 — Functions",
        "Think Python: Ch. 6 — Fruitful Functions (return, composition)",
        "pytest docs: Getting Started (parametrized tests, asserts)",
        "PEP 257 — Docstring conventions (short, actionable specs)"
      ],
      theory: `Top-down design:
- Split problems into helpers with single responsibility.
- Write specs (docstrings) first; outline inputs/outputs and edge cases.
- Write tests first for critical branches; keep them small and fast.`,
      exercises: [
        `EXERCISE 1: Leap Year via Helpers (test-first)
Goal: is_leap_year(year) using helpers: divisible_by(n, d).
Read → Apply: Think Python Ch. 3 & 6; pytest basics.
Do:
- Write tests first for rules: divisible by 400 ⇒ leap; divisible by 100 ⇒ not; divisible by 4 ⇒ leap; else not.
- Implement helpers; add parametrized tests for representative years.`,
        `EXERCISE 2: Normalize → Compare Pipeline
Goal: casefold/strip/punct-remove before comparing strings.
Implement: normalize(s), equal_normalized(a, b).
Read → Apply: Docstrings (PEP 257), Think Python string methods (preview).
Do:
- Spec: What punctuation set? What whitespace rules? Unicode handling?
- Tests: 'Cafe' vs 'CAFÉ' after normalization; ' a-b ' vs 'a b'.`,
        `EXERCISE 3: Geometry Mini-API (decompose + tests)
Implement: distance(p, q), triangle_area(p, q, r), is_right_triangle(p, q, r).
Read → Apply: Decomposition pattern; pytest for numeric tolerances.
Do:
- Use small helpers; write tests with simple coordinates; assert within tolerance for floats.`
      ],
      deliverable: "Python file with is_leap_year (+helpers), normalize/equal_normalized, geometry mini-API; pytest tests; Day 3 Notes with specs and test plans.",
      objective: "Use decomposition and test-first to build small, reliable components."
    },
    {
      day: 4,
      title: "Iteration Patterns and Intro to Complexity",
      readings: [
        "Think Python: Ch. 7 — Iteration",
        "Grokking Algorithms: Ch. 1 — Big O (runtime growth intuition)",
        "MIT OCW 6.006: Intro notes — Simple loops and asymptotics (overview)"
      ],
      theory: `Loop patterns:
- Counter, Accumulator, Sentinel, Two-index traversal.
Complexity intuition:
- Count dominant operations; classify O(1), O(n), O(n^2).
- Use reasoning before measurement; then time small experiments.`,
      exercises: [
        `EXERCISE 1: Classic Loop Patterns
Implement: sum_first_n(n), product_first_n(n), digit_sum(n), count_digits(n), is_prime(n).
Read → Apply: Think Python Ch. 7 loop constructs; GA Ch. 1 Big-O intuition.
Do:
- For each function, write claimed time complexity in a comment and Notes.
- Tests: Include small, medium, and edge values (0/1/large-ish).`,
        `EXERCISE 2: Loop Invariants
Pick two functions above and state a loop invariant that proves correctness.
Read → Apply: Invariants idea (Day 2 reading).
Do:
- In Notes, write the invariant and a 2–3 line justification.`,
        `EXERCISE 3: Micro-benchmarks (Windows)
Measure runtime growth roughly for is_prime(n) across inputs.
Read → Apply: GA Ch. 1; MIT 6.006 intuition.
Do:
- Use time.perf_counter(); print timing for several n (e.g., primes near 10^4, 10^5).
- Reflect: Does timing align with your O(.) classification?`
      ],
      deliverable: "Python file with loop functions and a timing script; Day 4 Notes with complexity claims and invariant write-ups.",
      objective: "Recognize core loop patterns and reason about runtime growth on simple problems."
    },
    {
      day: 5,
      title: "Strings and Hash-Based Thinking (Frequency, Anagrams, Palindromes)",
      readings: [
        "Think Python: Ch. 8 — Strings",
        "Think Python: Ch. 11 — Dictionaries (frequency counting sections)",
        "Grokking Algorithms: Ch. 5 — Hash Tables (why dict/set are powerful)"
      ],
      theory: `From sequences to maps:
- Strings are sequences; many tasks require counting or grouping.
- Frequency tables (dict) and set membership give O(1) average operations.
Patterns:
- Normalize → count → compare.
- Two-pass vs single-pass solutions; space–time trade-offs.`,
      exercises: [
        `EXERCISE 1: Normalize + Palindrome Variants
Implement: is_palindrome(s) ignoring case and non-letters; longest_palindromic_prefix(s) (simple scan).
Read → Apply: Think Python Ch. 8 normalization; dict/set overview (preview).
Do:
- Tests: Empty, single char, Unicode, punctuation-heavy inputs.`,
        `EXERCISE 2: Frequency Counting Toolkit
Implement: letter_freq(s), word_freq(s), top_k_words(s, k).
Read → Apply: Ch. 11 dict operations; GA Ch. 5 hash tables (why O(1)).
Do:
- Tests: Ties, case normalization, apostrophes; verify counts sum to len(s)/len(words).`,
        `EXERCISE 3: Anagrams Two Ways (compare solutions)
Implement: are_anagrams(a, b) via sorting and via frequency dict.
Read → Apply: Sorting vs hashing trade-offs (time/space).
Do:
- Complexity: Document O(n log n) vs O(n) trade-offs and when one may dominate (constant factors, character set).`
      ],
      deliverable: "Python file with palindrome utilities, frequency counters, anagram checks; Day 5 Notes with complexity and trade-off discussion.",
      objective: "Use normalization and frequency maps to solve common string problems efficiently."
    },
    {
      day: 6,
      title: "Recursion Fundamentals and the Call Stack",
      readings: [
        "Grokking Algorithms: Ch. 3 — Recursion (base case vs recursive case)",
        "Think Python: Recursion sections (Ch. 5/6 recursion examples)",
        "Optional: HtDP 2e — Structural recursion (design recipe) for thinking templates"
      ],
      theory: `Mental model:
- Base case: smallest, immediate answer.
- Recursive case: reduce the problem size and defer the rest.
- The call stack records pending work; ensure progress to the base case.
Recipe:
1) Solve a tiny example by hand.
2) Assume a helper solves a smaller instance.
3) Use that to solve the current instance.
4) Prove it terminates (size decreases).`,
      exercises: [
        `EXERCISE 1: Trace by Hand → Then Implement
Functions: factorial(n), power(b, e), sum_list(lst).
Read → Apply: GA Ch. 3; Think Python recursion mechanics.
Do:
- Draw call trees for small inputs; then implement.
- Tests: Compare to iterative versions (from Day 4) for correctness.`,
        `EXERCISE 2: Recursive Strings
Implement: reverse_string(s), is_palindrome_recursive(s) (reuse Day 5 normalization).
Read → Apply: Base/recursive cases; reuse helpers to avoid duplication.
Do:
- Tests: Same suite as Day 5; ensure both iterative and recursive pass.`,
        `EXERCISE 3: When Not to Use Recursion
Pick one problem from Days 4–5 and argue (in Notes) why the iterative/hash approach is preferable (stack depth, overhead, clarity).`
      ],
      deliverable: "Python file with recursive and iterative pairs; Day 6 Notes with call trees and a short argument about recursion vs iteration.",
      objective: "Develop a clear template for designing and validating recursive solutions."
    },
    {
      day: 7,
      title: "Week 1 Integration Project: Text Insights CLI",
      readings: [
        "Think Python: Review Ch. 1–3, 5–8, 11 (functions, conditionals, iteration, strings, dicts)",
        "pytest docs: Parametrization and fixtures (skim for organizing tests)"
      ],
      theory: `Integrate the Loop:
- Understand: Define a clear spec and sample I/O first.
- Plan: Decompose into modules: io, normalize, analyze, report.
- Implement: Small functions with tests; wire up a simple CLI.
- Test: Golden tests on small sample files; edge cases (empty file, symbols only).
- Reflect: Identify patterns reused from the week (normalize → count → compare; invariants; decomposition).`,
      exercises: [
        `PROJECT: Text Insights CLI (modular, testable)
Features:
1) Basic stats: line_count, char_count, word_count (normalized).
2) Frequency: letter_freq, word_freq, top_k_words.
3) Palindrome/anagram reports: longest palindromic word; anagram groups of size ≥ 2.
4) CLI: textinsights <path> [--top K] [--pal] [--anagrams].
Read → Apply:
- Reuse Day 5 frequency and normalization; Day 3 decomposition/test-first; Day 4 iteration patterns.
Do:
- Write a one-screen spec in your Notes editor (inputs/flags/outputs).
- Implement modules: normalize.py, analyze.py, cli.py (or all in one file if you prefer).
- Tests: Use small sample texts; parametrize top K; check edge cases (empty, punctuation only).`
      ],
      deliverable: "Working CLI and tests; Day 7 Notes capturing spec, decomposition, and a brief postmortem (what you’d change next).",
      objective: "Synthesize Week 1 patterns into a cohesive, well-tested tool using your Notes editor as the journal."
    },

    // WEEK 2: Data Structures & OOP (refined for overlap and clarity)
    {
      day: 8,
      title: "Introduction to Recursion",
      readings: [
        "Think Python: Chapter 5 — Recursion sections",
        "Think Python: Chapter 6 — Recursion examples",
        "Grokking Algorithms: Chapter 3 — Recursion (focus on base vs recursive case)"
      ],
      theory: `RECURSION:\nA recursive function calls itself. Must have:\n1. BASE CASE: Simplest version, returns immediately.\n2. RECURSIVE CASE: Breaks problem into smaller sub-problem.`,
      exercises: [
        `EXERCISE 1: Trace Recursive Execution\n- Trace factorial(4) and power(base, exp) with a call tree.`,
  `EXERCISE 2: Apply the Loop to Recursive Problems\n- sum_to_n(n), sum_digits_recursive(n) with explicit base/recursive cases.`,
        `EXERCISE 3: Iteration vs Recursion\n- Fibonacci and GCD (Euclid) both ways; compare clarity and performance.`
      ],
      deliverable: "Python file with recursive implementations: countdown, factorial, power, sum_to_n, sum_digits, fibonacci (both), gcd (both).",
      objective: "Understand recursion fundamentals and recognize when to use recursion vs iteration"
    },
    {
      day: 9,
      title: "Lists & List Processing",
      readings: [
        "Think Python: Chapter 10 — Lists"
      ],
      theory: `LISTS (Think Python Ch. 10):\n- Mutable sequence of values.\nOPERATIONS: Indexing, Slicing, .append(), .pop(), len(), sum()`,
  exercises: [`EXERCISE 1: List Operations Practice`, `EXERCISE 2: List Processing with the Loop: double_list, filter_positive`, `EXERCISE 3: Advanced List Operations: reverse_list, find_max, remove_duplicates`],
      deliverable: "Python file with list operations: double_list, filter_positive, squares, reverse_list, find_max, remove_duplicates",
      objective: "Master list manipulation and processing patterns"
    },
    {
      day: 10,
      title: "Dictionaries - Key-Value Power",
      readings: [
        "Think Python: Chapter 11 — Dictionaries",
        "Grokking Algorithms: Hash Tables (overview to connect dicts to algorithms)"
      ],
      theory: `DICTIONARIES (Think Python Ch. 11):\n- Mapping from keys to values.\n- Keys must be immutable.\nOPERATIONS: Access, Add/Update, Delete, Check key existence`,
      exercises: [`EXERCISE 1: Dictionary Basics: create_gradebook`, `EXERCISE 2: Frequency Counting: word_frequency, letter_frequency`, `EXERCISE 3: Dictionary Applications: histogram, reverse_lookup`],
      deliverable: "Python file with dictionary programs: gradebook, word_frequency, letter_frequency, histogram, reverse_lookup, merge_dicts",
      objective: "Master dictionaries for counting, lookup, and mapping problems"
    },
    {
      day: 11,
      title: "Tuples & Data Structures",
      readings: [
        "Think Python: Chapter 12 — Tuples"
      ],
      theory: `TUPLES (Think Python Ch. 12):\n- Immutable sequence.\n- Often used for grouped data and returning multiple values.`,
      exercises: [`EXERCISE 1: Tuples and Unpacking: swap(a,b)`, `EXERCISE 2: DSU (Decorate-Sort-Undecorate): sort_by_length`, `EXERCISE 3: Advanced Tuple Applications: most_common_words`],
      deliverable: "Python file with tuple programs: swap, distance, sort_by_length, most_common_words, group_by_length, zip_lists",
      objective: "Master tuples for immutable data and sophisticated sorting patterns"
    },
    {
      day: 12,
      title: "Files & Persistence",
      readings: [
        "Think Python: Chapter 14 — Files"
      ],
      theory: `FILES (Think Python Ch. 14):\n- Persistent storage.\n- Reading ('r'), Writing ('w'), Appending ('a').\n- Using 'with open(...)' for automatic closing.`,
  exercises: [`EXERCISE 1: File Reading: count_lines, find_in_file`, `EXERCISE 2: File Writing with the Loop: log_activity`, `EXERCISE 3: Data Processing: word_frequency_from_file`],
      deliverable: "Python file with file operations: count_lines, log_activity, word_frequency_from_file, filter_long_words, csv_to_dict.",
      objective: "Master file I/O for data persistence and processing"
    },
    {
      day: 13,
      title: "Classes & Object-Oriented Thinking",
      readings: [
        "Think Python: Chapter 15 — Classes and Objects",
        "Think Python: Chapter 16 — Classes and Functions"
      ],
      theory: `CLASSES (Think Python Ch. 15-16):\n- Class: template for objects.\n- Object: instance of a class.\n- Attributes: data.\n- Methods: functions.`,
  exercises: [`EXERCISE 1: Create Your First Class: Rectangle, Circle`, `EXERCISE 2: Apply the Loop to OOP: BankAccount`, `EXERCISE 3: Real-World Classes: Student, TodoList`],
      deliverable: "Python file with classes: Point, Rectangle, Circle, BankAccount, Student, TodoList. Include test code demonstrating each class.",
      objective: "Understand object-oriented programming and class design"
    },
    {
      day: 14,
      title: "Week 2 Integration Project",
      readings: [
        "Think Python: Review Chapters 10–16",
        "Grokking Algorithms: Review Chapters 3–5 (recursion/hash tables)"
      ],
      theory: `LOOKING BACK:\n- Can you check the result?\n- Can you derive the result differently?\n- Can you use the result or method for another problem?`,
      exercises: [`PROJECT: Personal Library Management System\nPART 1: Core Classes (Book, Library)\nPART 2: File Persistence (JSON)\nPART 3: Statistics & Analysis\nPART 4: Interactive Interface\nPART 5: Testing & Documentation`],
      deliverable: "Complete Library Management System with Book and Library classes, file persistence, statistics, interactive menu, and comprehensive testing.",
      objective: "Integrate Week 2 skills (recursion, data structures, files, classes) into a cohesive application"
    },
  // WEEK 3: Algorithms - Foundations, Search, Sort (Revised to use only core resources)
    {
      day: 15,
      title: "Stacks & Queues: The Building Blocks of Algorithms",
      readings: [
        "Think Python: Chapter 10 — Lists (use list as stack; discuss pop/push)",
        "Grokking Algorithms: Chapter 3 — Recursion (call stack as a real stack)"
      ],
      theory: `STACK (LIFO - Last-In, First-Out):\n- Analogy: A stack of plates. You add (push) to the top and remove (pop) from the top.\n- Operations: push(), pop(), peek().\n- Use Case: Call stack, undo functionality, parsing expressions.\n\nQUEUE (FIFO - First-In, First-Out):\n- Analogy: A checkout line. First person in line is the first one out.\n- Operations: enqueue(), dequeue().\n- Python's 'collections.deque' is highly efficient for this.\n- Use Case: Task scheduling, breadth-first search.`,
      exercises: [
        `EXERCISE 1: Implement a Stack\n- Stack class (list-backed): push, pop, peek, is_empty. Add tests.`,
        `EXERCISE 2: Balanced Parentheses\n- Use your Stack to validate '()[]{}'. Extend to include characters and ignore non-brackets.`,
        `EXERCISE 3: Implement a Queue\n- Queue class (list-backed with head index or two-stack technique). Methods: enqueue, dequeue, size.`,
        `EXERCISE 4: Printer Simulation\n- Use Queue to simulate a print queue with (job_id, pages). Dequeue in FIFO order; compute total time.\n- LOOK BACK: Where else can you reuse this Queue (hint: BFS Day 22)?`
      ],
      deliverable: "Python file containing Stack and Queue class implementations and functions for the balanced parentheses and printer simulation problems.",
      objective: "Master LIFO and FIFO data structures as foundational tools for complex algorithms."
    },
    {
      day: 16,
      title: "Big O Notation & Algorithm Analysis",
      readings: [
        "Grokking Algorithms: Chapter 1 — Introduction to Algorithms (Big O, intuition)",
        "Think Python: Analysis of Algorithms (runtime growth)"
      ],
      theory: `BIG O NOTATION:\nDescribes how an algorithm's runtime or space requirements grow with the input size 'n'.\n\nCOMMON RUNTIMES:\n- O(1) - Constant (e.g., hash table lookup, stack push/pop)\n- O(log n) - Logarithmic (e.g., binary search)\n- O(n) - Linear (e.g., simple search, iterating a list)\n- O(n log n) - Log-linear (e.g., efficient sorting)\n- O(n²) - Quadratic (e.g., selection sort, nested loops over a list)`,
      exercises: [
        `EXERCISE 1: Understand Big O Growth\n- Analyze: get_first(lst), print_all(lst), print_pairs(lst). State time and space.`,
  `EXERCISE 2: Apply the Loop to Algorithm Analysis\n- Compare naive contains_duplicate (O(n²)) vs set-based (O(n)). Explain the plan and invariant.`,
        `EXERCISE 3: Compare Algorithm Efficiency\n- Time linear search vs set lookup; reflect on constant factors and input sizes.`
      ],
      deliverable: "Python file analyzing Big O of various functions. Document with comments explaining the analysis. Include timing experiments.",
      objective: "Understand Big O notation and analyze algorithm efficiency"
    },
    {
      day: 17,
      title: "Binary Search - Logarithmic Power",
      readings: [
        "Grokking Algorithms: Chapter 1 — Binary Search"
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
        "Grokking Algorithms: Chapter 2 — Selection Sort",
        "Think Python: Lists (review slicing and swapping to implement in place)"
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
        "Grokking Algorithms: Chapter 3 — Recursion",
        "Think Python: Recursion sections (from Day 8) — re-read to connect to call stack"
      ],
      theory: `THE CALL STACK:\n- Recursion is managed by the call stack (a LIFO structure!).\n- Each recursive call adds a 'frame' to the stack.\n- The stack unwinds as base cases are hit and functions return.`,
  exercises: [`EXERCISE 1: Visualize Call Stack\n- Create a recursive countdown function that prints when it's called and when it returns to visualize the stack's operation.`, `EXERCISE 2: Apply the Loop to Recursive Problems\n- Recursively count items in a list.`, `EXERCISE 3: Recursive Problem Set\n- Implement recursive reverse_string and recursive is_palindrome.`],
      deliverable: "Python file with recursive functions: countdown with stack visualization, count, reverse_string, is_palindrome. Include call stack diagrams in comments.",
      objective: "Master recursion and understand the call stack deeply"
    },
    {
      day: 20,
      title: "Quicksort - Divide and Conquer",
      readings: [
        "Grokking Algorithms: Chapter 4 — Quicksort"
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
        "Grokking Algorithms: Chapter 5 — Hash Tables",
        "Grokking Algorithms: Review Chapters 1–4",
        "Think Python: Chapter 11 — Dictionaries (implementation perspective)"
      ],
      theory: `HASH TABLES:\n- The data structure behind Python's dictionaries.\n- Provides average O(1) time for insert, lookup, and delete.\n- Uses a hash function to map keys to array indices.\nUSE CASES:\n- Lookups (e.g., phone books)\n- Caching/Memoization\n- Preventing duplicates (using sets)`,
      exercises: [`PROJECT: Spell Checker & Autocomplete System\nPART 1: Dictionary Management (use a Set for O(1) lookups)\nPART 2: Spell Checking\nPART 3: Suggestion Engine (find words with small edit distance)\nPART 4: Autocomplete\nPART 5: Performance Analysis (compare Set vs List for lookups)`],
      deliverable: "Complete spell checker system with dictionary management, spell checking, suggestions, autocomplete, and performance benchmarks.",
      objective: "Integrate Week 3 concepts (Big O, search, sort, recursion, hash tables) into a sophisticated application"
    },
  // WEEK 4: Advanced Algorithms & Problem-Solving Mastery (Refined to use only core resources)
    {
      day: 22,
      title: "Breadth-First Search - Graph Traversal",
      readings: [
        "Grokking Algorithms: Chapter 6 — Breadth-First Search",
        "Think Python: Chapter 11 — Dictionaries (for graph adjacency maps)",
        "Day 15 notes: Queues (revisit your own journal)"
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
        "Grokking Algorithms: Chapter 7 — Dijkstra's Algorithm"
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
        "Grokking Algorithms: Chapter 8 — Greedy Algorithms"
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
        "Grokking Algorithms: Chapter 9 — Dynamic Programming",
        "Think Python: Recursion sections (visualize subproblems and memoization)"
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
        "Grokking Algorithms: Chapter 9 — Dynamic Programming (review)",
        "Think Python: Recursion (review)"
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
        "Think Python: Chapters 7–10 (Iteration, Strings, Lists) — primitives for windowing and pointer movement",
        "Grokking Algorithms: Chapter 4 — Quicksort (pointer partitioning inspiration)"
      ],
      theory: `PROBLEM-SOLVING PATTERNS AND HEURISTICS:\n- Reusable templates guided by invariants, reductions, and state maintenance.\n\nTWO POINTERS (Invariant-driven):\n- Maintain an invariant about the relation between left and right pointers (e.g., sum < target ⇒ move left up).\n- Often used on sorted arrays.\n\nSLIDING WINDOW (State compression):\n- Maintain a running state for a "window" over linear data.\n- Update incrementally as the window slides (remove left, add right).`,
      exercises: [
        `EXERCISE 1: Two Pointers (Invariant)\n- Sorted array + target ⇒ decide move by comparing sum to target. Prove your move rule keeps correctness.`,
        `EXERCISE 2: Sliding Window (State Update)\n- Max sum of subarray of size k in O(n). Add tests with negatives and k=1/k=len(arr).`,
        `EXERCISE 3: Pattern Recognition\n- Revisit Day 6 anagram and Day 10 frequency tasks: could windowing or two pointers help in variants? Document findings.`
      ],
      deliverable: "Python file with efficient O(n) solutions for the Two Pointers and Sliding Window exercises.",
      objective: "Learn to recognize and apply common algorithmic patterns to solve novel problems."
    },
    {
      day: 28,
      title: "Week 4 Integration Project: GPS Route Planner",
      readings: [
        "Grokking Algorithms: Chapters 6, 7, 8 — BFS, Dijkstra, Greedy (review)",
        "Think Python: Testing/Debugging sections — analyze trade-offs"
      ],
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
        "Grokking Algorithms: Chapter 11 — Where to Go From Here"
      ],
  theory: `CONTINUING THE JOURNEY:\n- Trees (Binary Search Trees, Heaps)\n- More advanced algorithms (A* search)\n- Distributed algorithms (MapReduce)\n- Continue practicing by extending end-of-chapter exercises from Think Python and Grokking Algorithms`,
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
        "Review your Problem-Solving Journal from Day 1 to Day 29."
      ],
      theory: `THE PROBLEM-SOLVING FEEDBACK LOOP:\nProblem-solving is not a linear path, but a cycle.\nThe Reflect step from Day 1 is the most critical. By reviewing past problems and solutions, you internalize patterns, identify weaknesses, and build intuition. This intuition is the hallmark of an expert problem-solver.`,
      exercises: [
        `EXERCISE 1: Code Review\n- Go back to your Week 1 project. How would you rewrite it now with your knowledge of classes, hash tables, and Big O? Refactor one key function for clarity and efficiency.`,
        `EXERCISE 2: Journal Synthesis\n- Read through your entire problem-solving journal. Write a one-page summary of the most important things you learned about your own thinking process. What are your strengths? Where do you still struggle?`,
  `EXERCISE 3: The Next Challenge\n- Select an end-of-chapter exercise from Grokking Algorithms or Think Python that you have not completed before. Apply the full Problem-Solving Loop, documenting each step in your journal as you solve it. This is your first step on the continuing path.`
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

