const fs = require('fs');
const path = require('path');

const files = [
  'src/components/Expenses/ExpensesListView.tsx',
  'src/components/Expenses/RecordExpenseView.tsx',
  'src/components/Expenses/MultiRingDonut.tsx'
];

files.forEach(f => {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');

  // Text colors
  content = content.replace(/text-gray-900 dark:text-white/g, 'text-[var(--text-core)]');
  content = content.replace(/text-gray-700 dark:text-gray-300/g, 'text-[var(--text-core)]');
  content = content.replace(/text-gray-600 dark:text-gray-400/g, 'text-[var(--text-sec)]');
  content = content.replace(/text-gray-500 dark:text-gray-400/g, 'text-[var(--text-sec)]');
  content = content.replace(/text-gray-400 dark:text-gray-500/g, 'text-[var(--text-mute)]');
  content = content.replace(/text-gray-500/g, 'text-[var(--text-sec)]');
  content = content.replace(/text-gray-400/g, 'text-[var(--text-mute)]');

  // Background colors
  content = content.replace(/bg-white dark:bg-gray-800/g, 'bg-[var(--bg-panel)]');
  content = content.replace(/bg-gray-50 dark:bg-gray-800\/50/g, 'bg-[var(--bg-panel-inner)]');
  content = content.replace(/bg-gray-50\/50 dark:bg-gray-800\/50/g, 'bg-[var(--bg-panel-inner)]');
  content = content.replace(/bg-gray-50 dark:bg-gray-800/g, 'bg-[var(--bg-panel-inner)]');
  content = content.replace(/hover:bg-gray-50 dark:hover:bg-gray-800\/50/g, 'hover:bg-[var(--bg-panel-inner)]');
  content = content.replace(/hover:bg-gray-50 dark:hover:bg-gray-800/g, 'hover:bg-[var(--bg-panel-inner)]');
  content = content.replace(/hover:bg-gray-50 dark:hover:bg-gray-700/g, 'hover:bg-[var(--bg-panel-inner)]');
  content = content.replace(/hover:bg-gray-100 dark:hover:bg-gray-700/g, 'hover:bg-[var(--bg-panel-inner)]');
  
  // Borders
  content = content.replace(/border-gray-200 dark:border-gray-700/g, 'border-[var(--border-core)]');
  content = content.replace(/border-gray-100 dark:border-gray-800/g, 'border-[var(--border-subtle)]');
  content = content.replace(/border-gray-200/g, 'border-[var(--border-core)]');
  content = content.replace(/border-gray-100/g, 'border-[var(--border-subtle)]');

  // Specific RecordExpenseView centering
  if (f.includes('RecordExpenseView.tsx')) {
    content = content.replace(/className="p-6 max-w-2xl mx-auto"/g, 'className="p-6 w-full max-w-4xl mx-auto flex flex-col h-full"');
  }

  fs.writeFileSync(p, content, 'utf8');
});
console.log('done');
