export type NavId = 'explore' | 'left' | 'timeline' | 'add';

export interface NavItem {
  id: NavId;
  label: string;
  count: string;
  active: boolean;
}

/** The score of the level above the one being viewed, shown at the foot of the sidebar. */
export interface ParentScore {
  label: string;
  pct: string;
  bar: string;
  note: string;
}

export interface Crumb {
  label: string;
  /** Separator shown after the crumb; empty for the last one. */
  sep: string;
  active: boolean;
  path: number[];
}
