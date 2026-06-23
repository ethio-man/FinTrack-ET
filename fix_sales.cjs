const fs = require('fs');

let f = 'src/components/Sales/SalesListView.tsx';
let content = fs.readFileSync(f, 'utf8');

// Fix 1: Summary Strip Layout
content = content.replace(
  '<div className="flex items-center gap-4 mb-6">',
  '<div className="flex flex-wrap items-center gap-4 mb-6">'
);

content = content.replace(
  '<div className="grid grid-cols-3 gap-6 mb-6">',
  '<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">'
);

// Fix 2: Currency
content = content.replace(
  '<h3 className="text-3xl">${thisPeriodTotal.toLocaleString()}</h3>',
  '<h3 className="text-2xl sm:text-3xl truncate">ETB {thisPeriodTotal.toLocaleString()}</h3>'
);

content = content.replace(
  '<h3 className="text-3xl">${18420}</h3>',
  '<h3 className="text-2xl sm:text-3xl truncate">ETB 18420</h3>'
);

content = content.replace(
  '<h3 className="text-3xl">${refunds.toLocaleString()}</h3>',
  '<h3 className="text-2xl sm:text-3xl truncate">ETB {refunds.toLocaleString()}</h3>'
);

// Fix 3: Action Bar Layout
content = content.replace(
  '<div className="flex items-center gap-3">',
  '<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">'
);

content = content.replace(
  '<div className="flex-1 relative">',
  '<div className="w-full sm:flex-1 relative">'
);

content = content.replace(
  '<button\n            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${\n              showFilters ? \'bg-indigo-600 text-white\' : \'bg-[var(--bg-panel)] text-[var(--text-sec)] hover:bg-[var(--bg-panel)]\'\n            }`}\n            onClick={() => setShowFilters(!showFilters)}\n          >\n            <Filter className="w-4 h-4" />{t.filter}</button>',
  '<button\n            className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto ${\n              showFilters ? \'bg-indigo-600 text-white\' : \'bg-[var(--bg-panel)] text-[var(--text-sec)] hover:bg-[var(--bg-panel)]\'\n            }`}\n            onClick={() => setShowFilters(!showFilters)}\n          >\n            <Filter className="w-4 h-4" />{t.filter}</button>'
);

content = content.replace(
  '<button className="px-4 py-2 bg-[var(--bg-panel)] text-[var(--text-sec)] rounded-lg flex items-center gap-2 hover:bg-[var(--bg-panel)]">',
  '<button className="px-4 py-2 bg-[var(--bg-panel)] text-[var(--text-sec)] rounded-lg flex items-center justify-center gap-2 hover:bg-[var(--bg-panel)] w-full sm:w-auto">'
);
content = content.replace(
  '<button className="px-4 py-2 bg-[var(--bg-panel)] text-[var(--text-sec)] rounded-lg flex items-center gap-2 hover:bg-[var(--bg-panel)]">',
  '<button className="px-4 py-2 bg-[var(--bg-panel)] text-[var(--text-sec)] rounded-lg flex items-center justify-center gap-2 hover:bg-[var(--bg-panel)] w-full sm:w-auto">'
);

content = content.replace(
  '<button\n            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700"\n            onClick={onNewSale}\n          >\n            <Plus className="w-4 h-4" />{t.recordSale}</button>',
  '<button\n            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 w-full sm:w-auto"\n            onClick={onNewSale}\n          >\n            <Plus className="w-4 h-4" />{t.recordSale}</button>'
);

// Fix 4: Table Currency and Pagination layout
content = content.replace(
  '<td className="px-6 py-4 text-sm">${sale.total.toFixed(2)}</td>',
  '<td className="px-6 py-4 text-sm">ETB {sale.total.toFixed(2)}</td>'
);

content = content.replace(
  '<div className="px-6 py-4 border-t border-[var(--border-subtle)] flex items-center justify-between">',
  '<div className="px-6 py-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">'
);

content = content.replace(
  '<div className="flex gap-2">',
  '<div className="flex flex-wrap justify-center gap-2">'
);

// General currency replace for placeholder="$10000"
content = content.replace(/placeholder="\$10000"/g, 'placeholder="ETB 10000"');
content = content.replace(/>\$\{/g, '>ETB ${');
content = content.replace(/"\$/g, '"ETB ');

fs.writeFileSync(f, content);
console.log('Fixed SalesListView.tsx');
