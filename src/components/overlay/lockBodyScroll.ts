/**
 * Body scroll locking shared by the overlay family.
 *
 * Naive per-component snapshots (`prev = body.style.overflow` on mount,
 * restore on unmount) pin the lock permanently whenever two overlays
 * overlap: the second overlay snapshots the already-hidden body, then
 * "restores" hidden as its own final state. Rather than snapshots, this
 * module ref-counts locks — the body stays hidden until the LAST lock is
 * released, and the pre-lock state restores exactly once.
 */
let lockCount = 0;
let preLockOverflow: string | null = null;

export function lockBodyScroll(): () => void {
  if (lockCount === 0) {
    preLockOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0 && preLockOverflow !== null) {
      document.body.style.overflow = preLockOverflow;
      preLockOverflow = null;
    }
  };
}
