
import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';

export interface SkillsMetrics {
    totalSkills: string;
    trendingCount: string;
    trendingSkillName: string;
    hottestSkillName: string;
    hottestSkillPopularity: string;
}

const REVALIDATE_SECONDS = 3600;
const BASE_URL = 'https://skills.sh';
const ALLOW_REMOTE = process.env.SKILLS_ALLOW_REMOTE === '1' || process.env.NODE_ENV === 'production';

async function fetchHtml(url: string): Promise<string | null> {
    if (!ALLOW_REMOTE) return null;
    try {
        const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
        if (!res.ok) return null;
        return await res.text();
    } catch {
        return null;
    }
}

function selectSkillAnchors($: cheerio.CheerioAPI) {
    const scoped = $('main a');
    return scoped.length > 0 ? scoped : $('a');
}

function normalizeSkillUrl(href: string): string | null {
    if (href.startsWith('/')) return `${BASE_URL}${href}`;
    if (href.startsWith(BASE_URL)) return href;
    return null;
}

function isSkillUrl(href: string): boolean {
    if (!href.startsWith(`${BASE_URL}/`)) return false;
    if (href === `${BASE_URL}/`) return false;
    if (href.includes('/docs') || href.includes('/agents')) return false;
    return true;
}

function parseSkillParts(href: string): { owner: string; repo: string; name: string } | null {
    const parts = href.replace(`${BASE_URL}/`, '').split('/');
    if (parts.length < 3) return null;
    const [owner, repo, name] = parts;
    return { owner, repo, name };
}

function parseRankAndDownloads($el: cheerio.Cheerio<Element>, fallbackRank: number): { rank: number; downloads: string } {
    const divs = $el.find('div');
    let downloads = '?';
    let rank = fallbackRank;

    if (divs.length >= 2) {
        const rankText = divs.eq(0).text().trim();
        const rankInt = parseInt(rankText.replace(/[^\d]/g, ''), 10);
        if (!isNaN(rankInt)) rank = rankInt;

        const lastText = divs.eq(divs.length - 1).text().trim();
        if (lastText) downloads = lastText;
    }

    return { rank, downloads };
}

export async function getSkillsMetrics(): Promise<SkillsMetrics> {
    const [homePage, trendingPage, hotPage] = await Promise.all([
        fetchHtml(`${BASE_URL}`),
        fetchHtml(`${BASE_URL}/trending`),
        fetchHtml(`${BASE_URL}/hot`)
    ]);

    const $home = cheerio.load(homePage || '');
    const $trending = cheerio.load(trendingPage || '');
    const $hot = cheerio.load(hotPage || '');

    // 1. Total Skills
    // Look for "All Time (47,117)" link text
    let totalSkills = "0";
    $home('a').each((_, el) => {
        const text = $home(el).text();
        const match = text.match(/All Time \(([\d,]+)\)/);
        if (match) {
            totalSkills = match[1];
        }
    });

    // 2. Trending (24h)
    // Prefer counting anchors within main to reduce DOM structure coupling
    const trendingAnchors = selectSkillAnchors($trending).filter((_, el) => {
        const href = $trending(el).attr('href');
        if (!href) return false;
        const normalized = normalizeSkillUrl(href);
        return !!(normalized && isSkillUrl(normalized));
    });
    const trendingCount = trendingAnchors.length.toString() || "0";

    // Get first trending skill name
    const firstTrendingAnchor = trendingAnchors.first();
    const firstTrendingHeader = firstTrendingAnchor.find('h3').first();
    const trendingSkillName = firstTrendingHeader.length > 0
        ? firstTrendingHeader.text().trim()
        : firstTrendingAnchor.text().trim() || "Unknown";


    // 3. Hottest Skill
    // First item on /hot
    let hottestSkillName = "Unknown";
    let hottestSkillPopularity = "0%";

    // Find the first h3 inside main, which should be the first skill name
    const firstHotHeader = $hot('main h3').first();
    if (firstHotHeader.length > 0) {
        hottestSkillName = firstHotHeader.text().trim();

        // Navigate up to the row container (a tag) to find the metric
        const row = firstHotHeader.closest('a');
        if (row.length > 0) {
            // The last div usually contains the metric in the structure:
            // div(rank) ... div(name) ... div(metric)
            const lastDiv = row.find('div').last();
            const metricText = lastDiv.text().trim();

            if (metricText) {
                hottestSkillPopularity = metricText;
            }
        }
    }

    return {
        totalSkills,
        trendingCount,
        trendingSkillName,
        hottestSkillName,
        hottestSkillPopularity
    };
}

export interface Skill {
    rank: number;
    name: string;
    owner: string;
    repo: string;
    downloads: string;
    url: string;
    description?: string;
}

export async function getAllSkills(): Promise<Skill[]> {
    const html = await fetchHtml(`${BASE_URL}`);
    if (!html) return [];
    const $ = cheerio.load(html);
    const skills: Skill[] = [];
    const seen = new Set<string>();

    selectSkillAnchors($).each((_, el) => {
        const rawHref = $(el).attr('href');
        if (!rawHref) return;

        const normalized = normalizeSkillUrl(rawHref);
        if (!normalized || !isSkillUrl(normalized)) return;

        const parts = parseSkillParts(normalized);
        if (!parts) return;

        const key = `${parts.owner}/${parts.repo}/${parts.name}`;
        if (seen.has(key)) return;
        seen.add(key);

        const { rank, downloads } = parseRankAndDownloads($(el), skills.length + 1);

        skills.push({
            rank,
            name: parts.name,
            owner: parts.owner,
            repo: parts.repo,
            downloads,
            url: normalized
        });
    });

    return skills.sort((a, b) => a.rank - b.rank);
}

export async function getTrendingSkills(): Promise<Skill[]> {
    const html = await fetchHtml(`${BASE_URL}/trending`);
    if (!html) return [];
    const $ = cheerio.load(html);
    const skills: Skill[] = [];
    const seen = new Set<string>();

    selectSkillAnchors($).each((_, el) => {
        const rawHref = $(el).attr('href');
        if (!rawHref) return;

        const normalized = normalizeSkillUrl(rawHref);
        if (!normalized || !isSkillUrl(normalized)) return;

        const parts = parseSkillParts(normalized);
        if (!parts) return;

        const key = `${parts.owner}/${parts.repo}/${parts.name}`;
        if (seen.has(key)) return;
        seen.add(key);

        const { rank, downloads } = parseRankAndDownloads($(el), skills.length + 1);

        skills.push({
            rank,
            name: parts.name,
            owner: parts.owner,
            repo: parts.repo,
            downloads,
            url: normalized
        });
    });

    return skills.sort((a, b) => a.rank - b.rank);
}

export async function getHotSkills(): Promise<Skill[]> {
    const html = await fetchHtml(`${BASE_URL}/hot`);
    if (!html) return [];
    const $ = cheerio.load(html);
    const skills: Skill[] = [];
    const seen = new Set<string>();

    selectSkillAnchors($).each((_, el) => {
        const rawHref = $(el).attr('href');
        if (!rawHref) return;

        const normalized = normalizeSkillUrl(rawHref);
        if (!normalized || !isSkillUrl(normalized)) return;

        const parts = parseSkillParts(normalized);
        if (!parts) return;

        const key = `${parts.owner}/${parts.repo}/${parts.name}`;
        if (seen.has(key)) return;
        seen.add(key);

        const { rank, downloads } = parseRankAndDownloads($(el), skills.length + 1);

        skills.push({
            rank,
            name: parts.name,
            owner: parts.owner,
            repo: parts.repo,
            downloads,
            url: normalized
        });
    });

    return skills.sort((a, b) => a.rank - b.rank);
}

// Helper to parse download count strings like "106.9K" to numbers
function parseDownloads(str: string): number {
    if (!str || str === '?') return 0;
    const cleaned = str.trim().toUpperCase().replace(/\+/g, '').replace(/,/g, '');
    const match = cleaned.match(/^([\d.]+)([KMB])?$/);
    if (!match) return parseInt(cleaned, 10) || 0;

    const num = parseFloat(match[1]);
    const suffix = match[2];

    switch (suffix) {
        case 'K': return num * 1000;
        case 'M': return num * 1000000;
        case 'B': return num * 1000000000;
        default: return num;
    }
}

export interface SkillDetail {
    name: string;
    owner: string;
    repo: string;
    url: string;
    description: string;
    installCommand: string;
}

export async function getSkillDetail(owner: string, repo: string, name: string): Promise<SkillDetail | null> {
    const url = `${BASE_URL}/${owner}/${repo}/${name}`;
    const html = await fetchHtml(url);
    if (!html) {
        return {
            name,
            owner,
            repo,
            url,
            description: 'Skill details are only available when connected to skills.sh.',
            installCommand: `npx skills add ${owner}/${repo}/${name}`,
        };
    }
    const $ = cheerio.load(html);

    // Try to extract description from meta tag or first paragraph
    let description = $('meta[name="description"]').attr('content') || '';
    if (!description) {
        description = $('main p').first().text().trim() || 'No description available.';
    }

    return {
        name,
        owner,
        repo,
        url,
        description,
        installCommand: `npx skills add ${owner}/${repo}/${name}`,
    };
}

export const __test = {
    normalizeSkillUrl,
    isSkillUrl,
    parseSkillParts,
    parseRankAndDownloads,
    parseDownloads,
    selectSkillAnchors
};

export interface ChartSkill {
    name: string;
    downloads: number;
    downloadsFormatted: string;
    url: string;
}

export async function getTopSkillsForChart(limit: number = 8): Promise<ChartSkill[]> {
    const skills = await getAllSkills();

    return skills
        .map(s => ({
            name: s.name,
            downloads: parseDownloads(s.downloads),
            downloadsFormatted: s.downloads,
            url: s.url
        }))
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, limit);
}

export interface OwnerDistribution {
    owner: string;
    count: number;
    percentage: number;
}

export async function getOwnerDistribution(limit: number = 6): Promise<OwnerDistribution[]> {
    const skills = await getAllSkills();

    // Count skills per owner
    const ownerCounts = new Map<string, number>();
    skills.forEach(s => {
        ownerCounts.set(s.owner, (ownerCounts.get(s.owner) || 0) + 1);
    });

    // Sort by count and take top N
    const sorted = Array.from(ownerCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);

    const total = skills.length;

    return sorted.map(([owner, count]) => ({
        owner,
        count,
        percentage: Math.round((count / total) * 100)
    }));
}
