#!/usr/bin/env node

const bot = require("circle-github-bot").create();

demos = [
    bot.artifactLink('docs/index.html', 'docs'),
    bot.artifactLink('preview/index.html', 'dev'),
];

bot.comment(process.env.GH_AUTH_TOKEN, `
<h3>${bot.commitMessage()}</h3>
Preview: <strong>${demos.join(' | ')}</strong>
`);
