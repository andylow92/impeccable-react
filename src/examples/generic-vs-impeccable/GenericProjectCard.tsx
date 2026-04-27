/**
 * GenericProjectCard — INTENTIONALLY BAD.
 *
 * This is the AI-default that this repo exists to reject. Do not import it
 * outside the examples page. It is here as a reference of what *not* to
 * generate.
 *
 * Smells in this file (each one is a fail condition from skills/design.md):
 *   1. Single rounded rectangle, soft shadow, centered title — generic SaaS card.
 *   2. Uniform `rounded-2xl` on every container. Hierarchy collapses.
 *   3. Same `shadow-md` on every nested block. Depth becomes meaningless.
 *   4. Pill button + ghost button stack. Default Tailwind tutorial pattern.
 *   5. Decorative gradient bar that does not encode state, focus, or progress.
 *   6. Gray-on-gray primary data (`text-gray-500` on white).
 *   7. A "67%" progress bar that hides the owner and the blocker.
 *   8. Stat tiles with identical sizes, identical radii, identical icons —
 *      filler dashboard energy.
 */

export function GenericProjectCard() {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-md">
      <div className="mb-6 h-2 w-full rounded-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />
      <h2 className="mb-2 text-center text-xl font-medium text-gray-700">Atlas Replatform</h2>
      <p className="mb-6 text-center text-sm text-gray-400">Active engagement</p>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-gray-50 p-4 shadow-md">
          <p className="text-xs text-gray-400">Client</p>
          <p className="text-base text-gray-500">Northstar Bio</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-4 shadow-md">
          <p className="text-xs text-gray-400">Budget</p>
          <p className="text-base text-gray-500">$342,000</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-4 shadow-md">
          <p className="text-xs text-gray-400">Urgency</p>
          <p className="text-base text-gray-500">High</p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-4 shadow-md">
          <p className="text-xs text-gray-400">Risks</p>
          <p className="text-base text-gray-500">1</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-sm text-gray-400">Progress</p>
        <div className="h-2 w-full rounded-2xl bg-gray-100">
          <div className="h-2 w-2/3 rounded-2xl bg-gradient-to-r from-indigo-400 to-pink-400" />
        </div>
        <p className="mt-1 text-right text-xs text-gray-400">67%</p>
      </div>

      <div className="flex justify-center gap-3">
        <button className="rounded-full border border-gray-300 px-5 py-2 text-sm text-gray-500">
          Share
        </button>
        <button className="rounded-full bg-indigo-500 px-5 py-2 text-sm text-white shadow-md">
          Review
        </button>
      </div>
    </div>
  );
}
