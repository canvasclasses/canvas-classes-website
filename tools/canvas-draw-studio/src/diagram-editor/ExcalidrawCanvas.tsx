// The Excalidraw embed. In the website this pointed EXCALIDRAW_ASSET_PATH at a
// CDN; here we point it at a LOCAL copy of Excalidraw's assets (copied into
// public/excalidraw-assets/ at build time) so the editor's fonts load fully
// offline. BASE_URL is './' (see vite.config base), so the path resolves
// relative to wherever the folder is opened from.

import { Excalidraw, convertToExcalidrawElements, restoreLibraryItems } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { DIAGRAM_SHAPES } from './diagramShapes';

if (typeof window !== 'undefined') {
  (window as unknown as { EXCALIDRAW_ASSET_PATH?: string }).EXCALIDRAW_ASSET_PATH =
    `${import.meta.env.BASE_URL}excalidraw-assets/`;
}

// Build the physics/math library items from the shape skeletons. Each shape's
// elements get a shared groupId (so they move as one unit) and roughness 0 (clean
// default; switchable to hand-drawn via Excalidraw's sloppiness control).
// Defensive per-shape so one bad skeleton can't break the whole editor.
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

// Minimal shape of the imperative API we use.
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
      excalidrawAPI={(api) => {
        // Debug hook, mirroring KetcherCanvas's window.ketcher.
        (window as unknown as { excalidrawApi?: unknown }).excalidrawApi = api;
        onReady(api as unknown as ExcalidrawApi);
      }}
    />
  );
}
