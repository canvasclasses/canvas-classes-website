// styled-jsx's `<style jsx>` attribute augmentation. The consuming Next.js
// apps pick this up automatically via the `next` TS plugin, but the package's
// own tsc --noEmit check needs an explicit declaration so it doesn't
// false-flag block renderers that use scoped styles.
import 'react';

declare module 'react' {
  interface StyleHTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

