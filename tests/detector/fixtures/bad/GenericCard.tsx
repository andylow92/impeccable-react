// Intentionally bad. Used as a positive test fixture for the detector.
// Covers: ui-uniform-radius, ui-generic-saas-card, ts-no-any.

export function GenericCard(props: any) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-md">
      <div className="mb-6 h-2 w-full rounded-2xl bg-gradient-to-r from-indigo-400 to-pink-400" />
      <h2 className="mb-2 text-center text-xl font-medium text-gray-700">{props.title}</h2>
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
