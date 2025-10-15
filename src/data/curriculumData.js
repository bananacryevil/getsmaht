/**
 * 30-Day Problem-Solving Mastery Curriculum Data
 * Based on: Think Python, How to Solve It, Grokking Algorithms
 * 
 * This file contains the complete curriculum structure with all 30 days of content.
 * Extracted from App.jsx for better code organization.
 */

export function initialCurriculum() {
  // 30-Day Problem-Solving Mastery Curriculum
  // Based on: Think Python, How to Solve It, Grokking Algorithms
  const days = [
    // WEEK 1: Foundations - Pólya's Method + Python Basics
    { 
      day: 1, 
      title: "Pólya's Problem-Solving Framework", 
      readings: [
        "How to Solve It (PDF): Preface, Introduction & Part I - Understanding the Problem (pp. ix-25)"
      ],
      theory: `PÓLYA'S 4-STEP METHOD:
1. UNDERSTAND THE PROBLEM
   - What is the unknown? What are the data? What is the condition?
   - Is it possible to satisfy the condition?
   - Draw a figure. Introduce suitable notation.

2. DEVISE A PLAN
   - Have you seen it before? Do you know a related problem?
   - Could you solve a simpler problem?
   - Could you solve part of the problem?

3. CARRY OUT THE PLAN
   - Check each step. Can you see clearly that the step is correct?

4. LOOK BACK
   - Can you check the result? The argument?
   - Can you derive the result differently?
   - Can you use the result or method for some other problem?`,
      exercises: [
        `EXERCISE 1: Understand the Problem
Problem: "A rectangular garden is 3 times as long as it is wide. If the perimeter is 80 meters, find the dimensions."

Apply Step 1 (Understanding):
- Unknown: length and width
- Data: length = 3 × width, perimeter = 80
- Condition: 2 × (length + width) = 80
- Figure: Draw a rectangle, label width as 'w' and length as '3w'

Now YOU solve: "I have $100 to buy books that cost $12 each and notebooks that cost $5 each. If I buy 3 books, how many notebooks can I buy?"`,

        `EXERCISE 2: Devise a Plan
For the garden problem:
- Related problem: I know perimeter = 2(l + w)
- Substitute: 2(3w + w) = 80
- Simplify: 2(4w) = 80, so 8w = 80
- Plan: Solve for w, then find l

Now YOU plan: "Find the largest number less than 100 that is divisible by both 6 and 8"`,

        `EXERCISE 3: Create Your Problem-Solving Journal
Set up a notebook (physical or digital) with this template:

PROBLEM: [State the problem clearly]
UNDERSTAND: 
  - Unknown: 
  - Data: 
  - Condition: 
  - Figure/Diagram: 
PLAN:
  - Similar problems I've seen:
  - Simpler version:
  - Strategy:
EXECUTE:
  - Step-by-step solution:
REVIEW:
  - Does the answer make sense?
  - Alternative methods:
  - What did I learn?`
      ], 
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
      theory: `VALUES AND TYPES (Think Python Ch. 1-2):
- Value: Basic unit of data (2, 42, 'Hello')
- Type: Category of value (int, float, str)
- Variable: Name that refers to a value
- Expression: Combination of values and operators that evaluates to a value
- Statement: Unit of code that has an effect

OPERATORS:
+ - * / (arithmetic)
** (exponentiation)
// (floor division)
% (modulo)

EXAMPLE:
>>> 5 ** 2        # 25
>>> 17 // 3       # 5 (quotient)
>>> 17 % 3        # 2 (remainder)`,
      exercises: [
        `EXERCISE 1: Type Exploration
Open Python and explore types using type():
>>> type(42)
>>> type(42.0)
>>> type('42')
>>> type('Hello, World!')

Now try these expressions - predict the result first, then check:
>>> 5 / 2
>>> 5 // 2
>>> 5 % 2
>>> 2 ** 10`,

        `EXERCISE 2: Apply Pólya to a Coding Problem
PROBLEM: "Calculate the area of a circle given radius r"

UNDERSTAND:
- Unknown: area
- Data: radius r
- Formula: area = π × r²

PLAN:
- Need to import math for π
- Square the radius (r ** 2)
- Multiply by pi

EXECUTE:
import math

def circle_area(radius):
    area = math.pi * radius ** 2
    return area

REVIEW:
Test: circle_area(1) should be ~3.14
Test: circle_area(2) should be ~12.56`,

        `EXERCISE 3: Build Your Own
Using Pólya's method, solve these:

A) Convert hours to seconds
   - Understand: 1 hour = 60 min, 1 min = 60 sec
   - Write: hours_to_seconds(hours)

B) Calculate compound interest
   - Formula: A = P(1 + r)^t
   - Write: compound_interest(principal, rate, years)

C) Convert Celsius to Fahrenheit
   - Formula: F = C × 9/5 + 32
   - Write: celsius_to_fahrenheit(temp_c)`
      ], 
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
      theory: `FUNCTIONS (Think Python Ch. 3):
- Function definition: Creates a new function
  def function_name(parameters):
      statements
      
- Function call: Executes the function
  result = function_name(arguments)

- Flow of execution: Order in which statements execute
- Parameters and arguments: Values passed to functions
- Return values: What the function gives back

DECOMPOSITION (How to Solve It):
Break complex problems into simpler sub-problems
"If you can't solve a problem, there is an easier problem you can solve: find it."`,
      exercises: [
        `EXERCISE 1: Basic Functions (Think Python examples)
def print_lyrics():
    print("I'm a lumberjack, and I'm okay.")
    print("I sleep all night and I work all day.")

def repeat_lyrics():
    print_lyrics()
    print_lyrics()

Now YOU create:
- greet(name): prints personalized greeting
- print_twice(text): prints text two times
- print_n_times(text, n): prints text n times`,

        `EXERCISE 2: Decomposition Practice
PROBLEM: "Check if a year is a leap year"

UNDERSTAND:
- Leap year if: divisible by 4
- Exception: if divisible by 100, NOT a leap year
- Exception to exception: if divisible by 400, IS a leap year

DECOMPOSE:
def is_divisible(n, divisor):
    return n % divisor == 0

def is_leap_year(year):
    if is_divisible(year, 400):
        return True
    if is_divisible(year, 100):
        return False
    if is_divisible(year, 4):
        return True
    return False

Notice how breaking it into is_divisible() makes logic clearer!`,

        `EXERCISE 3: Build Through Decomposition
PROBLEM: "Calculate the distance between two points (x1,y1) and (x2,y2)"
Formula: d = √[(x2-x1)² + (y2-y1)²]

DECOMPOSE:
1. def square(x): return x ** 2
2. def sum_of_squares(a, b): return square(a) + square(b)
3. def distance(x1, y1, x2, y2):
       import math
       return math.sqrt(sum_of_squares(x2-x1, y2-y1))

Now YOU decompose:
- Calculate area of triangle: A = √[s(s-a)(s-b)(s-c)] where s = (a+b+c)/2
- Calculate volume of cylinder: V = π × r² × h
- Calculate BMI: BMI = weight(kg) / height(m)²`
      ], 
      deliverable: "Python file with decomposed functions for leap year, distance, triangle area, cylinder volume, and BMI",
      objective: "Master function creation and problem decomposition as a core strategy"
    },

    { 
      day: 4, 
      title: "Conditionals & Boolean Logic", 
      readings: [
        "Think Python (PDF): Ch. 5 - Conditionals and Recursion (pp. 43-50, skip recursion for now)",
        "Think Python (PDF): Ch. 6 - Fruitful Functions (pp. 51-60)"
      ],
      theory: `CONDITIONALS (Think Python Ch. 5):
if condition:
    # executes if condition is True
elif other_condition:
    # executes if other_condition is True
else:
    # executes if all conditions are False

BOOLEAN EXPRESSIONS:
x == y  # equality
x != y  # inequality
x > y, x < y, x >= y, x <= y
and, or, not

FRUITFUL FUNCTIONS (Ch. 6):
Functions that return values vs void functions
Use return to send back a result`,
      exercises: [
        `EXERCISE 1: Conditional Logic Practice
def absolute_value(x):
    """Apply Pólya's method"""
    # UNDERSTAND: Need non-negative value
    # PLAN: If negative, negate it; otherwise keep it
    if x < 0:
        return -x
    else:
        return x

Now YOU implement:
def sign(x):
    # Return 1 if positive, -1 if negative, 0 if zero
    
def max_of_two(a, b):
    # Return the larger of two numbers
    
def max_of_three(a, b, c):
    # Use max_of_two to build max_of_three (decomposition!)`,

        `EXERCISE 2: Grade Calculator
PROBLEM: Convert numerical score to letter grade
- 90-100: A
- 80-89: B
- 70-79: C
- 60-69: D
- Below 60: F

def grade_letter(score):
    # UNDERSTAND: map ranges to letters
    # PLAN: use if/elif chain from highest to lowest
    if score >= 90:
        return 'A'
    # YOU complete the rest
    
Test: grade_letter(95), grade_letter(73), grade_letter(55)`,

        `EXERCISE 3: Complex Conditionals
def can_vote(age, is_citizen):
    """Both conditions must be True"""
    return age >= 18 and is_citizen

def is_triangle(a, b, c):
    """Check if three sides can form a triangle"""
    # Triangle inequality: sum of any two sides > third side
    # DECOMPOSE: check all three combinations
    # Hint: return (a+b > c) and (a+c > b) and (b+c > a)

def is_between(x, low, high):
    """Check if x is between low and high (inclusive)"""
    # YOU implement using and operator`
      ], 
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
      theory: `ITERATION (Think Python Ch. 7):
while loop: Repeat while condition is True
while n > 0:
    print(n)
    n = n - 1

for loop: Iterate over a sequence
for i in range(10):
    print(i)

LOOP PATTERNS:
- Counter: track number of iterations
- Accumulator: build up a result
- Sentinel: loop until special value found
- Infinite loop: while True (need break)

WORKING BACKWARDS (Pólya):
Start from desired result, work back to what you know`,
      exercises: [
        `EXERCISE 1: Basic Iteration Patterns
def countdown(n):
    """Count from n to 1"""
    while n > 0:
        print(n)
        n = n - 1
    print('Blastoff!')

def print_n_times(message, n):
    """Print message n times using for loop"""
    for i in range(n):
        print(message)

Now YOU implement:
def sum_first_n(n):
    """Sum 1 + 2 + 3 + ... + n using accumulator pattern"""
    total = 0
    for i in range(1, n + 1):
        total = total + i
    return total`,

        `EXERCISE 2: Apply Pólya with Loops
PROBLEM: "Find the factorial of n (n! = n × (n-1) × ... × 1)"

UNDERSTAND: Multiply all integers from 1 to n
PLAN: Use accumulator pattern, start with 1, multiply by each number
EXECUTE:
def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result = result * i
    return result

REVIEW: factorial(5) = 120, factorial(0) = 1

Now YOU solve:
def power(base, exponent):
    """Calculate base^exponent using loop (don't use **)"""
    # Hint: multiply base by itself exponent times`,

        `EXERCISE 3: Advanced Loop Problems
def is_prime(n):
    """Check if n is prime using iteration"""
    # UNDERSTAND: prime if only divisible by 1 and itself
    # PLAN: check all numbers from 2 to n-1
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

def digit_sum(n):
    """Sum the digits of a number"""
    # Working backwards: 
    # - To get last digit: n % 10
    # - To remove last digit: n // 10
    # - Repeat until n = 0
    
def count_digits(n):
    """Count how many digits in n"""
    # Similar strategy to digit_sum`
      ], 
      deliverable: "Python file with iteration exercises: countdown, sum_first_n, factorial, power, is_prime, digit_sum, count_digits",
      objective: "Master iteration patterns and apply working-backwards strategy"
    },

    { 
      day: 6, 
      title: "Strings - Text as Data", 
      readings: [
        "Think Python (PDF): Ch. 8 - Strings (pp. 71-82)"
      ],
      theory: `STRINGS (Think Python Ch. 8):
- String: sequence of characters
- Indexing: fruit[0] gets first character
- Length: len(fruit) gives number of characters
- Slicing: fruit[0:3] gets substring
- Immutable: can't change characters in place
- Traversal: loop through each character

STRING OPERATIONS:
'a' in 'banana'  # True
'seed' in 'banana'  # False
word.upper(), word.lower()
word.find('a'), word.count('a')`,
      exercises: [
        `EXERCISE 1: String Traversal
def print_chars(s):
    """Print each character on its own line"""
    for char in s:
        print(char)

def count_vowels(s):
    """Count vowels in a string"""
    count = 0
    for char in s:
        if char.lower() in 'aeiou':
            count = count + 1
    return count

Now YOU implement:
def count_spaces(s):
    """Count spaces in string"""
    
def reverse_string(s):
    """Return reversed string using slicing: s[::-1]"""`,

        `EXERCISE 2: String Analysis with Pólya
PROBLEM: "Check if a string is a palindrome (reads same backwards)"

UNDERSTAND: Compare string with its reverse
PLAN: Reverse the string, check if equal (ignore case/spaces)
EXECUTE:
def is_palindrome(s):
    # Remove spaces and convert to lowercase
    s = s.replace(' ', '').lower()
    # Compare with reverse
    return s == s[::-1]

REVIEW: is_palindrome("racecar") → True
        is_palindrome("A man a plan a canal Panama") → True

Now YOU solve:
def is_anagram(s1, s2):
    """Check if two strings are anagrams"""
    # Hint: sorted('listen') == sorted('silent')`,

        `EXERCISE 3: String Building
def remove_vowels(s):
    """Return string with all vowels removed"""
    result = ''
    for char in s:
        if char.lower() not in 'aeiou':
            result = result + char
    return result

def acronym(phrase):
    """Create acronym from phrase: 'as soon as possible' → 'ASAP'"""
    # DECOMPOSE:
    # 1. Split phrase into words: phrase.split()
    # 2. Take first letter of each word
    # 3. Join and convert to uppercase
    
def word_count(text):
    """Count words in text"""
    # Hint: len(text.split())`
      ], 
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
      theory: `CARRYING OUT THE PLAN (Pólya Part III):
- Check each step of your reasoning
- Can you see clearly that each step is correct?
- Can you prove that it is correct?

PROJECT APPROACH:
1. Break down into small functions (decomposition)
2. Test each function individually
3. Combine functions to build complete solution
4. Review and refine`,
      exercises: [
        `PROJECT: Text Analysis Tool
Build a comprehensive text analyzer with these features:

PART 1: Basic Statistics
def text_stats(text):
    """Return dictionary with:
    - character_count (including spaces)
    - word_count
    - sentence_count (count periods, !, ?)
    - average_word_length
    """

PART 2: Content Analysis  
def analyze_content(text):
    """Return dictionary with:
    - vowel_count
    - consonant_count
    - digit_count
    - most_common_word
    """

PART 3: Transformations
def transform_text(text, operation):
    """Support operations:
    - 'upper': convert to uppercase
    - 'lower': convert to lowercase
    - 'title': title case
    - 'reverse': reverse text
    - 'no_vowels': remove vowels
    - 'acronym': create acronym from each sentence
    """`,

        `PART 4: Validation
def validate_text(text):
    """Check text quality, return issues list:
    - 'no_double_spaces': check for double spaces
    - 'balanced_quotes': check if quotes are balanced
    - 'balanced_parens': check if parentheses balanced
    - 'proper_capitalization': sentences start with capital
    """

PART 5: Main Program
def main():
    """Interactive text analyzer:
    1. Prompt user for text input
    2. Display menu of operations
    3. Perform chosen operation
    4. Display results clearly
    5. Ask if they want to analyze more
    """`,

        `TESTING REQUIREMENTS:
Create test_text_analyzer.py with test cases:

test_text = \"\"\"
Hello, World! This is a test. 
Python programming is fun and powerful.
Can you analyze this text correctly?
\"\"\"

# Test each function with:
# - Empty string
# - Single word
# - Multiple sentences
# - Special characters
# - Numbers mixed with text

Document your testing in your problem-solving journal.`
      ], 
      deliverable: "Complete text analysis tool with all 5 parts, tested and working. Journal entry documenting your problem-solving process.",
      objective: "Integrate Week 1 skills (functions, conditionals, loops, strings) into a cohesive project"
    },


    // WEEK 2: Recursion & Divide-and-Conquer Thinking
    { 
      day: 8, 
      title: "Introduction to Recursion", 
      readings: [
        "Think Python (PDF): Ch. 5 - Conditionals and Recursion (pp. 47-50, recursion section)",
        "Think Python (PDF): Ch. 6 - Fruitful Functions (pp. 55-58, recursion examples)"
      ],
      theory: `RECURSION (Think Python Ch. 5-6):
A recursive function calls itself. Must have:
1. BASE CASE: Simplest version that returns immediately
2. RECURSIVE CASE: Breaks problem into smaller sub-problem

EXAMPLE - Countdown:
def countdown(n):
    if n <= 0:           # Base case
        print('Blastoff!')
    else:                # Recursive case
        print(n)
        countdown(n-1)   # Calls itself with smaller n

FACTORIAL:
def factorial(n):
    if n == 0:           # Base case: 0! = 1
        return 1
    else:                # Recursive case: n! = n × (n-1)!
        return n * factorial(n-1)

THE CALL STACK:
Each recursive call adds a frame to the stack
Base case returns first, then each frame returns in reverse order`,
      exercises: [
        `EXERCISE 1: Trace Recursive Execution
Trace factorial(4) on paper:
factorial(4) = 4 * factorial(3)
             = 4 * 3 * factorial(2)
             = 4 * 3 * 2 * factorial(1)
             = 4 * 3 * 2 * 1 * factorial(0)
             = 4 * 3 * 2 * 1 * 1
             = 24

Now implement and trace:
def power(base, exp):
    """Calculate base^exp recursively"""
    # Base case: anything^0 = 1
    # Recursive case: base^exp = base * base^(exp-1)`,

        `EXERCISE 2: Apply Pólya to Recursive Problems
PROBLEM: "Sum numbers from 1 to n recursively"

UNDERSTAND: sum(5) = 5 + 4 + 3 + 2 + 1 = 15
PLAN: sum(n) = n + sum(n-1), base case: sum(0) = 0
EXECUTE:
def sum_to_n(n):
    if n == 0:
        return 0
    else:
        return n + sum_to_n(n-1)

REVIEW: Trace sum_to_n(3) on paper

Now YOU solve:
def sum_digits_recursive(n):
    """Sum digits of n recursively"""
    # Base case: n < 10, return n
    # Recursive: (n % 10) + sum_digits_recursive(n // 10)`,

        `EXERCISE 3: Iteration vs Recursion
Compare these approaches:

# Iterative factorial
def factorial_iter(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

# Recursive factorial (already shown above)

Implement BOTH versions for:
1. def fibonacci_iter(n): # F(n) = F(n-1) + F(n-2)
2. def fibonacci_rec(n):

3. def gcd_iter(a, b): # greatest common divisor
4. def gcd_rec(a, b):   # Hint: Euclidean algorithm

Compare: Which is more intuitive? Which is more efficient?`
      ], 
      deliverable: "Python file with recursive implementations: countdown, factorial, power, sum_to_n, sum_digits, fibonacci (both), gcd (both). Include trace comments showing call stack.",
      objective: "Understand recursion fundamentals and recognize when to use recursion vs iteration"
    },

    { 
      day: 9, 
      title: "Lists & List Processing", 
      readings: [
        "Think Python (PDF): Ch. 10 - Lists (pp. 93-106)"
      ],
      theory: `LISTS (Think Python Ch. 10):
- List: sequence of values
- Elements can be any type
- Mutable: can be modified

OPERATIONS:
numbers = [1, 2, 3, 4, 5]
numbers[0]        # Access: 1
numbers[1:3]      # Slice: [2, 3]
numbers.append(6) # Add to end
numbers.extend([7, 8]) # Add multiple
numbers.pop()     # Remove and return last
numbers.remove(3) # Remove specific value
len(numbers)      # Length
sum(numbers)      # Sum
max(numbers)      # Maximum

LIST TRAVERSAL:
for num in numbers:
    print(num)`,
      exercises: [
        `EXERCISE 1: List Operations Practice
def list_basics():
    """Practice basic list operations"""
    fruits = ['apple', 'banana', 'cherry']
    
    # Add 'date' to the end
    # Insert 'apricot' at index 1
    # Remove 'banana'
    # Print the list
    
def make_list(n):
    """Create list of numbers 1 to n"""
    result = []
    for i in range(1, n + 1):
        result.append(i)
    return result
    # Alternative: return list(range(1, n + 1))`,

        `EXERCISE 2: List Processing with Pólya
PROBLEM: "Double each element in a list"

UNDERSTAND: [1, 2, 3] → [2, 4, 6]
PLAN: Create new list, multiply each element by 2
EXECUTE:
def double_list(numbers):
    result = []
    for num in numbers:
        result.append(num * 2)
    return result
    # Alternative: return [num * 2 for num in numbers]

REVIEW: Test with [1, 2, 3], [-1, 0, 1], []

Now YOU solve:
def filter_positive(numbers):
    """Return new list with only positive numbers"""
    
def squares(numbers):
    """Return list of squares of each number"""`,

        `EXERCISE 3: Advanced List Operations
def reverse_list(items):
    """Reverse a list WITHOUT using built-in reverse()"""
    # Method 1: Create new list backwards
    result = []
    for i in range(len(items) - 1, -1, -1):
        result.append(items[i])
    return result
    # Method 2: Use slicing (items[::-1])

def find_max(numbers):
    """Find maximum WITHOUT using max()"""
    # DECOMPOSE:
    # - Assume first element is max
    # - Compare with each other element
    # - Update max if we find larger
    
def remove_duplicates(items):
    """Return list with duplicates removed, preserving order"""
    # Hint: use a helper list to track what you've seen`
      ], 
      deliverable: "Python file with list operations: double_list, filter_positive, squares, reverse_list, find_max, remove_duplicates",
      objective: "Master list manipulation and processing patterns"
    },

    { 
      day: 10, 
      title: "Dictionaries - Key-Value Power", 
      readings: [
        "Think Python (PDF): Ch. 11 - Dictionaries (pp. 107-116)"
      ],
      theory: `DICTIONARIES (Think Python Ch. 11):
- Mapping from keys to values
- Keys must be immutable (strings, numbers, tuples)
- Values can be any type

OPERATIONS:
phonebook = {'Alice': '555-1234', 'Bob': '555-5678'}
phonebook['Alice']      # Access: '555-1234'
phonebook['Charlie'] = '555-9999'  # Add/update
del phonebook['Bob']    # Remove
'Alice' in phonebook    # Check key exists
phonebook.keys()        # All keys
phonebook.values()      # All values
phonebook.items()       # Key-value pairs

COUNTING PATTERN:
counts = {}
for item in items:
    counts[item] = counts.get(item, 0) + 1`,
      exercises: [
        `EXERCISE 1: Dictionary Basics
def create_gradebook():
    """Create and manipulate a gradebook"""
    grades = {}
    
    # Add students and grades
    grades['Alice'] = 95
    grades['Bob'] = 87
    grades['Charlie'] = 92
    
    # Update Bob's grade to 90
    # Add new student Diana with 88
    # Print all students and their grades
    # Calculate and print average grade

def invert_dict(d):
    """Swap keys and values"""
    # {'a': 1, 'b': 2} → {1: 'a', 2: 'b'}`,

        `EXERCISE 2: Frequency Counting
PROBLEM: "Count how many times each word appears in a text"

UNDERSTAND: "apple orange apple" → {'apple': 2, 'orange': 1}
PLAN: Loop through words, increment count for each
EXECUTE:
def word_frequency(text):
    words = text.lower().split()
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts

REVIEW: Test with sample texts

Now YOU solve:
def letter_frequency(text):
    """Count frequency of each letter (ignore case, spaces)"""
    
def most_common(frequency_dict):
    """Return the key with highest value"""`,

        `EXERCISE 3: Dictionary Applications
def histogram(s):
    """Create histogram of character frequencies"""
    d = {}
    for c in s:
        d[c] = d.get(c, 0) + 1
    return d

def reverse_lookup(d, value):
    """Find key that maps to value"""
    # Raise error if value not found
    # What if multiple keys have same value?

def merge_dicts(d1, d2):
    """Merge two dictionaries"""
    # If key exists in both, add the values
    # Example: {' a': 1, 'b': 2} + {'b': 3, 'c': 4} → {'a': 1, 'b': 5, 'c': 4}`
      ], 
      deliverable: "Python file with dictionary programs: gradebook, word_frequency, letter_frequency, histogram, reverse_lookup, merge_dicts",
      objective: "Master dictionaries for counting, lookup, and mapping problems"
    },

    { 
      day: 11, 
      title: "Tuples & Data Structures", 
      readings: [
        "Think Python (PDF): Ch. 12 - Tuples (pp. 117-126)"
      ],
      theory: `TUPLES (Think Python Ch. 12):
- Immutable sequence (can't be modified)
- Like lists but can't change after creation
- Often used for grouped data

OPERATIONS:
point = (3, 4)
x, y = point          # Tuple unpacking
point[0]              # Access: 3
len(point)            # Length: 2

COMPARING SEQUENCES:
Tuples compared element by element
(1, 2) < (1, 3)      # True
(1, 2, 3) < (1, 2)   # False

TUPLE AS DICT KEY:
locations = {(0, 0): 'origin', (1, 0): 'east'}

COMMON PATTERN - RETURN MULTIPLE VALUES:
def min_max(numbers):
    return (min(numbers), max(numbers))
minimum, maximum = min_max([1, 5, 3, 9, 2])`,
      exercises: [
        `EXERCISE 1: Tuples and Unpacking
def swap(a, b):
    """Swap two values using tuple unpacking"""
    return b, a

def distance(point1, point2):
    """Calculate distance between two points"""
    # point1 = (x1, y1), point2 = (x2, y2)
    x1, y1 = point1
    x2, y2 = point2
    # Use distance formula: √[(x2-x1)² + (y2-y1)²]
    
def midpoint(point1, point2):
    """Find midpoint between two points"""
    # Midpoint = ((x1+x2)/2, (y1+y2)/2)`,

        `EXERCISE 2: DSU (Decorate-Sort-Undecorate)
PROBLEM: "Sort words by length, not alphabetically"

UNDERSTAND: ['apple', 'pie', 'cherry'] → ['pie', 'apple', 'cherry']
PLAN: Decorate with length, sort, remove decoration
EXECUTE:
def sort_by_length(words):
    # Decorate: create list of (len, word) tuples
    decorated = []
    for word in words:
        decorated.append((len(word), word))
    
    # Sort: tuples sort by first element
    decorated.sort()
    
    # Undecorate: extract words
    result = []
    for length, word in decorated:
        result.append(word)
    return result

Now YOU solve:
def sort_by_last_char(words):
    """Sort words by their last character"""`,

        `EXERCISE 3: Advanced Tuple Applications
def most_common_words(text, n=10):
    """Return n most common words as list of (count, word) tuples"""
    # DECOMPOSE:
    # 1. Create frequency dict (from Day 10)
    # 2. Convert to list of (count, word) tuples
    # 3. Sort in reverse order (most common first)
    # 4. Return first n items
    
def group_by_length(words):
    """Return dict mapping length to list of words"""
    # {3: ['cat', 'dog'], 4: ['bird', 'fish'], ...}
    
def zip_lists(list1, list2):
    """Combine two lists into list of tuples"""
    # [1, 2, 3] and ['a', 'b', 'c'] → [(1, 'a'), (2, 'b'), (3, 'c')]
    # Built-in: zip(list1, list2)`
      ], 
      deliverable: "Python file with tuple programs: swap, distance, sort_by_length, most_common_words, group_by_length, zip_lists",
      objective: "Master tuples for immutable data and sophisticated sorting patterns"
    },

    { 
      day: 12, 
      title: "Files & Persistence", 
      readings: [
        "Think Python (PDF): Ch. 14 - Files (pp. 139-148)"
      ],
      theory: `FILES (Think Python Ch. 14):
- Persistent storage: data survives after program ends
- Text files vs binary files
- Reading and writing

READING:
fin = open('input.txt', 'r')
for line in fin:
    print(line)
fin.close()

# Better: automatic close
with open('input.txt', 'r') as fin:
    content = fin.read()    # Read entire file
    lines = fin.readlines() # Read as list of lines

WRITING:
with open('output.txt', 'w') as fout:
    fout.write('Hello, World!\\n')`,
      exercises: [
        `EXERCISE 1: File Reading
def count_lines(filename):
    """Count lines in a file"""
    with open(filename, 'r') as f:
        count = 0
        for line in f:
            count += 1
    return count
    # Alternative: len(f.readlines())

def count_words_in_file(filename):
    """Count total words in file"""
    # Read each line, split into words, count
    
def find_in_file(filename, search_term):
    """Return line numbers containing search_term"""
    # Return list of line numbers (1-indexed)`,

        `EXERCISE 2: File Writing with Pólya
PROBLEM: "Create a program that logs user activities to a file"

UNDERSTAND: Append timestamped entries to log file
PLAN: 
- Get activity description from user
- Add timestamp
- Append to log file
EXECUTE:
import datetime

def log_activity(activity, logfile='activity.log'):
    timestamp = datetime.datetime.now()
    entry = f"{timestamp}: {activity}\\n"
    with open(logfile, 'a') as f:  # 'a' for append
        f.write(entry)

Now YOU build:
def create_backup(filename):
    """Create backup copy of file"""
    # Read original, write to filename + '.bak'`,

        `EXERCISE 3: Data Processing
def word_frequency_from_file(filename):
    """Create word frequency dict from file"""
    # Combine file reading with dictionary counting
    # Convert to lowercase, remove punctuation
    # Return dict of {word: count}
    
def filter_long_words(input_file, output_file, min_length=5):
    """Copy only words longer than min_length"""
    # Read from input_file
    # Write qualifying words to output_file
    # One word per line
    
def csv_to_dict(filename):
    """Read CSV file into list of dictionaries"""
    # First line is headers
    # Each subsequent line is a record
    # Return list of dicts with header keys`
      ], 
      deliverable: "Python file with file operations: count_lines, log_activity, word_frequency_from_file, filter_long_words, csv_to_dict. Create test files to demonstrate.",
      objective: "Master file I/O for data persistence and processing"
    },

    { 
      day: 13, 
      title: "Classes & Object-Oriented Thinking", 
      readings: [
        "Think Python (PDF): Ch. 15 - Classes and Objects (pp. 149-156)",
        "Think Python (PDF): Ch. 16 - Classes and Functions (pp. 157-164)"
      ],
      theory: `CLASSES (Think Python Ch. 15-16):
- Class: template for creating objects
- Object: instance of a class
- Attributes: data associated with object
- Methods: functions associated with class

DEFINING A CLASS:
class Point:
    """Represents a point in 2D space"""
    
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y
    
    def distance_from_origin(self):
        return (self.x**2 + self.y**2)**0.5

# Using the class:
p = Point(3, 4)
print(p.distance_from_origin())  # 5.0`,
      exercises: [
        `EXERCISE 1: Create Your First Class
class Rectangle:
    """Represents a rectangle"""
    
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)
    
    def is_square(self):
        return self.width == self.height

# Test it:
r = Rectangle(5, 10)
print(r.area())      # 50
print(r.perimeter()) # 30

Now YOU create:
class Circle:
    """Attributes: radius. Methods: area, circumference, diameter"""`,

        `EXERCISE 2: Apply Pólya to OOP
PROBLEM: "Create a BankAccount class"

UNDERSTAND: Need to track balance, allow deposits/withdrawals
PLAN:
- Attributes: account_number, balance, owner_name
- Methods: deposit(), withdraw(), get_balance()
- Validation: can't withdraw more than balance

EXECUTE:
class BankAccount:
    def __init__(self, owner, account_number, initial_balance=0):
        self.owner = owner
        self.account_number = account_number
        self.balance = initial_balance
    
    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            return True
        return False
    
    # YOU complete: withdraw(), get_balance(), __str__()

REVIEW: Test edge cases (negative amounts, overdraft)`,

        `EXERCISE 3: Real-World Classes
class Student:
    """Track student information and grades"""
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.grades = []
    
    def add_grade(self, grade):
        # Add grade to list
    
    def average(self):
        # Return average grade
    
    def letter_grade(self):
        # Convert average to letter (A, B, C, D, F)

class TodoList:
    """Manage a to-do list"""
    # Attributes: tasks (list of dictionaries)
    # Methods: add_task(), complete_task(), list_pending(), list_completed()`
      ], 
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
      theory: `LOOKING BACK (Pólya Part IV):
- Can you check the result?
- Can you derive the result differently?
- Can you use the result or method for another problem?
- What did you learn?

INTEGRATION PRINCIPLES:
- Combine all learned concepts
- Build something meaningful
- Test thoroughly
- Reflect on the process`,
      exercises: [
        `PROJECT: Personal Library Management System
Build a complete library system using OOP and file persistence.

PART 1: Core Classes
class Book:
    """Attributes: title, author, isbn, year, genre
    Methods: __init__(), __str__(), to_dict(), from_dict()"""

class Library:
    """Attributes: books (list), name
    Methods:
    - add_book(book)
    - remove_book(isbn)
    - find_by_title(title)
    - find_by_author(author)
    - list_all_books()
    - books_by_genre(genre)
    """`,

        `PART 2: File Persistence
Extend Library class:
def save_to_file(self, filename):
    """Save library to JSON file"""
    # Convert each book to dict
    # Write to file
    
def load_from_file(self, filename):
    """Load library from JSON file"""
    # Read file
    # Create Book objects from dictionaries
    # Add to library

PART 3: Statistics & Analysis
def library_stats(self):
    """Return dictionary with:
    - total_books
    - books_by_genre (count per genre)
    - books_by_author (count per author)
    - oldest_book
    - newest_book
    - most_prolific_author
    """`,

        `PART 4: Interactive Interface
def main():
    """Menu-driven program:
    1. Add new book
    2. Remove book
    3. Search books
    4. List all books
    5. Show statistics
    6. Save library
    7. Load library
    8. Exit
    
    Use input() for user interaction
    Validate all inputs
    Handle errors gracefully
    """

PART 5: Testing & Documentation
Create test_library.py:
- Test each method
- Test edge cases (empty library, duplicate ISBNs)
- Test file persistence
- Document your process in journal

REFLECTION:
- What problems did you encounter?
- How did Pólya's method help?
- What would you improve?
- What did you learn about OOP?`
      ], 
      deliverable: "Complete Library Management System with Book and Library classes, file persistence, statistics, interactive menu, and comprehensive testing. Journal entry reflecting on the project.",
      objective: "Integrate Week 2 skills (recursion, lists, dicts, tuples, files, classes) into a professional application"
    },


    // WEEK 3: Algorithms - Search, Sort, & Big O
    { 
      day: 15, 
      title: "Big O Notation & Algorithm Analysis", 
      readings: [
        "Grokking Algorithms (PDF): Ch. 1 - Introduction to Algorithms (pp. 1-18)"
      ],
      theory: `BIG O NOTATION (Grokking Algorithms Ch. 1):
Describes how the running time of an algorithm grows as input size increases

COMMON BIG O RUN TIMES:
O(1) - Constant time: doesn't depend on input size
O(log n) - Logarithmic: binary search
O(n) - Linear: simple search
O(n * log n) - Quick sort (average case)
O(n²) - Slow: selection sort
O(n!) - Very slow: traveling salesperson

EXAMPLE:
Simple search: O(n) - check each item once
Binary search: O(log n) - eliminate half each time

Log₂(100) ≈ 7 steps vs 100 steps for linear search!`,
      exercises: [
        `EXERCISE 1: Understand Big O Growth
Calculate steps for different input sizes:

Input  | O(1) | O(log n) | O(n) | O(n²)
-------|------|----------|------|-------
10     |  1   |    3     |  10  |  100
100    |  1   |    7     | 100  | 10,000
1,000  |  1   |   10     | 1000 | 1,000,000

Now analyze these functions:
def get_first(lst):
    return lst[0]  # O(?) Why?
    
def print_all(lst):
    for item in lst:
        print(item)  # O(?) Why?

def print_pairs(lst):
    for i in lst:
        for j in lst:
            print(i, j)  # O(?) Why?`,

        `EXERCISE 2: Apply Pólya to Algorithm Analysis
PROBLEM: "What's the Big O of this function?"

def contains_duplicate(lst):
    for i in range(len(lst)):
        for j in range(i + 1, len(lst)):
            if lst[i] == lst[j]:
                return True
    return False

UNDERSTAND: Two nested loops checking all pairs
PLAN: Count operations - outer loop n times, inner loop n-1, n-2, ...
EXECUTE: Total comparisons ≈ n²/2
ANSWER: O(n²) - quadratic time

Now YOU analyze:
def better_contains_duplicate(lst):
    seen = set()
    for item in lst:
        if item in seen:
            return True
        seen.add(item)
    return False
# What's the Big O? How is it better?`,

        `EXERCISE 3: Compare Algorithm Efficiency
Implement and time these approaches to find if item exists:

def linear_search(lst, target):
    """Check each item: O(n)"""
    for item in lst:
        if item == target:
            return True
    return False

def set_search(lst, target):
    """Convert to set first: O(n) setup, O(1) lookup"""
    s = set(lst)
    return target in s

# Test with lists of different sizes (10, 100, 1000, 10000)
# Which is faster for one-time searches?
# Which is faster if searching multiple items?`
      ], 
      deliverable: "Python file analyzing Big O of various functions. Document with comments explaining the analysis. Include timing experiments.",
      objective: "Understand Big O notation and analyze algorithm efficiency"
    },

    { 
      day: 16, 
      title: "Binary Search - Logarithmic Power", 
      readings: [
        "Grokking Algorithms (PDF): Ch. 1 - Binary Search (pp. 3-11)"
      ],
      theory: `BINARY SEARCH (Grokking Algorithms Ch. 1):
- Works ONLY on sorted lists
- Eliminates half the remaining items each step
- O(log n) - much faster than linear search O(n)

ALGORITHM:
1. Start with entire list
2. Check middle element
3. If match, done!
4. If target < middle, search left half
5. If target > middle, search right half
6. Repeat until found or no elements left

EXAMPLE: Find 7 in [1, 3, 5, 7, 9, 11, 13]
Step 1: Check middle (7) - Found!

Find 11:
Step 1: Check 7 - too small, search right half [9, 11, 13]
Step 2: Check 11 - Found!`,
      exercises: [
        `EXERCISE 1: Implement Binary Search
def binary_search(lst, target):
    """Return index of target in sorted lst, or None"""
    low = 0
    high = len(lst) - 1
    
    while low <= high:
        mid = (low + high) // 2
        guess = lst[mid]
        
        if guess == target:
            return mid
        elif guess > target:
            high = mid - 1  # Search left half
        else:
            low = mid + 1   # Search right half
    
    return None  # Not found

# Test it:
numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
print(binary_search(numbers, 7))   # Should return 3
print(binary_search(numbers, 20))  # Should return None`,

        `EXERCISE 2: Trace Binary Search
PROBLEM: Trace binary_search([1, 2, 3, 4, 5, 6, 7, 8, 9], 6)

Step 1: low=0, high=8, mid=4, guess=5, 6>5, search right
Step 2: low=5, high=8, mid=6, guess=7, 6<7, search left  
Step 3: low=5, high=5, mid=5, guess=6, Found! Return 5

Now YOU trace:
1. binary_search([1, 3, 5, 7, 9], 3)
2. binary_search([1, 3, 5, 7, 9], 10)

Write the steps for each.`,

        `EXERCISE 3: Binary Search Variations
def binary_search_first_occurrence(lst, target):
    """Find FIRST occurrence of target in sorted list with duplicates"""
    # [1, 2, 3, 3, 3, 4, 5] target=3 should return index 2
    # Modify binary search to continue searching left even after finding
    
def binary_search_insertion_point(lst, target):
    """Find where target should be inserted to keep list sorted"""
    # [1, 3, 5, 7], target=4 should return 2
    # This is where you'd insert 4: [1, 3, 4, 5, 7]
    
def sqrt_binary_search(n, precision=0.001):
    """Find square root using binary search"""
    # Search between 0 and n for value where value² ≈ n
    # Example: sqrt_binary_search(16) ≈ 4.0`
      ], 
      deliverable: "Python file with binary_search, traced examples, and three variations. Test each thoroughly.",
      objective: "Master binary search and understand logarithmic time complexity"
    },

    { 
      day: 17, 
      title: "Selection Sort - O(n²) Sorting", 
      readings: [
        "Grokking Algorithms (PDF): Ch. 2 - Selection Sort (pp. 19-34)"
      ],
      theory: `SELECTION SORT (Grokking Algorithms Ch. 2):
1. Find the smallest item in array
2. Move it to the front (swap with first element)
3. Find the second-smallest item
4. Move it to position 2
5. Continue until array is sorted

TIME COMPLEXITY: O(n²)
- First pass: check n elements
- Second pass: check n-1 elements
- Third pass: check n-2 elements
- Total: n + (n-1) + (n-2) + ... + 1 = n²/2 ≈ O(n²)

EXAMPLE: [5, 3, 6, 2, 10]
Pass 1: Find min (2), swap with first: [2, 3, 6, 5, 10]
Pass 2: Find min (3), already in place: [2, 3, 6, 5, 10]
Pass 3: Find min (5), swap: [2, 3, 5, 6, 10]
Pass 4: Find min (6), already in place: [2, 3, 5, 6, 10]
Done!`,
      exercises: [
        `EXERCISE 1: Implement Selection Sort
def find_smallest(arr):
    """Find index of smallest element"""
    smallest = arr[0]
    smallest_index = 0
    for i in range(1, len(arr)):
        if arr[i] < smallest:
            smallest = arr[i]
            smallest_index = i
    return smallest_index

def selection_sort(arr):
    """Sort array using selection sort"""
    sorted_arr = []
    # Make a copy to avoid modifying original
    arr_copy = arr[:]
    
    for i in range(len(arr_copy)):
        # Find smallest in remaining elements
        smallest_idx = find_smallest(arr_copy)
        # Remove and add to sorted array
        sorted_arr.append(arr_copy.pop(smallest_idx))
    
    return sorted_arr

# Test it:
print(selection_sort([5, 3, 6, 2, 10]))`,

        `EXERCISE 2: In-Place Selection Sort
PROBLEM: Sort without creating new array

def selection_sort_inplace(arr):
    """Sort array in place - modifies original array"""
    for i in range(len(arr)):
        # Find minimum in remaining unsorted portion
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        
        # Swap minimum to position i
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    
    return arr

# Compare: This uses O(1) extra space vs O(n) for first version`,

        `EXERCISE 3: Selection Sort Analysis & Variations
def selection_sort_traced(arr):
    """Selection sort with step-by-step output"""
    arr = arr[:]  # Make copy
    print(f"Original: {arr}")
    
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
        print(f"After pass {i+1}: {arr}")
    
    return arr

# Count comparisons and swaps for different input sizes
# Create visualization showing quadratic growth`
      ], 
      deliverable: "Python file with selection sort implementations, traced execution, and performance analysis documenting O(n²) behavior.",
      objective: "Understand selection sort and quadratic time complexity"
    },

    { 
      day: 18, 
      title: "Recursion Deep Dive", 
      readings: [
        "Grokking Algorithms (PDF): Ch. 3 - Recursion (pp. 35-48)"
      ],
      theory: `RECURSION (Grokking Algorithms Ch. 3):
Every recursive function has:
1. BASE CASE: When to stop
2. RECURSIVE CASE: Function calls itself

THE CALL STACK:
Computer uses a stack to track function calls
Each call adds a frame to the stack
Base case returns, frames pop off in reverse

EXAMPLE - Factorial:
fact(3) → 3 * fact(2)
        → 3 * 2 * fact(1)
        → 3 * 2 * 1 * fact(0)
        → 3 * 2 * 1 * 1
        → 6

STACK FRAMES:
fact(3): waiting for fact(2)
fact(2): waiting for fact(1)
fact(1): waiting for fact(0)
fact(0): returns 1 ← BASE CASE
Then each returns in reverse`,
      exercises: [
        `EXERCISE 1: Visualize Call Stack
def countdown(i):
    print(f"countdown({i})")
    if i <= 0:           # Base case
        print("Base case reached!")
        return
    else:               # Recursive case
        countdown(i-1)
        print(f"After countdown({i-1}) in countdown({i})")

# Call countdown(3) and trace the stack:
# Stack builds: countdown(3) → countdown(2) → countdown(1) → countdown(0)
# Then unwinds: countdown(0) returns → countdown(1) → countdown(2) → countdown(3)

Now implement with visualization:
def sum_recursive(arr):
    """Sum array recursively"""
    # Base case: empty array
    # Recursive: first element + sum(rest)`,

        `EXERCISE 2: Apply Pólya to Recursive Problems
PROBLEM: "Count items in a list recursively"

UNDERSTAND: count([1, 2, 3]) = 3
PLAN: Base case - empty list = 0
      Recursive - 1 + count(rest of list)
EXECUTE:
def count(lst):
    if not lst:  # Empty list
        return 0
    return 1 + count(lst[1:])  # 1 + count of rest

REVIEW: Trace count([1, 2, 3])
count([1,2,3]) = 1 + count([2,3])
               = 1 + 1 + count([3])
               = 1 + 1 + 1 + count([])
               = 1 + 1 + 1 + 0 = 3

Now YOU solve:
def max_recursive(lst):
    """Find maximum in list recursively"""
    # Hint: compare first element with max of rest`,

        `EXERCISE 3: Recursive Problem Set
def reverse_string_rec(s):
    """Reverse string recursively"""
    # Base: empty string or single char
    # Recursive: last char + reverse(all but last)
    
def is_palindrome_rec(s):
    """Check palindrome recursively"""
    # Base: 0 or 1 chars = True
    # Recursive: first == last AND middle is palindrome
    
def binary_search_rec(lst, target, low=0, high=None):
    """Binary search using recursion"""
    if high is None:
        high = len(lst) - 1
    
    # Base case: not found
    if low > high:
        return None
    
    # Check middle
    mid = (low + high) // 2
    if lst[mid] == target:
        return mid
    elif lst[mid] > target:
        # Recursive: search left half
    else:
        # Recursive: search right half`
      ], 
      deliverable: "Python file with recursive functions: countdown with stack visualization, count, max_recursive, reverse_string, is_palindrome, binary_search (recursive). Include call stack diagrams in comments.",
      objective: "Master recursion and understand the call stack deeply"
    },

    { 
      day: 19, 
      title: "Quicksort - Divide and Conquer", 
      readings: [
        "Grokking Algorithms (PDF): Ch. 4 - Quicksort (pp. 49-64)"
      ],
      theory: `QUICKSORT (Grokking Algorithms Ch. 4):
Divide and conquer strategy:
1. Pick a pivot element
2. Partition: elements < pivot, pivot, elements > pivot
3. Recursively sort the two partitions

BASE CASE: Array with 0 or 1 elements (already sorted)

EXAMPLE: [3, 5, 2, 1, 4]
Pick pivot: 3
Partition: [2, 1] + [3] + [5, 4]
Recurse on [2, 1]: [1] + [2] + [] = [1, 2]
Recurse on [5, 4]: [4] + [5] + [] = [4, 5]
Result: [1, 2, 3, 4, 5]

TIME COMPLEXITY:
Best/Average: O(n log n)
Worst: O(n²) - rare, when pivot is always smallest/largest`,
      exercises: [
        `EXERCISE 1: Implement Quicksort
def quicksort(arr):
    """Sort using quicksort - recursive divide and conquer"""
    # Base case
    if len(arr) < 2:
        return arr
    
    # Recursive case
    pivot = arr[0]
    
    # Partition into three parts
    less = [i for i in arr[1:] if i <= pivot]
    greater = [i for i in arr[1:] if i > pivot]
    
    # Recursively sort and combine
    return quicksort(less) + [pivot] + quicksort(greater)

# Test it:
print(quicksort([10, 5, 2, 3, 7, 6, 1, 8]))`,

        `EXERCISE 2: Trace Quicksort Execution
PROBLEM: Trace quicksort([3, 1, 4, 2])

Call 1: quicksort([3, 1, 4, 2])
  pivot = 3
  less = [1, 2]
  greater = [4]
  
Call 2: quicksort([1, 2])
  pivot = 1
  less = []
  greater = [2]
  
Call 3: quicksort([])  # Base case, returns []
Call 4: quicksort([2])  # Base case, returns [2]
  Returns: [] + [1] + [2] = [1, 2]

Call 5: quicksort([4])  # Base case, returns [4]

Final: [1, 2] + [3] + [4] = [1, 2, 3, 4]

Now YOU trace: quicksort([5, 2, 8, 1, 9])`,

        `EXERCISE 3: Quicksort Analysis
def quicksort_traced(arr, depth=0):
    """Quicksort with visualization of recursive calls"""
    indent = "  " * depth
    print(f"{indent}quicksort({arr})")
    
    if len(arr) < 2:
        print(f"{indent}→ Base case: {arr}")
        return arr
    
    pivot = arr[0]
    less = [i for i in arr[1:] if i <= pivot]
    greater = [i for i in arr[1:] if i > pivot]
    
    print(f"{indent}Pivot: {pivot}, Less: {less}, Greater: {greater}")
    
    result = (quicksort_traced(less, depth+1) + 
              [pivot] + 
              quicksort_traced(greater, depth+1))
    
    print(f"{indent}→ Result: {result}")
    return result

# Compare with selection sort: which is faster for large arrays?`
      ], 
      deliverable: "Python file with quicksort implementation, traced execution, and comparison with selection sort. Document Big O analysis.",
      objective: "Master quicksort and understand divide-and-conquer strategy"
    },

    { 
      day: 20, 
      title: "Hash Tables - O(1) Lookups", 
      readings: [
        "Grokking Algorithms (PDF): Ch. 5 - Hash Tables (pp. 65-82)"
      ],
      theory: `HASH TABLES (Grokking Algorithms Ch. 5):
- Maps keys to values using a hash function
- Average case: O(1) for insert, lookup, delete
- Python dict is a hash table!

HASH FUNCTION:
- Takes a key and returns an index
- Same key always maps to same index
- Different keys should map to different indices

COLLISIONS:
When two keys hash to same index
Solution: Store a list at each index

USE CASES:
- Lookups: phone book, DNS
- Preventing duplicates
- Caching/memoization`,
      exercises: [
        `EXERCISE 1: Using Hash Tables (Dicts)
def hash_table_basics():
    """Demonstrate hash table operations"""
    # Create a phone book
    phone_book = {}
    phone_book["Alice"] = "555-1234"
    phone_book["Bob"] = "555-5678"
    
    # Lookup: O(1)
    print(phone_book["Alice"])
    
    # Check if key exists: O(1)
    if "Alice" in phone_book:
        print("Found!")
    
    # Delete: O(1)
    del phone_book["Bob"]

def voted(name, voters={}):
    """Prevent duplicate voting using hash table"""
    if name in voters:
        print("Already voted!")
        return False
    else:
        voters[name] = True
        print("Vote recorded!")
        return True`,

        `EXERCISE 2: Hash Table Applications
def word_count(text):
    """Count word frequency using hash table"""
    words = text.lower().split()
    counts = {}
    
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    
    return counts

def find_duplicates(lst):
    """Find duplicate elements using hash table"""
    # O(n) with hash table vs O(n²) with nested loops
    seen = {}
    duplicates = []
    
    for item in lst:
        if item in seen:
            if item not in duplicates:
                duplicates.append(item)
        else:
            seen[item] = True
    
    return duplicates

def two_sum(numbers, target):
    """Find two numbers that add up to target"""
    # Brute force: O(n²)
    # Hash table: O(n)
    seen = {}
    for i, num in enumerate(numbers):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return None`,

        `EXERCISE 3: Caching with Hash Tables
def fibonacci_cached(n, cache={}):
    """Fibonacci with memoization using hash table"""
    if n in cache:
        return cache[n]
    
    if n <= 1:
        return n
    
    result = fibonacci_cached(n-1, cache) + fibonacci_cached(n-2, cache)
    cache[n] = result
    return result

# Compare performance:
# fibonacci_naive(35) - very slow
# fibonacci_cached(35) - instant!

def get_page_cached(url, cache={}):
    """Simulate web page caching"""
    if url in cache:
        print("Returning cached data")
        return cache[url]
    else:
        print("Fetching from web...")
        data = f"Content of {url}"  # Simulate fetch
        cache[url] = data
        return data`
      ], 
      deliverable: "Python file with hash table applications: word_count, find_duplicates, two_sum, fibonacci_cached. Compare performance with and without hash tables.",
      objective: "Master hash tables for O(1) lookups and caching"
    },

    { 
      day: 21, 
      title: "Week 3 Integration Project", 
      readings: [
        "Review Grokking Algorithms Ch. 1-5",
        "How to Solve It (PDF): Dictionary of Heuristics (pp. 251-end)"
      ],
      theory: `HEURISTICS (Pólya's Dictionary):
Problem-solving strategies and techniques:
- Analogy: Have you seen a similar problem?
- Working backwards: Start from the desired result
- Auxiliary elements: Introduce new variables
- Reduction: Solve a simpler version first
- Generalization: Can you solve a broader problem?

INTEGRATION:
Combine multiple algorithms and data structures to solve complex problems`,
      exercises: [
        `PROJECT: Spell Checker & Autocomplete System
Build a intelligent text analysis system using hash tables and algorithms.

PART 1: Dictionary Management
class SpellChecker:
    def __init__(self):
        self.dictionary = set()  # Hash table for O(1) lookup
    
    def load_dictionary(self, filename):
        """Load words from file into hash table"""
        # Read file, add each word to set
    
    def is_valid_word(self, word):
        """Check if word is in dictionary: O(1)"""
        return word.lower() in self.dictionary`,

        `PART 2: Spell Checking
def check_text(self, text):
    """Find misspelled words in text"""
    words = text.split()
    misspelled = []
    
    for word in words:
        # Remove punctuation
        clean_word = word.strip('.,!?;:')
        if not self.is_valid_word(clean_word):
            misspelled.append(word)
    
    return misspelled

PART 3: Suggestions using Edit Distance
def edit_distance(self, word1, word2):
    """Calculate how different two words are"""
    # Simple version: count different characters
    # Advanced: Levenshtein distance
    
def get_suggestions(self, word, max_suggestions=5):
    """Find similar words from dictionary"""
    # Calculate edit distance to all dictionary words
    # Return closest matches
    # Optimization: only check words of similar length`,

        `PART 4: Autocomplete with Prefix Search
def add_word_frequency(self, word, count=1):
    """Track word usage frequency"""
    # Use dict to map word → frequency
    
def autocomplete(self, prefix, max_results=10):
    """Suggest completions for prefix"""
    # Find all words starting with prefix
    # Sort by frequency
    # Return top N results
    # Use binary search if dictionary is sorted

PART 5: Performance Analysis
def benchmark_operations(self):
    """Test and time different operations"""
    # Measure time for:
    # - Dictionary lookup (should be O(1))
    # - Finding suggestions (O(n) where n = dict size)
    # - Autocomplete (depends on implementation)
    
    # Compare with naive approaches (lists instead of hash tables)`
      ], 
      deliverable: "Complete spell checker system with dictionary management, spell checking, suggestions, autocomplete, and performance benchmarks. Journal documenting algorithm choices and trade-offs.",
      objective: "Integrate Week 3 concepts (Big O, binary search, quicksort, recursion, hash tables) into a sophisticated application"
    },


    // WEEK 4: Advanced Algorithms & Problem-Solving Mastery
    { 
      day: 22, 
      title: "Breadth-First Search - Graph Traversal", 
      readings: [
        "Grokking Algorithms (PDF): Ch. 6 - Breadth-First Search (pp. 83-104)"
      ],
      theory: `BREADTH-FIRST SEARCH (Grokking Algorithms Ch. 6):
- Traverses a graph level by level
- Finds shortest path in unweighted graph
- Uses a queue (FIFO - first in, first out)

ALGORITHM:
1. Add starting node to queue
2. While queue not empty:
   - Dequeue a node
   - Check if it's the goal
   - Add all neighbors to queue
3. Mark nodes as visited to avoid loops

GRAPHS:
- Vertices (nodes) and Edges (connections)
- Directed vs Undirected
- Represent using hash table: node → list of neighbors

EXAMPLE - Social Network:
You → [Alice, Bob]
Alice → [Charlie]
Bob → [Charlie, Diana]

Find if You connected to Diana: Yes, path length 2`,
      exercises: [
        `EXERCISE 1: Implement Graph and BFS
from collections import deque

# Represent graph as hash table
graph = {}
graph["you"] = ["alice", "bob", "claire"]
graph["bob"] = ["anuj", "peggy"]
graph["alice"] = ["peggy"]
graph["claire"] = ["thom", "jonny"]
graph["anuj"] = []
graph["peggy"] = []
graph["thom"] = []
graph["jonny"] = []

def bfs(graph, start, goal):
    """Find if path exists from start to goal"""
    queue = deque([start])
    visited = set()
    
    while queue:
        node = queue.popleft()
        
        if node == goal:
            return True
        
        if node not in visited:
            visited.add(node)
            queue.extend(graph.get(node, []))
    
    return False`,

        `EXERCISE 2: Find Shortest Path
def bfs_shortest_path(graph, start, goal):
    """Return shortest path from start to goal"""
    queue = deque([[start]])  # Queue of paths
    visited = set()
    
    while queue:
        path = queue.popleft()
        node = path[-1]  # Current node is last in path
        
        if node == goal:
            return path
        
        if node not in visited:
            visited.add(node)
            
            for neighbor in graph.get(node, []):
                new_path = path + [neighbor]
                queue.append(new_path)
    
    return None  # No path found

# Test it:
# path = bfs_shortest_path(graph, "you", "thom")
# Should return: ["you", "claire", "thom"]`,

        `EXERCISE 3: BFS Applications
def degrees_of_separation(graph, person1, person2):
    """Find degrees of separation (like LinkedIn)"""
    path = bfs_shortest_path(graph, person1, person2)
    if path:
        return len(path) - 1  # Number of edges
    return None

def all_within_distance(graph, start, max_distance):
    """Find all nodes within max_distance from start"""
    # Use BFS but track distance
    # Return dict of {node: distance}
    
def is_bipartite(graph):
    """Check if graph can be colored with 2 colors"""
    # Use BFS to try to color graph
    # If neighbor has same color, not bipartite`
      ], 
      deliverable: "Python file with BFS implementation, shortest path finder, degrees of separation calculator. Create sample social network graph to test.",
      objective: "Master BFS for graph traversal and shortest path problems"
    },

    { 
      day: 23, 
      title: "Dijkstra's Algorithm - Weighted Graphs", 
      readings: [
        "Grokking Algorithms (PDF): Ch. 7 - Dijkstra's Algorithm (pp. 105-126)"
      ],
      theory: `DIJKSTRA'S ALGORITHM (Grokking Algorithms Ch. 7):
- Finds shortest path in WEIGHTED graphs
- Can't handle negative weights
- Uses concept of "cost" to reach each node

ALGORITHM:
1. Track cost to reach each node (start with infinity)
2. Track parent of each node (to reconstruct path)
3. While unprocessed nodes exist:
   - Find cheapest unprocessed node
   - Update costs of its neighbors
   - Mark as processed

EXAMPLE: Find shortest path from Start to Finish
Start → A (weight 6)
Start → B (weight 2)
B → A (weight 3)
B → Finish (weight 5)
A → Finish (weight 1)

Shortest: Start → B → A → Finish (cost: 2 + 3 + 1 = 6)`,
      exercises: [
        `EXERCISE 1: Implement Dijkstra's Algorithm
def dijkstra(graph, costs, parents, start):
    """Find shortest paths from start to all nodes"""
    processed = set()
    
    def find_lowest_cost_node(costs, processed):
        """Find unprocessed node with lowest cost"""
        lowest_cost = float('inf')
        lowest_node = None
        
        for node in costs:
            cost = costs[node]
            if cost < lowest_cost and node not in processed:
                lowest_cost = cost
                lowest_node = node
        
        return lowest_node
    
    node = find_lowest_cost_node(costs, processed)
    
    while node is not None:
        cost = costs[node]
        neighbors = graph[node]
        
        for neighbor, weight in neighbors.items():
            new_cost = cost + weight
            if new_cost < costs[neighbor]:
                costs[neighbor] = new_cost
                parents[neighbor] = node
        
        processed.add(node)
        node = find_lowest_cost_node(costs, processed)`,

        `EXERCISE 2: Apply Dijkstra to Route Planning
# Graph representation for weighted graph
graph = {}
graph["start"] = {"a": 6, "b": 2}
graph["a"] = {"finish": 1}
graph["b"] = {"a": 3, "finish": 5}
graph["finish"] = {}

# Costs: how long to get to each node
costs = {}
costs["a"] = 6
costs["b"] = 2
costs["finish"] = float('inf')

# Parents: track path
parents = {}
parents["a"] = "start"
parents["b"] = "start"
parents["finish"] = None

def reconstruct_path(parents, start, end):
    """Rebuild path from start to end using parents"""
    path = [end]
    while path[-1] != start:
        path.append(parents[path[-1]])
    return list(reversed(path))`,

        `EXERCISE 3: Real-World Applications
def shortest_delivery_route(locations, distances, start, end):
    """Find fastest delivery route"""
    # Build graph from locations and distances
    # Run Dijkstra
    # Return path and total cost
    
def network_latency(servers, latencies, source):
    """Find minimum latency to all servers"""
    # Servers are nodes
    # Latencies are edge weights
    # Return dict of {server: latency}
    
def cheapest_flight(flights, airports, origin, destination):
    """Find cheapest flight path"""
    # flights = [(from, to, price)]
    # Build weighted graph
    # Use Dijkstra to find cheapest route`
      ], 
      deliverable: "Python file with Dijkstra's algorithm implementation, path reconstruction, and route planning applications.",
      objective: "Master Dijkstra's algorithm for weighted shortest path problems"
    },

    { 
      day: 24, 
      title: "Greedy Algorithms", 
      readings: [
        "Grokking Algorithms (PDF): Ch. 8 - Greedy Algorithms (pp. 127-140)"
      ],
      theory: `GREEDY ALGORITHMS (Grokking Algorithms Ch. 8):
- Make locally optimal choice at each step
- Hope to find global optimum
- Fast but not always correct!

CHARACTERISTICS:
- Simple to implement
- Fast (usually O(n log n) or better)
- May not give optimal solution
- Good for approximation

EXAMPLES:
- Classroom scheduling: pick earliest ending class
- Set covering: pick set covering most items
- Dijkstra's algorithm: pick cheapest node

WHEN TO USE:
- NP-complete problems (exact solution too slow)
- "Good enough" solution acceptable
- Need fast algorithm`,
      exercises: [
        `EXERCISE 1: Classroom Scheduling
def schedule_classes(classes):
    """Schedule maximum number of non-overlapping classes"""
    # classes = [(start_time, end_time), ...]
    # Greedy: always pick class ending earliest
    
    # Sort by end time
    sorted_classes = sorted(classes, key=lambda x: x[1])
    
    schedule = []
    current_end = 0
    
    for start, end in sorted_classes:
        if start >= current_end:
            schedule.append((start, end))
            current_end = end
    
    return schedule

# Test:
classes = [(9, 10), (9:30, 11), (10, 11:30), (11, 12)]
# Should return: [(9, 10), (10, 11:30)]`,

        `EXERCISE 2: Set Covering Problem
def set_cover_greedy(universe, subsets):
    """Approximate solution to set covering"""
    # universe = set of all items to cover
    # subsets = {name: set of items}
    
    covered = set()
    selected = []
    
    while covered != universe:
        # Greedy: pick set covering most uncovered items
        best_set = None
        max_new_coverage = 0
        
        for name, items in subsets.items():
            new_coverage = len(items - covered)
            if new_coverage > max_new_coverage:
                max_new_coverage = new_coverage
                best_set = name
        
        if best_set:
            selected.append(best_set)
            covered |= subsets[best_set]
        else:
            break
    
    return selected`,

        `EXERCISE 3: Greedy Algorithms Practice
def coin_change_greedy(amount, coins):
    """Make change using fewest coins (greedy approach)"""
    # Sort coins descending
    # Always take largest coin possible
    # NOTE: Doesn't always give optimal solution!
    # Example: amount=6, coins=[4, 3, 1]
    # Greedy: 4 + 1 + 1 = 3 coins
    # Optimal: 3 + 3 = 2 coins
    
def huffman_encoding(text):
    """Create Huffman code for text compression"""
    # Greedy: always combine two least frequent characters
    # Build binary tree
    # Shorter codes for more frequent characters
    
def knapsack_greedy(items, capacity):
    """Fractional knapsack (can take fractions of items)"""
    # items = [(value, weight), ...]
    # Greedy: sort by value/weight ratio
    # Take highest ratio items first`
      ], 
      deliverable: "Python file with greedy algorithms: class scheduling, set covering, coin change. Document when greedy works vs when it fails.",
      objective: "Understand greedy algorithms and their trade-offs"
    },

    { 
      day: 25, 
      title: "Dynamic Programming", 
      readings: [
        "Grokking Algorithms (PDF): Ch. 9 - Dynamic Programming (pp. 141-166)"
      ],
      theory: `DYNAMIC PROGRAMMING (Grokking Algorithms Ch. 9):
- Solve complex problems by breaking into subproblems
- Store results of subproblems (memoization)
- Build up solution from smaller solutions

WHEN TO USE:
- Problem has overlapping subproblems
- Problem has optimal substructure
- Need exact optimal solution

APPROACH:
1. Start with smallest subproblems
2. Build up to larger problems
3. Store results in a table
4. Use stored results to solve bigger problems

EXAMPLES:
- Fibonacci with memoization
- Longest common subsequence
- Knapsack problem`,
      exercises: [
        `EXERCISE 1: Knapsack Problem (Dynamic Programming)
def knapsack_dp(items, capacity):
    """0/1 knapsack - take whole item or none"""
    # items = [(value, weight), ...]
    # Find maximum value that fits in capacity
    
    n = len(items)
    # Create DP table
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        value, weight = items[i-1]
        for w in range(capacity + 1):
            # Option 1: Don't take item i
            dp[i][w] = dp[i-1][w]
            
            # Option 2: Take item i (if it fits)
            if weight <= w:
                dp[i][w] = max(dp[i][w], 
                              dp[i-1][w-weight] + value)
    
    return dp[n][capacity]

# Test:
items = [(60, 10), (100, 20), (120, 30)]  # (value, weight)
capacity = 50
# Should return: 220 (items 2 and 3)`,

        `EXERCISE 2: Longest Common Subsequence
def lcs(text1, text2):
    """Find length of longest common subsequence"""
    # "ABCD" and "ACBAD" → "ABD" (length 3)
    
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                # Characters match
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                # Take max of excluding one character
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]

def lcs_string(text1, text2):
    """Return the actual LCS string, not just length"""
    # Backtrack through DP table to reconstruct string`,

        `EXERCISE 3: DP Problem Set
def edit_distance(word1, word2):
    """Minimum edits to transform word1 into word2"""
    # Operations: insert, delete, replace
    # "horse" → "ros" requires 3 edits
    # Build DP table similar to LCS
    
def coin_change_dp(coins, amount):
    """Minimum coins needed for amount (exact solution)"""
    # DP approach guarantees optimal solution
    # Compare with greedy approach
    
def max_subarray_sum(arr):
    """Maximum sum of contiguous subarray (Kadane's algorithm)"""
    # [-2, 1, -3, 4, -1, 2, 1, -5, 4] → 6 ([4, -1, 2, 1])
    # This is DP! Keep track of max_ending_here`
      ], 
      deliverable: "Python file with DP solutions: knapsack, LCS, edit distance, coin change, max subarray. Compare DP with greedy approaches.",
      objective: "Master dynamic programming for optimization problems"
    },

    { 
      day: 26, 
      title: "K-Nearest Neighbors & Machine Learning Intro", 
      readings: [
        "Grokking Algorithms (PDF): Ch. 10 - K-Nearest Neighbors (pp. 167-184)"
      ],
      theory: `K-NEAREST NEIGHBORS (Grokking Algorithms Ch. 10):
- Classification algorithm
- Classify item based on its K nearest neighbors
- "Show me the K most similar items"

HOW IT WORKS:
1. Calculate distance to all items
2. Find K closest items
3. Classify based on majority vote

DISTANCE CALCULATION:
- Euclidean distance: √[(x₁-x₂)² + (y₁-y₂)²]
- For multiple features: √[Σ(feature₁ - feature₂)²]

CHOOSING K:
- Too small: sensitive to noise
- Too large: includes irrelevant neighbors
- Try different values, test performance

APPLICATIONS:
- Recommendation systems (Netflix, Spotify)
- OCR (handwriting recognition)
- Spam filtering`,
      exercises: [
        `EXERCISE 1: Implement KNN
import math

def euclidean_distance(point1, point2):
    """Calculate distance between two points"""
    return math.sqrt(sum((a - b) ** 2 
                        for a, b in zip(point1, point2)))

def knn_classify(train_data, test_point, k=3):
    """Classify test_point using K-nearest neighbors"""
    # train_data = [(features, label), ...]
    # Calculate distances to all training points
    distances = []
    for features, label in train_data:
        dist = euclidean_distance(features, test_point)
        distances.append((dist, label))
    
    # Sort by distance, take K nearest
    distances.sort()
    k_nearest = distances[:k]
    
    # Vote: most common label
    votes = {}
    for dist, label in k_nearest:
        votes[label] = votes.get(label, 0) + 1
    
    return max(votes, key=votes.get)`,

        `EXERCISE 2: Build a Recommendation System
def recommend_movies(user_ratings, target_user, k=5):
    """Recommend movies based on similar users"""
    # user_ratings = {user: {movie: rating}}
    
    # 1. Find K most similar users
    def similarity(user1, user2):
        """Calculate similarity between users"""
        # Find movies both rated
        common = set(user_ratings[user1].keys()) & \
                 set(user_ratings[user2].keys())
        
        if not common:
            return 0
        
        # Calculate distance based on ratings
        diff = sum((user_ratings[user1][movie] - 
                   user_ratings[user2][movie]) ** 2 
                  for movie in common)
        
        return 1 / (1 + diff)  # Convert to similarity
    
    # 2. Get recommendations from similar users
    # 3. Weight by similarity
    # 4. Return top N movies`,

        `EXERCISE 3: Feature Extraction & Normalization
def normalize_features(data):
    """Normalize features to 0-1 range"""
    # Important! Features with larger values dominate distance
    # Example: age (0-100) vs rating (1-5)
    # Normalize so all features have equal weight
    
    # For each feature column:
    # normalized = (value - min) / (max - min)
    
def fruit_classifier(fruits):
    """Classify fruits by size and color"""
    # Features: [size, redness, roundness]
    # Train on known fruits
    # Classify unknown fruit
    
def spam_filter(emails, k=10):
    """Classify emails as spam or not spam"""
    # Features: word frequencies, sender, length, etc.
    # Use KNN to classify new emails`
      ], 
      deliverable: "Python file with KNN implementation, movie recommender, fruit classifier. Include feature normalization and experimentation with different K values.",
      objective: "Understand KNN and basic machine learning concepts"
    },

    { 
      day: 27, 
      title: "Trees & Binary Search Trees", 
      readings: [
        "Think Python (PDF): Review Ch. 16-17 on Classes",
        "Grokking Algorithms: Review all previous chapters"
      ],
      theory: `TREES:
- Hierarchical data structure
- Root node at top
- Each node has children
- Leaf nodes have no children

BINARY TREE:
- Each node has at most 2 children (left and right)

BINARY SEARCH TREE (BST):
- Left child < parent < right child
- Enables fast search: O(log n) average case

OPERATIONS:
- Insert: O(log n) average
- Search: O(log n) average
- Delete: O(log n) average
- Worst case (unbalanced): O(n)`,
      exercises: [
        `EXERCISE 1: Implement Binary Search Tree
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None
    
    def insert(self, value):
        """Insert value into BST"""
        if not self.root:
            self.root = TreeNode(value)
        else:
            self._insert_recursive(self.root, value)
    
    def _insert_recursive(self, node, value):
        if value < node.value:
            if node.left is None:
                node.left = TreeNode(value)
            else:
                self._insert_recursive(node.left, value)
        else:
            if node.right is None:
                node.right = TreeNode(value)
            else:
                self._insert_recursive(node.right, value)`,

        `EXERCISE 2: BST Operations
def search(self, value):
    """Search for value in BST"""
    return self._search_recursive(self.root, value)

def _search_recursive(self, node, value):
    if node is None:
        return False
    if node.value == value:
        return True
    elif value < node.value:
        return self._search_recursive(node.left, value)
    else:
        return self._search_recursive(node.right, value)

def inorder_traversal(self, node):
    """Visit nodes in sorted order"""
    if node:
        self.inorder_traversal(node.left)
        print(node.value)
        self.inorder_traversal(node.right)`,

        `EXERCISE 3: Tree Applications
def find_min(self):
    """Find minimum value (leftmost node)"""
    
def find_max(self):
    """Find maximum value (rightmost node)"""
    
def height(self, node):
    """Calculate height of tree"""
    # Height = longest path from root to leaf
    # Recursively: 1 + max(height(left), height(right))
    
def is_balanced(self):
    """Check if tree is balanced"""
    # Balanced: heights of left and right subtrees differ by ≤ 1`
      ], 
      deliverable: "Python file with BST implementation including insert, search, traversal, min/max, height, balance checking.",
      objective: "Understand tree structures and BST operations"
    },

    { 
      day: 28, 
      title: "Problem-Solving Synthesis", 
      readings: [
        "How to Solve It (PDF): Complete review of all parts",
        "Grokking Algorithms (PDF): Review all chapters"
      ],
      theory: `SYNTHESIS - BRINGING IT ALL TOGETHER:

Pólya's Method:
1. Understand the problem
2. Devise a plan
3. Carry out the plan
4. Look back

Algorithm Toolbox:
- Binary search: O(log n) search
- Quicksort: O(n log n) sorting
- Hash tables: O(1) lookup
- BFS: shortest path (unweighted)
- Dijkstra: shortest path (weighted)
- Greedy: fast approximation
- Dynamic programming: exact optimization
- KNN: classification/recommendation

Choosing the Right Approach:
- Small dataset? Any algorithm works
- Need fast lookup? Hash table
- Need sorted order? BST or sorted array
- Graph problem? BFS or Dijkstra
- Optimization? DP or greedy
- Classification? KNN`,
      exercises: [
        `EXERCISE 1: Problem Classification
For each problem, identify the best algorithm/data structure:

1. "Find if word exists in dictionary of 100,000 words"
   → Hash table (set), O(1) lookup

2. "Find shortest route between cities with flight costs"
   → Dijkstra's algorithm, weighted graph

3. "Recommend products based on purchase history"
   → KNN, find similar customers

4. "Schedule maximum number of meetings in a conference room"
   → Greedy algorithm, sort by end time

5. "Find if two strings are anagrams"
   → Sort both strings and compare, or use hash table

Now YOU classify:
- Find median of sorted arrays
- Autocomplete suggestions
- Detect cycle in linked list
- Maximum profit from stock prices
- Validate balanced parentheses`,

        `EXERCISE 2: Multi-Step Problems
PROBLEM: "Build a search engine for text documents"

DECOMPOSE (Pólya Step 2):
1. Index documents: hash table mapping word → list of documents
2. Search: look up word in hash table
3. Rank results: count word frequency in each document
4. Return top N documents

CHOOSE DATA STRUCTURES:
- Hash table for word index: O(1) lookup
- List for each word's documents
- Heap or sorted list for top N results

IMPLEMENT:
def build_index(documents):
    index = {}
    for doc_id, text in documents:
        for word in text.split():
            word = word.lower()
            if word not in index:
                index[word] = []
            index[word].append(doc_id)
    return index`,

        `EXERCISE 3: Optimization Challenges
PROBLEM: "Given array, find two numbers that sum to target"

APPROACH 1: Brute force O(n²)
for i in range(len(arr)):
    for j in range(i+1, len(arr)):
        if arr[i] + arr[j] == target:
            return [i, j]

APPROACH 2: Hash table O(n)
seen = {}
for i, num in enumerate(arr):
    complement = target - num
    if complement in seen:
        return [seen[complement], i]
    seen[num] = i

ANALYZE:
- Brute force: simple, slow
- Hash table: faster, uses more space
- Trade-off: time vs space

Apply this analysis to:
- Find duplicates in array
- Find longest substring without repeating characters
- Merge sorted arrays`
      ], 
      deliverable: "Journal entry synthesizing all learning. For 10 problems: identify problem type, choose algorithm, explain why, implement solution. Document your decision-making process.",
      objective: "Synthesize all learning to confidently tackle any problem"
    },

    { 
      day: 29, 
      title: "Capstone Project: Multi-Algorithm Application", 
      readings: [
        "Review all PDF books - cherry-pick techniques for your project"
      ],
      theory: `CAPSTONE PROJECT:
Build a comprehensive application using multiple algorithms and data structures.

REQUIREMENTS:
- Use at least 5 different algorithms/data structures
- Solve a real-world problem
- Clean, documented code
- Performance analysis
- User-friendly interface`,
      exercises: [
        `PROJECT OPTION 1: Social Network Analyzer
Build a social network analysis tool.

FEATURES:
1. User Management (Hash Table)
   - Add/remove users
   - Store profiles: O(1) lookup

2. Friend Connections (Graph)
   - Add friendships (undirected edges)
   - Remove friendships

3. Find Connections (BFS)
   - Degrees of separation between users
   - Shortest path between users
   - Find mutual friends

4. Friend Recommendations (KNN or Graph-based)
   - Recommend friends based on mutual friends
   - Calculate similarity scores

5. Community Detection (Graph algorithms)
   - Find clusters of highly connected users
   - Identify influencers (most connections)

6. Data Persistence (Files)
   - Save/load network from file
   - Export statistics`,

        `PROJECT OPTION 2: Route Planning & Navigation
Build a GPS-like route planning system.

FEATURES:
1. Map Representation (Weighted Graph)
   - Cities as nodes
   - Roads as weighted edges (distance/time)
   - Load from file

2. Shortest Path (Dijkstra's Algorithm)
   - Find fastest route between cities
   - Calculate total distance/time
   - Handle one-way streets (directed graph)

3. Multiple Routes (Modified Dijkstra)
   - Find alternative routes
   - Avoid specific roads

4. Points of Interest (Hash Table + Spatial Search)
   - Store POIs: restaurants, hotels, gas stations
   - Find nearest POI using distance calculation
   - Filter by category

5. Route Optimization (DP or Greedy)
   - Traveling salesperson problem
   - Visit multiple destinations
   - Minimize total distance

6. Traffic Simulation (Dynamic updates)
   - Update edge weights based on "traffic"
   - Recalculate routes`,

        `PROJECT OPTION 3: Content Recommendation Engine
Build a recommendation system.

FEATURES:
1. Content Database (Hash Table + BST)
   - Store items (movies/books/products)
   - Fast lookup by ID (hash)
   - Sorted by rating (BST)

2. User Profiles (Hash Table)
   - Track user ratings
   - View history

3. Collaborative Filtering (KNN)
   - Find similar users
   - Recommend based on similar users' preferences
   - Calculate similarity scores

4. Content-Based Filtering (Feature matching)
   - Recommend similar items
   - Match by genre, author, etc.

5. Search & Discovery (Multiple algorithms)
   - Text search (hash table indexing)
   - Sort by various criteria (quicksort)
   - Filter by rating/date/popularity

6. Performance Tracking
   - Measure recommendation accuracy
   - Optimize K value for KNN
   - Compare algorithms`
      ], 
      deliverable: "Complete capstone project with: working code, comprehensive documentation, algorithm analysis, test cases, user guide. 2-page reflection on problem-solving journey.",
      objective: "Demonstrate mastery by building a sophisticated multi-algorithm application"
    },

    { 
      day: 30, 
      title: "Reflection & Next Steps", 
      readings: [
        "How to Solve It (PDF): Dictionary/Appendix - browse problem-solving heuristics",
        "Grokking Algorithms (PDF): Where to Go Next section"
      ],
      theory: `LOOKING BACK ON 30 DAYS:

What You've Learned:
✓ Pólya's problem-solving framework
✓ Python fundamentals
✓ Recursion and thinking recursively
✓ Data structures: lists, dicts, tuples, sets, classes
✓ File I/O and persistence
✓ Algorithm analysis (Big O)
✓ Search: binary search
✓ Sort: selection sort, quicksort
✓ Hash tables for O(1) operations
✓ Graph algorithms: BFS, Dijkstra
✓ Greedy algorithms
✓ Dynamic programming
✓ Machine learning basics: KNN
✓ Trees and BSTs

You're no longer a noob - you're a problem solver!`,
      exercises: [
        `EXERCISE 1: Personal Assessment
Answer these honestly:

1. Which concepts do I understand deeply?
2. Which topics need more practice?
3. What was my biggest breakthrough?
4. What was my biggest challenge?
5. How has my problem-solving approach changed?

Rate your confidence (1-10):
- Understanding problems: __/10
- Choosing the right algorithm: __/10
- Implementing solutions: __/10
- Debugging: __/10
- Optimizing code: __/10

Set 3 specific goals for continued improvement.`,

        `EXERCISE 2: Portfolio Showcase
Create a portfolio document:

SECTION 1: Journey Overview
- Start date and end date
- Total projects completed
- Lines of code written
- Favorite project and why

SECTION 2: Technical Skills
- Languages: Python
- Data Structures: [list them]
- Algorithms: [list them]
- Problem-solving frameworks: Pólya's method

SECTION 3: Project Highlights
For each week's integration project:
- Screenshot/description
- Algorithms used
- Key learnings
- Code snippet (best part)

SECTION 4: Before & After
- Problem-solving approach Day 1 vs Day 30
- First code sample vs latest code sample
- Reflection on growth`,

        `EXERCISE 3: Next 30 Days Curriculum
Design YOUR personalized advanced curriculum:

WEEK 1 - Advanced Data Structures:
- Heaps and priority queues
- Tries for string search
- Segment trees
- Union-find (disjoint sets)

WEEK 2 - Advanced Algorithms:
- Advanced graph: Bellman-Ford, Floyd-Warshall
- String algorithms: KMP, Rabin-Karp
- Backtracking: N-Queens, Sudoku solver
- Branch and bound

WEEK 3 - Specialized Topics:
- Bit manipulation
- Number theory for programming
- Geometric algorithms
- Advanced DP patterns

WEEK 4 - Real-World Application:
- Design and build a complex system
- Focus on your interests (games, web, data science, etc.)
- Contribute to open source
- Teach someone else (blog, video, mentor)

RESOURCES FOR NEXT LEVEL:
- LeetCode/HackerRank: Practice problems
- "Introduction to Algorithms" (CLRS): Deep dive
- "Designing Data-Intensive Applications": System design
- Open source projects: Real-world code

REMEMBER PÓLYA:
- Understand before coding
- Always have a plan
- Reflect on your solutions
- Learn from every problem`
      ], 
      deliverable: "Three documents: (1) Personal assessment with honest reflection and goals, (2) Portfolio showcasing 30-day journey, (3) Personalized 30-day advanced curriculum. Celebrate your achievement!",
      objective: "Reflect on growth, consolidate learning, and plan continued development as a confident problem solver"
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

