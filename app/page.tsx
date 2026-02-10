import { getSkillsMetrics, getTopSkillsForChart, getOwnerDistribution, getAllSkills } from '../lib/skills';
import { SearchBar } from '../components/SearchBar';
import { ThemeToggleButton } from '../components/ThemeProvider';
import { SyncIndicator } from '../components/SyncIndicator';
import { CategoryPieChart } from '../components/CategoryPieChart';
import Link from 'next/link';

export default async function Home() {
  const [metrics, topSkills, ownerDist, allSkills] = await Promise.all([
    getSkillsMetrics(),
    getTopSkillsForChart(8),
    getOwnerDistribution(6),
    getAllSkills()
  ]);

  const maxDownloads = topSkills[0]?.downloads || 1;
  const syncedAt = new Date().toISOString();
  const skillNames = allSkills.map(s => `${s.owner}/${s.name}`);


  return (
    <>
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          {/* Mobile spacer */}
          <div className="w-10 lg:hidden" />

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>

          <div className="flex items-center gap-3">
            <SyncIndicator syncedAt={syncedAt} />
            <ThemeToggleButton />
            <a
              href="https://github.com/langhaidian/skills-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-white transition-colors"
              title="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
          <div className="flex-1 flex flex-col gap-3 min-h-0">

            {/* Section: Stats */}
            <section className="shrink-0">
              <div className="flex items-end justify-between mb-2">
                <h2 className="text-lg font-bold tracking-tight">Dashboard</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Skills */}
                <Link href="/all" className="tech-card p-4 rounded-md flex flex-col justify-between h-24 group hover:border-white transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <span className="mono-label text-text-secondary group-hover:text-white transition-colors">Total Skills</span>
                    <span className="material-icons-outlined text-text-muted group-hover:text-white transition-colors">library_books</span>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="text-3xl font-bold font-mono">{metrics.totalSkills || '47,000+'}</span>
                    <span className="text-xs font-mono text-green-400 flex items-center gap-0.5 mb-1">
                      <span className="material-icons-outlined text-[12px]">arrow_upward</span>
                      LIVE
                    </span>
                  </div>
                </Link>

                {/* Trending (24h) */}
                <Link href="/trending" className="tech-card p-4 rounded-md flex flex-col justify-between h-24 group hover:border-white transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <span className="mono-label text-text-secondary group-hover:text-white transition-colors">Trending (24h)</span>
                    <span className="material-icons-outlined text-text-muted group-hover:text-white transition-colors">trending_up</span>
                  </div>
                  <div className="flex flex-col mt-auto">
                    <span className="text-xl font-bold font-mono truncate">{metrics.trendingSkillName || 'Loading...'}</span>
                  </div>
                </Link>

                {/* Hottest Skill */}
                <Link href="/hot" className="tech-card p-4 rounded-md flex flex-col justify-between h-24 group hover:border-white transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <span className="mono-label text-text-secondary group-hover:text-white transition-colors">Hottest Skill</span>
                    <span className="material-icons-outlined text-text-muted group-hover:text-white transition-colors">local_fire_department</span>
                  </div>
                  <div className="flex flex-col mt-auto">
                    <span className="text-xl font-bold font-mono truncate">{metrics.hottestSkillName || 'Agentic AI'}</span>
                  </div>
                </Link>
              </div>
            </section>

            {/* Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">

              {/* Top Skills by Downloads */}
              <div className="tech-card p-3 rounded-md flex flex-col min-h-0 overflow-hidden">
                <div className="flex items-center justify-between mb-2 shrink-0">
                  <h3 className="text-sm font-semibold">Top Skills by Downloads</h3>
                  <span className="font-mono text-xs text-text-secondary">TOP 8</span>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-1 min-h-0 overflow-hidden">
                  {topSkills.map((skill, i) => (
                    <div key={skill.name} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <a
                          href={skill.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-text-secondary truncate max-w-[200px] hover:text-white transition-colors"
                          title={skill.name}
                        >
                          {i + 1}. {skill.name}
                        </a>
                        <span className="text-xs font-mono text-white">{skill.downloadsFormatted}</span>
                      </div>
                      <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 group-hover:from-blue-400 group-hover:to-blue-300 transition-colors rounded-full"
                          style={{ width: `${(skill.downloads / maxDownloads) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner Distribution */}
              <div className="tech-card p-3 rounded-md flex flex-col min-h-0 overflow-hidden">
                <div className="flex items-center justify-between mb-2 shrink-0">
                  <h3 className="text-sm font-semibold">Skills by Organization</h3>
                  <span className="font-mono text-xs text-text-secondary">TOP 6</span>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-1 min-h-0 overflow-hidden">
                  {ownerDist.map((item, i) => {
                    const colors = [
                      'from-purple-500 to-purple-400',
                      'from-green-500 to-green-400',
                      'from-orange-500 to-orange-400',
                      'from-pink-500 to-pink-400',
                      'from-cyan-500 to-cyan-400',
                      'from-yellow-500 to-yellow-400',
                    ];
                    return (
                      <div key={item.owner} className="group">
                        <div className="flex items-center justify-between mb-1.5">
                          <a
                            href={`https://skills.sh/${item.owner}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-text-secondary truncate max-w-[200px] hover:text-white transition-colors"
                          >
                            {item.owner}
                          </a>
                          <span className="text-sm font-mono text-white">{item.count} skills ({item.percentage}%)</span>
                        </div>
                        <div className="h-2.5 bg-neutral-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colors[i % colors.length]} transition-colors rounded-full`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Section: Category Distribution */}
            <CategoryPieChart skillNames={skillNames} />

            {/* Footer / Usage Guide */}
            <div className="border-t border-border pt-2 mt-auto shrink-0">
              <h3 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                <span className="material-icons-outlined text-base">terminal</span>
                <span>Quick Start</span>
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">

                {/* Save/Add */}
                <div className="bg-black border border-border rounded-md p-2 group hover:border-text-secondary transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary text-xs font-mono">Install a skill</span>
                    <span className="material-icons-outlined text-text-muted text-sm">download</span>
                  </div>
                  <code className="text-xs font-mono text-green-400 block bg-surface/50 p-2 rounded">
                    npx skills add &lt;name&gt;
                  </code>
                </div>

                {/* Search */}
                <div className="bg-black border border-border rounded-md p-2 group hover:border-text-secondary transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary text-xs font-mono">Search skills</span>
                    <span className="material-icons-outlined text-text-muted text-sm">search</span>
                  </div>
                  <code className="text-xs font-mono text-blue-400 block bg-surface/50 p-2 rounded">
                    npx skills search &lt;query&gt;
                  </code>
                </div>

                {/* List */}
                <div className="bg-black border border-border rounded-md p-2 group hover:border-text-secondary transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary text-xs font-mono">List installed</span>
                    <span className="material-icons-outlined text-text-muted text-sm">list</span>
                  </div>
                  <code className="text-xs font-mono text-orange-400 block bg-surface/50 p-2 rounded">
                    npx skills list
                  </code>
                </div>

                {/* Update */}
                <div className="bg-black border border-border rounded-md p-2 group hover:border-text-secondary transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary text-xs font-mono">Update skills</span>
                    <span className="material-icons-outlined text-text-muted text-sm">update</span>
                  </div>
                  <code className="text-xs font-mono text-purple-400 block bg-surface/50 p-2 rounded">
                    npx skills update
                  </code>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
