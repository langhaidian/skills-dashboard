import { getSkillDetail } from '../../../lib/skills';
import Link from 'next/link';

export default async function SkillDetailPage({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}) {
    const { slug } = await params;

    if (slug.length < 3) {
        return (
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Invalid Skill URL</h1>
                    <Link href="/" className="text-blue-400 hover:underline font-mono text-sm">
                        ← Back to Dashboard
                    </Link>
                </div>
            </main>
        );
    }

    const [owner, repo, name] = slug;
    const skill = await getSkillDetail(owner, repo, name);

    if (!skill) {
        return (
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Skill Not Found</h1>
                    <Link href="/" className="text-blue-400 hover:underline font-mono text-sm">
                        ← Back to Dashboard
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto w-full">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-mono text-text-secondary mb-6">
                    <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
                    <span>/</span>
                    <Link href="/all" className="hover:text-white transition-colors">All Skills</Link>
                    <span>/</span>
                    <span className="text-white">{skill.name}</span>
                </nav>

                {/* Skill Header */}
                <div className="tech-card rounded-md p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight mb-2">{skill.name}</h1>
                            <p className="text-text-secondary font-mono text-sm">
                                {skill.owner}/{skill.repo}
                            </p>
                        </div>
                        <a
                            href={skill.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-bold rounded-md hover:bg-neutral-200 transition-colors shrink-0"
                        >
                            <span className="material-icons-outlined text-[16px]">open_in_new</span>
                            View on skills.sh
                        </a>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{skill.description}</p>
                </div>

                {/* Install Command */}
                <div className="tech-card rounded-md p-5 mb-6">
                    <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <span className="material-icons-outlined text-base text-text-muted">terminal</span>
                        Installation
                    </h2>
                    <div className="bg-black border border-border rounded-md p-4">
                        <code className="text-sm font-mono text-green-400">
                            {skill.installCommand}
                        </code>
                    </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="tech-card rounded-md p-4 text-center">
                        <span className="material-icons-outlined text-text-muted text-2xl mb-2 block">person</span>
                        <div className="font-mono text-xs text-text-secondary">Owner</div>
                        <div className="font-bold text-sm mt-1">{skill.owner}</div>
                    </div>
                    <div className="tech-card rounded-md p-4 text-center">
                        <span className="material-icons-outlined text-text-muted text-2xl mb-2 block">folder</span>
                        <div className="font-mono text-xs text-text-secondary">Repository</div>
                        <div className="font-bold text-sm mt-1">{skill.repo}</div>
                    </div>
                    <div className="tech-card rounded-md p-4 text-center">
                        <span className="material-icons-outlined text-text-muted text-2xl mb-2 block">link</span>
                        <div className="font-mono text-xs text-text-secondary">Source</div>
                        <a
                            href={`https://github.com/${skill.owner}/${skill.repo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-sm mt-1 text-blue-400 hover:underline block"
                        >
                            GitHub
                        </a>
                    </div>
                </div>

                {/* Back Link */}
                <Link
                    href="/all"
                    className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-white transition-colors font-mono"
                >
                    <span className="material-icons-outlined text-[16px]">arrow_back</span>
                    Back to All Skills
                </Link>
            </div>
        </main>
    );
}
