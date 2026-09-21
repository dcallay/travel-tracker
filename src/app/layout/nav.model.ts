export interface NavItem {
  label: string;
  count: string;
  /** Router link for the section. */
  link: string;
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
  /** Router commands that open this crumb's place. */
  link: string[];
}
