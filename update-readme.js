const fs = require('fs');
const simpleGit = require('simple-git');
const path = require('path');

const git = simpleGit();

async function getRecentCommits() {
  try {
    const log = await git.log({ from: '1 week ago', to: 'HEAD' });
    return log.all.map(commit => `${commit.hash} - ${commit.message} (${commit.date})`).join('\n');
  } catch (error) {
    console.error('Error fetching commits:', error);
    return 'Não foi possível obter os commits.';
  }
}

async function updateReadme(commits) {
  const readmePath = path.join(__dirname, 'README.md');
  try {
    let content = fs.readFileSync(readmePath, 'utf8');
    const newContent = content.replace(/<!-- COMMITS -->[\s\S]*?<!-- \/COMMITS -->/, `<!-- COMMITS -->\n\n## Commits Recentes\n\n${commits}\n<!-- /COMMITS -->`);
    fs.writeFileSync(readmePath, newContent, 'utf8');
    console.log('README.md atualizado com sucesso!');
  } catch (error) {
    console.error('Error updating README.md:', error);
  }
}

(async () => {
  const commits = await getRecentCommits();
  await updateReadme(commits);
})();
