import type { SearchConditions, JGrantsSubsidy, JGrantsDetail } from "@/types/subsidy";

const BASE_URL = "https://api.jgrants-portal.go.jp/exp/v1/public";

interface SearchOptions {
  industry?: string | null;
  area?: string | null;
  employees?: string | null;
}

/** 単一キーワードで公募中補助金を検索 */
async function searchByKeyword(
  keyword: string,
  options: SearchOptions = {}
): Promise<JGrantsSubsidy[]> {
  // keyword は最小2文字を保証
  const kw = keyword.trim();
  if (kw.length < 2) return [];

  const params = new URLSearchParams({
    keyword: kw,
    acceptance: "1",
    sort: "acceptance_end_datetime",
    order: "ASC",
  });

  if (options.area) params.set("target_area_search", options.area);
  if (options.employees) params.set("target_number_of_employees", options.employees);
  if (options.industry) params.set("industry", options.industry);

  const url = `${BASE_URL}/subsidies?${params.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`[subsidy] jGrants search failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    const items = data.result ?? [];
    return items.map((item: Record<string, unknown>) => ({
      id: String(item.id ?? ""),
      title: String(item.title ?? ""),
      acceptance_start_datetime: item.acceptance_start_datetime
        ? String(item.acceptance_start_datetime)
        : null,
      acceptance_end_datetime: item.acceptance_end_datetime
        ? String(item.acceptance_end_datetime)
        : null,
      subsidy_max_limit: item.subsidy_max_limit != null
        ? Number(item.subsidy_max_limit)
        : null,
    }));
  } catch (e) {
    console.error("[subsidy] jGrants search error:", e);
    return [];
  }
}

/** 複数キーワードで順次検索し、マージ＆重複排除。最大20件 */
export async function searchSubsidies(
  conditions: SearchConditions
): Promise<JGrantsSubsidy[]> {
  const options: SearchOptions = {
    industry: conditions.industry,
    area: conditions.area,
    employees: conditions.employees,
  };

  const seen = new Set<string>();
  const merged: JGrantsSubsidy[] = [];

  for (const keyword of conditions.keywords) {
    const results = await searchByKeyword(keyword, options);
    for (const item of results) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
    if (merged.length >= 20) break;
  }

  return merged.slice(0, 20);
}

/** 補助金詳細を取得 */
export async function getSubsidyDetail(
  id: string
): Promise<JGrantsDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/subsidies/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`[subsidy] jGrants detail failed: ${res.status}`);
      return null;
    }
    const data = await res.json();
    const r = data.result ?? data;
    return {
      id: String(r.id ?? id),
      title: String(r.title ?? ""),
      subsidy_rate: r.subsidy_rate ? String(r.subsidy_rate) : null,
      subsidy_max_limit: r.subsidy_max_limit != null ? Number(r.subsidy_max_limit) : null,
      project_end_deadline: r.project_end_deadline ? String(r.project_end_deadline) : null,
      target_area: r.target_area ? String(r.target_area) : null,
      target_number_of_employees: r.target_number_of_employees
        ? String(r.target_number_of_employees)
        : null,
    };
  } catch (e) {
    console.error("[subsidy] jGrants detail error:", e);
    return null;
  }
}

/** 公式URL組み立て */
export function buildOfficialUrl(id: string): string {
  return `https://www.jgrants-portal.go.jp/subsidy/${id}`;
}
