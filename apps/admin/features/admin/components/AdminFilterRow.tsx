import { Select } from './Select';

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
      <Select
        size="sm"
        className="shrink-0 w-32"
        triggerClassName={`bg-gray-800/50 hover:bg-gray-700/50 border ${selectedDifficultyFilter !== 'all' ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
        value={selectedDifficultyFilter}
        onChange={setSelectedDifficultyFilter}
        options={[
          { value: 'all', label: 'All Difficulties' },
          { value: '1', label: 'L1 — Easy' },
          { value: '2', label: 'L2 — Easy+' },
          { value: '3', label: 'L3 — Medium' },
          { value: '4', label: 'L4 — Hard' },
          { value: '5', label: 'L5 — Challenging' },
        ]}
      />

      {/* Exam Board */}
      <Select
        size="sm"
        className="shrink-0 w-28"
        triggerClassName={`bg-gray-800/50 hover:bg-gray-700/50 border ${selectedSourceFilter !== 'all' ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
        value={selectedSourceFilter}
        onChange={(v) => { setSelectedSourceFilter(v); resetPage(); }}
        options={[
          { value: 'all', label: 'All Boards' },
          { value: 'JEE', label: 'JEE' },
          { value: 'NEET', label: 'NEET' },
          { value: 'CBSE', label: 'CBSE' },
          { value: 'BITSAT', label: 'BITSAT' },
        ]}
      />

      {/* Source Type */}
      <Select
        size="sm"
        className="shrink-0 w-32"
        triggerClassName={`bg-gray-800/50 hover:bg-gray-700/50 border ${selectedShiftFilter !== 'all' ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
        value={selectedShiftFilter}
        onChange={(v) => { setSelectedShiftFilter(v); resetPage(); }}
        options={[
          { value: 'all', label: 'All Sources' },
          { value: 'PYQ', label: 'PYQ' },
          { value: 'Practice', label: 'Practice' },
          { value: 'NCERT_Textbook', label: 'NCERT Text' },
          { value: 'NCERT_Exemplar', label: 'NCERT Exem' },
          { value: 'Mock', label: 'Mock' },
        ]}
      />

      {/* Year — visible when PYQ source or exam board is selected */}
      {showYearFilter && (
        <Select
          size="sm"
          className="shrink-0 w-24"
          triggerClassName={`bg-gray-800/50 hover:bg-gray-700/50 border ${selectedYearFilter !== 'all' ? 'border-purple-500/70 text-purple-300' : 'border-gray-700/50'}`}
          value={selectedYearFilter}
          onChange={setSelectedYearFilter}
          options={[
            { value: 'all', label: 'All Years' },
            ...[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => ({
              value: String(y),
              label: String(y),
            })),
          ]}
        />
      )}

      {/* Concept / Topic tag — only when a chapter is loaded */}
      {showTagFilter && (
        <Select
          size="sm"
          className="shrink-0 w-44"
          triggerClassName={`bg-gray-800/50 hover:bg-gray-700/50 border ${selectedTagFilter !== 'all' ? 'border-emerald-500/70 text-emerald-300' : 'border-gray-700/50'}`}
          value={selectedTagFilter}
          onChange={setSelectedTagFilter}
          options={[
            { value: 'all', label: 'All Topics' },
            ...chapterFilterTags.map((tag) => ({ value: tag.id, label: tag.name })),
          ]}
        />
      )}

      {/* Top PYQ */}
      <Select
        size="sm"
        className="shrink-0 w-24"
        triggerClassName="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50"
        value={selectedTopPYQFilter}
        onChange={setSelectedTopPYQFilter}
        options={[
          { value: 'all', label: 'All PYQ' },
          { value: 'top', label: '⭐ Top' },
          { value: 'not-top', label: 'Other' },
        ]}
      />

      {/* Tag / QC status */}
      <Select
        size="sm"
        className="shrink-0 w-40"
        triggerClassName={`bg-gray-800/50 hover:bg-gray-700/50 border ${selectedTagStatusFilter !== 'all' ? 'border-red-500 text-red-300' : 'border-gray-700/50'}`}
        value={selectedTagStatusFilter}
        onChange={setSelectedTagStatusFilter}
        options={[
          { value: 'all', label: 'Tags ✓' },
          { value: 'untagged', label: `⚠ Untagged (${untaggedCount})` },
          { value: 'no-chapter', label: `🔴 No Chapter (${noChapterCount})` },
          { value: 'no-tag', label: `🟡 No Tag (${noTagCount})` },
          { value: 'flagged', label: `🚨 Flagged (${flaggedCount})` },
        ]}
      />
    </>
  );
}
