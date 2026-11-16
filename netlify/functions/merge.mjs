// Merges two copies of the data. For each project or expense the newest edit wins.
// A delete is kept as a "tombstone" so it reaches your other devices too.
export function mergeStates(a, b) {
  const tomb = {};
  [a.tomb, b.tomb].forEach((t) => {
    Object.keys(t || {}).forEach((k) => {
      if (!tomb[k] || t[k] > tomb[k]) tomb[k] = t[k];
    });
  });

  function mergeList(x, y) {
    const m = {};
    (x || []).forEach((r) => { m[r.id] = r; });
    (y || []).forEach((r) => {
      const o = m[r.id];
      if (!o || (r._u || 0) > (o._u || 0)) m[r.id] = r;
    });
    return Object.keys(m)
      .map((k) => m[k])
      .filter((r) => !(tomb[r.id] && tomb[r.id] >= (r._u || 0)));
  }

  const useB = (b.cfgU || 0) > (a.cfgU || 0);
  return {
    projects: mergeList(a.projects, b.projects),
    expenses: mergeList(a.expenses, b.expenses),
    tomb,
    cfg: useB ? b.cfg || {} : a.cfg || {},
    cfgU: Math.max(a.cfgU || 0, b.cfgU || 0),
  };
}
