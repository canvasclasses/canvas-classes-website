'use client';

// The Excalidraw embed. Imported ONLY via dynamic(ssr:false) from
// DiagramEditorClient, so Excalidraw (which touches window/document) never runs
// on the server. EXCALIDRAW_ASSET_PATH points its fonts at jsdelivr (allowed by
// the admin CSP); without it Excalidraw falls back to its own CDN which the CSP
// would block.

import { Excalidraw, convertToExcalidrawElements, restoreLibraryItems } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { DIAGRAM_SHAPES } from './diagramShapes';

if (typeof window !== 'undefined') {
  (window as unknown as { EXCALIDRAW_ASSET_PATH?: string }).EXCALIDRAW_ASSET_PATH =
    'https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0.18.1/dist/prod/';
}

// Build the physics/math library items from the shape skeletons. Each shape's
// elements get a shared groupId (so they move as one unit on the canvas) and
// roughness 0 (clean default; the user can switch any shape to hand-drawn via
// Excalidraw's sloppiness control). Defensive per-shape so one bad skeleton
// can't break the whole editor. Runs client-side only (this module is loaded
// via dynamic(ssr:false)).
function buildLibraryItems() {
  const items: unknown[] = [];
  for (const shape of DIAGRAM_SHAPES) {
    try {
      const gid = `shape-${shape.id}`;
      const elements = convertToExcalidrawElements(shape.skeleton as never).map(
        (el) => ({ ...el, roughness: 0, groupIds: [gid] }),
      );
      items.push({ status: 'published', id: shape.id, name: shape.name, created: 1, elements });
    } catch (err) {
      console.error('[diagram] failed to build shape', shape.id, err);
    }
  }
  try {
    return restoreLibraryItems(items as never, 'published');
  } catch (err) {
    console.error('[diagram] restoreLibraryItems failed', err);
    return [];
  }
}

const LIBRARY_ITEMS = buildLibraryItems();

// Minimal shape of the imperative API we use — avoids depending on Excalidraw's
// (exports-map-sensitive) type paths.
export interface ExcalidrawApi {
  getSceneElements: () => readonly unknown[];
  getAppState: () => Record<string, unknown>;
  getFiles: () => Record<string, unknown>;
}

export default function ExcalidrawCanvas({
  onReady,
}: {
  onReady: (api: ExcalidrawApi) => void;
}) {
  return (
    <Excalidraw
      theme="dark"
      // Preloads the physics/math shapes into Excalidraw's own Library panel
      // (the book icon) — visual thumbnails the author browses and drags from.
      initialData={{ libraryItems: LIBRARY_ITEMS as never }}
      excalidrawAPI={(api) => onReady(api as unknown as ExcalidrawApi)}
    />
  );
}
