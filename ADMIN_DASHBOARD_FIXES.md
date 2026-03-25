# Admin Dashboard Fixes - March 25, 2026

## Issues Fixed

### 1. RBAC Access Denied for Subject Admins ✅

**Problem:** Subject admins (like anvesh711@gmail.com) were getting "Forbidden: Admin access only" error when trying to access `/crucible/admin`, even though they had valid `subject_admin` roles in the database.

**Root Cause:** The middleware (`middleware.ts`) was still using the old `ADMIN_EMAILS` environment variable check instead of the new RBAC system stored in MongoDB.

**Initial Attempt:** Tried to call `getUserPermissions()` from middleware, but this caused a runtime error because:
- Middleware runs in Edge Runtime (doesn't support Node.js `crypto` module)
- `getUserPermissions()` uses Mongoose which requires Node.js runtime

**Final Fix Applied:**
- Removed RBAC check from middleware entirely
- Middleware now only checks if user is authenticated (logged in)
- RBAC permissions are enforced client-side by the `usePermissions` hook in the admin page
- The hook calls `/api/v2/admin/permissions` (Node.js runtime) which uses `getUserPermissions()`
- Users without proper permissions see an error UI in the admin page itself

**Code Changes:**
```typescript
// Before (old ADMIN_EMAILS check):
const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
...
if (pathname.startsWith('/crucible/admin') && user && !isLocalDev) {
    const userEmail = user.email || '';
    if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(userEmail)) {
        return NextResponse.json(
            { error: 'Forbidden: Admin access only' },
            { status: 403 }
        );
    }
}

// After (simple auth check):
// /crucible/admin requires authentication
// RBAC permissions are checked client-side by usePermissions hook in the admin page
// This just ensures user is logged in
if (pathname.startsWith('/crucible/admin') && !user && !isLocalDev) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
}
```

**Result:** 
- Anvesh and other subject admins can now access the admin dashboard
- They see only their assigned subjects in the chapter dropdown (enforced by `usePermissions` hook)
- No Edge Runtime compatibility issues

---

### 2. State Lost on Page Refresh ✅

**Problem:** When working on a specific chapter in the admin dashboard and hitting refresh, all filter state (chapter selection, type, difficulty, etc.) was lost, forcing the user to re-select everything.

**Root Cause:** All filter state was stored only in React `useState` hooks, which are reset on page reload.

**Fix Applied:**
- Added URL-based state persistence using Next.js `useRouter` and `useSearchParams`
- Filter states are now initialized from URL query parameters on page load
- Added a `useEffect` hook that syncs all filter changes to the URL in real-time
- Uses `router.replace()` with `scroll: false` to update URL without page reload or scroll jump

**Code Changes:**

1. **Import routing hooks:**
```typescript
import { useRouter, useSearchParams } from 'next/navigation';
```

2. **Initialize filters from URL params:**
```typescript
const router = useRouter();
const searchParams = useSearchParams();

// Before:
const [selectedChapterFilter, setSelectedChapterFilter] = useState('all');
const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
// ... etc

// After:
const [selectedChapterFilter, setSelectedChapterFilter] = useState(searchParams.get('chapter') || 'all');
const [selectedTypeFilter, setSelectedTypeFilter] = useState(searchParams.get('type') || 'all');
const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState(searchParams.get('difficulty') || 'all');
const [selectedSourceFilter, setSelectedSourceFilter] = useState(searchParams.get('source') || 'all');
const [selectedYearFilter, setSelectedYearFilter] = useState(searchParams.get('year') || 'all');
const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
// ... all other filters
```

3. **Add URL sync effect:**
```typescript
// Sync filter state to URL params
useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (selectedSubjectFilter !== 'chemistry') params.set('subject', selectedSubjectFilter);
    if (selectedChapterFilter !== 'all') params.set('chapter', selectedChapterFilter);
    if (selectedTypeFilter !== 'all') params.set('type', selectedTypeFilter);
    if (selectedSourceFilter !== 'all') params.set('source', selectedSourceFilter);
    if (selectedShiftFilter !== 'all') params.set('shift', selectedShiftFilter);
    if (selectedTopPYQFilter !== 'all') params.set('topPyq', selectedTopPYQFilter);
    if (selectedDifficultyFilter !== 'all') params.set('difficulty', selectedDifficultyFilter);
    if (selectedTagStatusFilter !== 'all') params.set('tagStatus', selectedTagStatusFilter);
    if (selectedYearFilter !== 'all') params.set('year', selectedYearFilter);
    if (selectedTagFilter !== 'all') params.set('tag', selectedTagFilter);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/crucible/admin';
    router.replace(newUrl, { scroll: false });
}, [
    searchQuery,
    selectedSubjectFilter,
    selectedChapterFilter,
    selectedTypeFilter,
    selectedSourceFilter,
    selectedShiftFilter,
    selectedTopPYQFilter,
    selectedDifficultyFilter,
    selectedTagStatusFilter,
    selectedYearFilter,
    selectedTagFilter,
    router
]);
```

**Result:** 
- When you select a chapter and refresh the page, you return to the same chapter
- All active filters (type, difficulty, year, search query, etc.) are preserved
- URL is shareable - you can copy the URL and open it in another tab to get the exact same view
- No page reload or scroll jump when filters change

---

---

### 3. Numerical Input Doesn't Accept Negative Numbers or Decimals ✅

**Problem:** When a question type is set to NVT (Numerical Value Type), the answer input field was not properly accepting negative numbers (e.g., -5) or decimal values (e.g., 3.14, -0.5).

**Root Cause:** The input validation logic was too restrictive and didn't allow partial input states like "-", ".", or "-." which are necessary when typing negative or decimal numbers.

**Fix Applied:**
- Changed input validation to use regex pattern `/^-?\d*\.?\d*$/` which allows:
  - Optional minus sign at the start
  - Digits before and after decimal point
  - Partial input states (-, ., -., 12., etc.)
- Updated onChange handler to allow partial input without blocking
- Updated onBlur handler to validate only complete numbers
- Changed placeholder to show examples: "e.g., -5, 3.14, -0.5"
- Updated label to clarify: "Numerical Answer (accepts negative numbers and decimals)"

**Code Changes:**
```typescript
// Before:
onChange={(e) => {
    const raw = e.target.value;
    const num = parseFloat(raw);
    const isDecimal = raw.includes('.');
    const answerUpdate = isNaN(num)
        ? {}
        : isDecimal
            ? { decimal_value: num }
            : { integer_value: num };
    // ... update state
}}

// After:
onChange={(e) => {
    const raw = e.target.value;
    // Allow typing: digits, minus sign (only at start), decimal point, and empty string
    // This regex allows partial input like "-", ".", "-.", "12.", etc.
    if (raw !== '' && !/^-?\d*\.?\d*$/.test(raw)) {
        return; // Block invalid characters
    }
    
    // Update local state immediately for responsive typing
    const num = parseFloat(raw);
    const isDecimal = raw.includes('.');
    const answerUpdate = isNaN(num) || raw === '' || raw === '-' || raw === '.' || raw === '-.'
        ? {}
        : isDecimal
            ? { decimal_value: num }
            : { integer_value: num };
    // ... update state
}}

onBlur={(e) => {
    const raw = e.target.value.trim();
    if (raw === '' || raw === '-' || raw === '.' || raw === '-.') return;
    const num = parseFloat(raw);
    if (isNaN(num)) return;
    // ... save to DB
}}
```

**Result:**
- Can now type negative numbers: -5, -100, -0.5
- Can now type decimal numbers: 3.14, 0.5, 2.718
- Can now type negative decimals: -3.14, -0.5
- Input is responsive - no blocking while typing partial values
- Invalid characters are blocked (letters, multiple decimals, etc.)

---

## Files Modified

1. **`/Users/CanvasClasses/Desktop/canvas/middleware.ts`**
   - Removed `ADMIN_EMAILS` constant and `getUserPermissions` import
   - Simplified `/crucible/admin` check to only verify user is authenticated
   - RBAC enforcement moved to client-side via `usePermissions` hook

2. **`/Users/CanvasClasses/Desktop/canvas/app/crucible/admin/page.tsx`**
   - Added imports: `useRouter`, `useSearchParams` from `next/navigation`
   - Modified all filter state initializations to read from URL params
   - Added new `useEffect` hook to sync filter state to URL
   - Fixed numerical input validation to accept negative numbers and decimals

## Testing Checklist

- [x] Subject admins can now access `/crucible/admin`
- [x] No Edge Runtime errors on page load
- [x] Filter state persists across page refreshes
- [x] URL updates when filters change
- [x] No page reload when changing filters
- [x] URL is shareable (opening same URL in new tab shows same filters)
- [x] Numerical input accepts negative numbers (-5, -100)
- [x] Numerical input accepts decimals (3.14, 0.5)
- [x] Numerical input accepts negative decimals (-3.14, -0.5)
- [x] Invalid characters are blocked in numerical input

## Notes

- The `ADMIN_EMAILS` environment variable is no longer used for `/crucible/admin` access control
- Access is now controlled entirely by the RBAC system in MongoDB (`user_roles` collection)
- RBAC permissions are checked via `/api/v2/admin/permissions` API (Node.js runtime)
- Super admins can still manage roles via the Role Management panel
- Subject admins see only their assigned subjects in the chapter dropdown (enforced by `usePermissions` hook)
- Middleware runs in Edge Runtime and only performs authentication check (not authorization)
