#!/usr/bin/env node

const bot = require("circle-github-bot").create();

demos = [
    bot.artifactLink('docs/index.html', 'docs'),
    bot.artifactLink('preview/index.html', 'dev'),
];

bot.comment(process.env.GITHUB_API_TOKEN, `
<h3>${bot.commitMessage()}</h3>
Build artifact links for this commit: <strong>${demos.join(' | ')}</strong>

<em>This is an automated comment from the preview CircleCI job.</em>
`);
