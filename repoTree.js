async function fetchRepoContents(owner, repo, path = '') {
  try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
      if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data:', error.message);
      return null;
  }
}

async function getRepoFolderTree(owner, repo, path = '') {
try {
  const response = await fetchRepoContents(owner, repo, path);
  const folderTree = [];

  for (const item of response) {
    if(item.name != 'README.md' && item.name != '.gitignore'){
      if (item.type === 'dir') {
          const subtree = await getRepoFolderTree(owner, repo, item.path);
          folderTree.push({ name: item.name, type: 'folder', html_url: item.html_url, children: subtree });
      } else {
          folderTree.push({ name: item.name, type: 'file', html_url: item.html_url });
      }
    }
  }

  return folderTree;
} catch (error) {
  console.error('Error fetching folder tree:', error.message);
  return null;
}
}

function generateHTML(folderTree, top = true) {
  let html;
  if(top){
    html = '<ul>';
  } else {
    html = '<ul class="nested">';
  }
  for (const item of folderTree) {
    html += `<li class="${item.type}">`;
    if (item.type === 'folder') {
      html += `<span class="Folder"><a>${item.name}</a></span>`;
      html += generateHTML(item.children, false);
    } else {
      html += `<a href="${item.html_url}" target="_blank">${item.name}</a>`;
    }
    html += '</li>';
  }
  html += '</ul>';
  return html;
}

async function main() {
const owner = 'ByteOps-swe';
const repo = 'Documents';

const folderTree = await getRepoFolderTree(owner, repo);

if (folderTree) {
  const html = generateHTML(folderTree);
  const place = document.getElementById('files');
  place.innerHTML = html;
  document.dispatchEvent(new Event('FolderTree'));
}
}

main();
