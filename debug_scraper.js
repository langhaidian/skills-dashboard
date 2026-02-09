
const fs = require('fs');

async function debug() {
    const trendingHtml = await fetch('https://skills.sh/trending').then(res => res.text());
    const hotHtml = await fetch('https://skills.sh/hot').then(res => res.text());

    // Log part of HTML to see structure
    console.log("--- TRENDING HTML SNIPPET ---");
    // Find where the list starts. Search for "find-skills" which is usually #1
    const tIndex = trendingHtml.indexOf('find-skills');
    console.log(trendingHtml.substring(Math.max(0, tIndex - 500), tIndex + 500));

    console.log("\n--- HOT HTML SNIPPET ---");
    // Search for "agent-skills" or just the first item
    const hIndex = hotHtml.indexOf('agent-skills');
    // or look for "1" class="rank"
    console.log(hotHtml.substring(Math.max(0, hIndex - 500), hIndex + 500));
}

debug();
