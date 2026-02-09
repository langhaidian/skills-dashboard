
const fs = require('fs');
const cheerio = require('cheerio');

async function debugSkills() {
    try {
        console.log("Fetching https://skills.sh...");
        const res = await fetch('https://skills.sh');
        const html = await res.text();
        console.log(`Fetched ${html.length} bytes`);

        const $ = cheerio.load(html);
        console.log("Cheerio loaded.");

        // Test logic - specific search for skill links
        console.log("\nSearching for skill links...");
        let skillCount = 0;

        $('a').each((i, el) => {
            let href = $(el).attr('href');
            if (!href) return;

            // Resolve relative
            if (href.startsWith('/')) {
                href = `https://skills.sh${href}`;
            }

            if (!href.startsWith('https://skills.sh/')) return;
            if (href.includes('/docs') || href.includes('/agents') || href === 'https://skills.sh/') return;

            const parts = href.replace('https://skills.sh/', '').split('/');
            // Expect owner/repo/name
            // But from markdown view we saw: https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
            // That is 3 parts.

            if (parts.length < 3) return;

            const [owner, repo, name] = parts;

            // Log the first few that match
            if (skillCount < 5) {
                console.log(`  MATCH ${skillCount + 1}: ${href}`);
                console.log(`    Parts: ${parts}`);
                console.log(`    Text: "${$(el).text().trim().substring(0, 50)}..."`);

                // Inspect structure for downloads
                // Previous logic: $(el).find('div').last().text()
                const divs = $(el).find('div');
                console.log(`    Div count: ${divs.length}`);
                divs.each((j, div) => {
                    console.log(`      Div ${j}: "${$(div).text().trim()}"`);
                });
            }
            skillCount++;
        });

        console.log(`\nTotal potential skill links found: ${skillCount}`);

    } catch (error) {
        console.error("Error fetching:", error);
    }
}

debugSkills();
