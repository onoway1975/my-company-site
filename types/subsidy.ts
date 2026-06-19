/** Claude が入力文から抽出する検索条件 */
export interface SearchConditions {
  keywords: string[];
  industry: string | null;
  area: string | null;
  employees: string | null;
  summary: string;
}

/** Jグランツ一覧APIのレスポンス1件 */
export interface JGrantsSubsidy {
  id: string;
  title: string;
  acceptance_start_datetime: string | null;
  acceptance_end_datetime: string | null;
  subsidy_max_limit: number | null;
}

/** Jグランツ詳細APIのレスポンス */
export interface JGrantsDetail {
  id: string;
  title: string;
  subsidy_rate: string | null;
  subsidy_max_limit: number | null;
  project_end_deadline: string | null;
  target_area: string | null;
  target_number_of_employees: string | null;
}

/** Claude マッチング結果1件 */
export interface MatchResult {
  subsidy_id: string;
  title: string;
  match_score: number;
  reasons: string[];
  cautions: string[];
  subsidy_max_limit: number | null;
  acceptance_end_datetime: string | null;
  official_url: string;
}

/** APIレスポンス */
export type MatchResponse =
  | { matches: MatchResult[] }
  | { error: string };
