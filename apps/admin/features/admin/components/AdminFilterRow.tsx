interface AdminFilterRowProps {
  // Selected values
  selectedDifficultyFilter: string;
  selectedSourceFilter: string;   // exam board
  selectedShiftFilter: string;    // source type
  selectedYearFilter: string;
  selectedTagFilter: string;
  selectedTopPYQFilter: string;
  selectedTagStatusFilter: string;

  // Setters
  setSelectedDifficultyFilter: (v: string) => void;
  setSelectedSourceFilter: (v: string) => void;
  setSelectedShiftFilter: (v: string) => void;
  setSelectedYearFilter: (v: string) => void;
  setSelectedTagFilter: (v: string) => void;
  setSelectedTopPYQFilter: (v: string) => void;
  setSelectedTagStatusFilter: (v: string) => void;

  // Side-effect: changing exam board / source type resets pagination
  resetPage: () => void;

  // Conditional rendering context
  selectedChapterFilter: string;
  chapterFilterTags: Array<{ id: string; name: string }>;

  // Tag/QC dropdown labels carry counts
  untaggedCount: number;
  noChapterCount: number;
  noTagCount: number;
  flaggedCount: number;
}

export default function AdminFilterRow(props: AdminFilterRowProps) {
  const {
    selectedDifficultyFilter, setSelectedDifficultyFilter,
    selectedSourceFilter, setSelectedSourceFilter,
    selectedShiftFilter, setSelectedShiftFilter,
    selectedYearFilter, setSelectedYearFilter,
    selectedTagFilter, setSelectedTagFilter,
    selectedTopPYQFilter, setSelectedTopPYQFilter,
    selectedTagStatusFilter, setSelectedTagStatusFilter,
    resetPage,
    selectedChapterFilter, chapterFilterTags,
    untaggedCount, noChapterCount, noTagCount, flaggedCount,
  } = props;

  const showYearFilter =
    selectedShiftFilter === 'PYQ' ||
    selectedSourceFilter === 'JEE' ||
    selectedSourceFilter === 'NEET';

  const showTagFilter =
    selectedChapterFilter !== 'all' && chapterFilterTags.length > 0;

  return (
    <>
      {/* Difficulty */}
      <select
        value={selectedDifficultyFilter}
        onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
        className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none ${selectedDifficultyFilter !== 'all' ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
      >
        <option value="all">All Difficulties</option>
        <option value="1">L1 — Easy</option>
        <option value="2">L2 — Easy+</option>
        <option value="3">L3 — Medium</option>
        <option value="4">L4 — Hard</option>
        <option value="5">L5 — Challenging</option>
      </select>

      {/* Exam Board */}
      <select
        value={selectedSourceFilter}
        onChange={(e) => { setSelectedSourceFilter(e.target.value); resetPage(); }}
        className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none ${selectedSourceFilter !== 'all' ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
      >
        <option value="all">All Boards</option>
        <option value="JEE">JEE</option>
        <option value="NEET">NEET</option>
        <option value="CBSE">CBSE</option>
        <option value="BITSAT">BITSAT</option>
      </select>

      {/* Source Type */}
      <select
        value={selectedShiftFilter}
        onChange={(e) => { setSelectedShiftFilter(e.target.value); resetPage(); }}
        className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none ${selectedShiftFilter !== 'all' ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
      >
        <option value="all">All Sources</option>
        <option value="PYQ">PYQ</option>
        <option value="Practice">Practice</option>
        <option value="NCERT_Textbook">NCERT Text</option>
        <option value="NCERT_Exemplar">NCERT Exem</option>
        <option value="Mock">Mock</option>
      </select>

      {/* Year — visible when PYQ source or exam board is selected */}
      {showYearFilter && (
        <select
          value={selectedYearFilter}
          onChange={(e) => setSelectedYearFilter(e.target.value)}
          className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none ${selectedYearFilter !== 'all' ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
        >
          <option value="all">All Years</option>
          {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(y => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      )}

      {/* Concept / Topic tag — only when a chapter is loaded */}
      {showTagFilter && (
        <select
          value={selectedTagFilter}
          onChange={(e) => setSelectedTagFilter(e.target.value)}
          className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none ${selectedTagFilter !== 'all' ? 'border-emerald-500/70 text-emerald-300' : 'border-gray-700/50'}`}
        >
          <option value="all">All Topics</option>
          {chapterFilterTags.map(tag => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
      )}

      {/* Top PYQ */}
      <select
        value={selectedTopPYQFilter}
        onChange={(e) => setSelectedTopPYQFilter(e.target.value)}
        className="shrink-0 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-xs focus:border-purple-500 outline-none"
      >
        <option value="all">All PYQ</option>
        <option value="top">⭐ Top</option>
        <option value="not-top">Other</option>
      </select>

      {/* Tag / QC status */}
      <select
        value={selectedTagStatusFilter}
        onChange={(e) => setSelectedTagStatusFilter(e.target.value)}
        className={`shrink-0 bg-gray-800/50 border rounded-lg px-2 py-1 text-xs outline-none ${selectedTagStatusFilter !== 'all' ? 'border-red-500 text-red-300' : 'border-gray-700/50'}`}
      >
        <option value="all">Tags ✓</option>
        <option value="untagged">⚠ Untagged ({untaggedCount})</option>
        <option value="no-chapter">🔴 No Chapter ({noChapterCount})</option>
        <option value="no-tag">🟡 No Tag ({noTagCount})</option>
        <option value="flagged">🚨 Flagged ({flaggedCount})</option>
      </select>
    </>
  );
}
