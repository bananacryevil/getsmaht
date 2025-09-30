import React, { useEffect, useState } from "react";

// 30-Day Curriculum Tracker
// Single-file React component (default export). Tailwind classes used for styling.
// Features:
// - Shows 30-day curriculum with day titles, readings, exercises, deliverables
// - Mark days complete, add notes, date completed
// - Progress bar, filter by week, search
// - Persisted in localStorage; import/export JSON
// Usage:
// - Create a new React + Vite project, install Tailwind, then replace src/App.jsx
// - Or paste this into an environment that supports Tailwind + React

const STORAGE_KEY = "curriculum_tracker_v1";

function initialCurriculum() {
  // Minimal, readable structure for each day. Keep descriptions concise for UI.
  const days = [
    { day: 1, title: "Pólya & max_of_three", readings: ["How to Solve It: pp.1-34"], exercises: ["Write pseudocode for max_of_three", "Implement max_of_three without built-in max"], deliverable: "max_of_three function" },
    { day: 2, title: "Think Python: Expressions", readings: ["Think Python Ch.2"], exercises: ["Plan & implement digit_sum(n)"], deliverable: "digit_sum" },
    { day: 3, title: "Functions & Primes", readings: ["Think Python Ch.3"], exercises: ["Implement is_prime(n) using trial division"], deliverable: "is_prime" },
    { day: 4, title: "Control flow: Tables", readings: ["Think Python Ch.5"], exercises: ["Print multiplication table 1-10"], deliverable: "multiplication table" },
    { day: 5, title: "Strings basics", readings: ["Think Python Ch.8"], exercises: ["count_vowels(s)"], deliverable: "vowel counter" },
    { day: 6, title: "Lists & rotation", readings: [], exercises: ["rotate_left(arr, k)"], deliverable: "array rotation" },
    { day: 7, title: "Mini-project: Calculator CLI", readings: [], exercises: ["Build a text-based calculator supporting + - * /"], deliverable: "calculator CLI" },

    { day: 8, title: "Recursion intro", readings: ["Grokking Algorithms Ch.3"], exercises: ["Factorial (iterative + recursive)"], deliverable: "factorial functions" },
    { day: 9, title: "Fibonacci & memoization", readings: [], exercises: ["Recursive Fibonacci + memoization"], deliverable: "fib with memo" },
    { day: 10, title: "Binary Search", readings: [], exercises: ["Implement binary_search(arr, target)"] , deliverable: "binary search"},
    { day: 11, title: "Bubble Sort", readings: [], exercises: ["Implement bubble sort & explain complexity"], deliverable: "bubble sort" },
    { day: 12, title: "Anagram detection", readings: [], exercises: ["is_anagram(s1,s2)"], deliverable: "anagram checker" },
    { day: 13, title: "Palindrome checks", readings: [], exercises: ["palindrome ignoring punctuation/case"], deliverable: "palindrome checker" },
    { day: 14, title: "Mini-project: Guessing Game", readings: [], exercises: ["Guess-the-number with hints"], deliverable: "guessing game" },

    { day: 15, title: "Hash tables & word count", readings: ["Grokking Algorithms Ch.5"], exercises: ["word_count(text)"], deliverable: "word frequency counter" },
    { day: 16, title: "Stacks & parentheses", readings: [], exercises: ["is_balanced(parens) using stack"], deliverable: "parentheses validator" },
    { day: 17, title: "Queues & simulations", readings: [], exercises: ["Implement queue for print jobs"], deliverable: "queue simulation" },
    { day: 18, title: "Linked lists basics", readings: [], exercises: ["Reverse linked list (iterative + recursive)"], deliverable: "linked list reversal" },
    { day: 19, title: "Cycle detection", readings: [], exercises: ["Floyd's cycle detection (has_cycle)"], deliverable: "cycle detector" },
    { day: 20, title: "Graphs: BFS", readings: ["Grokking Algorithms Ch.6"], exercises: ["Shortest path in unweighted graph (BFS)"], deliverable: "bfs shortest path" },
    { day: 21, title: "Mini-project: Task Manager CLI", readings: [], exercises: ["Add/list/complete/search tasks"], deliverable: "task manager" },

    { day: 22, title: "Two Sum (hash map)", readings: [], exercises: ["LeetCode #1 Two Sum"], deliverable: "two-sum solution" },
    { day: 23, title: "Valid Parentheses (stack)", readings: [], exercises: ["LeetCode #20 Valid Parentheses"], deliverable: "parentheses solution" },
    { day: 24, title: "Merge Two Sorted Lists", readings: [], exercises: ["LeetCode #21 Merge Two Sorted Lists"], deliverable: "merge lists" },
    { day: 25, title: "Maximum Subarray (Kadane)", readings: [], exercises: ["LeetCode #53 Maximum Subarray"], deliverable: "kadane solution" },
    { day: 26, title: "Plus One (carry)", readings: [], exercises: ["LeetCode #66 Plus One"], deliverable: "plus one" },
    { day: 27, title: "Reflection & Re-solve", readings: ["Review problem journal"], exercises: ["Re-solve two earlier problems without looking"], deliverable: "comparison notes" },
    { day: 28, title: "Advent of Code: parsing", readings: [], exercises: ["Pick AoC Day 1 from any year and complete"], deliverable: "AoC solution" },

    { day: 29, title: "Mini-project: Tic-Tac-Toe", readings: [], exercises: ["3x3 grid, win detection, PvP"], deliverable: "tic-tac-toe" },
    { day: 30, title: "Review & Journal", readings: [], exercises: ["Write summary of progress, weak areas, future plan"], deliverable: "30-day reflection" },
  ];

  return days.map(d => ({ ...d, completed: false, notes: "", completedAt: null }));
}

export default function App() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to load from storage", e);
    }
    return initialCurriculum();
  });
  const [filterWeek, setFilterWeek] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save storage", e);
    }
  }, [items]);

  const toggleComplete = (day) => {
    setItems(prev => prev.map(it => it.day === day ? { ...it, completed: !it.completed, completedAt: !it.completed ? new Date().toISOString() : null } : it));
  };

  const updateNotes = (day, notes) => {
    setItems(prev => prev.map(it => it.day === day ? { ...it, notes } : it));
  };

  const resetAll = () => {
    if (!confirm("Reset all progress? This will clear completion and notes.")) return;
    setItems(initialCurriculum());
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curriculum-tracker.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        // Minimal validation: array with day numbers
        if (!Array.isArray(parsed) || !parsed.every(p => typeof p.day === "number")) throw new Error("Invalid format");
        setItems(parsed.map(p => ({ ...p })));
      } catch (e) {
        alert("Failed to import: " + e.message);
      }
    };
    reader.readAsText(file);
  };

  const filtered = items.filter(it => {
    if (filterWeek !== "all") {
      const week = Math.ceil(it.day / 7);
      if (String(week) !== filterWeek) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const inTitle = it.title.toLowerCase().includes(q);
      const inExercises = it.exercises.join(" ").toLowerCase().includes(q);
      const inReadings = it.readings.join(" ").toLowerCase().includes(q);
      return inTitle || inExercises || inReadings;
    }
    return true;
  });

  const completedCount = items.filter(i => i.completed).length;
  const progress = Math.round((completedCount / items.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">30-Day Problem-Solving Tracker</h1>
          <div className="text-sm text-gray-600">Progress: {progress}% ({completedCount}/{items.length})</div>
        </header>

        <div className="mb-4">
          <div className="w-full bg-gray-200 h-3 rounded overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-green-400" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <select value={filterWeek} onChange={e => setFilterWeek(e.target.value)} className="border px-3 py-2 rounded">
            <option value="all">All weeks</option>
            <option value="1">Week 1</option>
            <option value="2">Week 2</option>
            <option value="3">Week 3</option>
            <option value="4">Week 4</option>
          </select>

          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title/exercises/readings" className="flex-1 border px-3 py-2 rounded" />

          <button onClick={exportJSON} className="px-3 py-2 border rounded">Export</button>
          <label className="px-3 py-2 border rounded cursor-pointer">
            Import
            <input type="file" accept="application/json" onChange={e => e.target.files && importJSON(e.target.files[0])} className="hidden" />
          </label>
          <button onClick={resetAll} className="px-3 py-2 border rounded text-sm text-red-600">Reset</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-medium mb-2">Days</h2>
            <div className="space-y-2">
              {filtered.map(it => (
                <div key={it.day} className="border rounded p-3 bg-gray-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-gray-500">Day {it.day}</div>
                      <div className="font-semibold">{it.title}</div>
                      <div className="text-sm text-gray-700 mt-2">
                        <strong>Readings:</strong> {it.readings.length ? it.readings.join("; ") : "—"}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        <strong>Exercises:</strong>
                        <ul className="list-disc pl-5">
                          {it.exercises.map((ex, idx) => <li key={idx} className="text-sm">{ex}</li>)}
                        </ul>
                      </div>
                      <div className="text-sm text-gray-700 mt-1"><strong>Deliverable:</strong> {it.deliverable || '—'}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={it.completed} onChange={() => toggleComplete(it.day)} />
                        <span className="text-sm">Done</span>
                      </label>
                      <div className="text-xs text-gray-500">{it.completedAt ? new Date(it.completedAt).toLocaleString() : ''}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <textarea value={it.notes} onChange={e => updateNotes(it.day, e.target.value)} placeholder="Notes, pseudocode, links, reflections..." className="w-full border rounded p-2 text-sm" rows={3} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside>
            <h2 className="text-lg font-medium mb-2">Quick stats & tips</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <strong>Completed today:</strong>
                <div>{items.filter(i => i.completedAt && new Date(i.completedAt).toDateString() === new Date().toDateString()).length}</div>
              </div>

              <div>
                <strong>Next unfinished day:</strong>
                <div>{(() => { const next = items.find(i => !i.completed); return next ? `Day ${next.day}: ${next.title}` : 'All done!'; })()}</div>
              </div>

              <div>
                <strong>Tips</strong>
                <ul className="list-disc pl-5">
                  <li>Write pseudocode before coding — treat it as the main deliverable.</li>
                  <li>Keep a short daily reflection in notes (time spent, what failed, what worked).</li>
                  <li>When stuck, reduce problem size: work on examples by hand.</li>
                </ul>
              </div>

              <div>
                <strong>Controls</strong>
                <div className="mt-2 space-y-1">
                  <button onClick={() => { const next = items.find(i => !i.completed); if (next) toggleComplete(next.day); }} className="px-3 py-1 border rounded text-sm">Mark next as done</button>
                  <button onClick={() => { setItems(items.map(i => ({ ...i, completed: true, completedAt: new Date().toISOString() }))); }} className="px-3 py-1 border rounded text-sm">Mark all complete</button>
                </div>
              </div>

              <div>
                <strong>Export/Backup</strong>
                <div className="text-xs">Use Export to save progress. Use Import to restore or move between machines.</div>
              </div>

            </div>

            <div className="mt-6">
              <h3 className="font-medium">Search & filtering</h3>
              <div className="text-xs text-gray-600 mt-2">Use the search box to find exercises or readings. Filter by week to focus.</div>
            </div>

          </aside>
        </div>

        <footer className="mt-6 text-xs text-gray-500">
          This app stores progress in your browser's localStorage. To keep or move data, export JSON.
        </footer>
      </div>
    </div>
  );
}
