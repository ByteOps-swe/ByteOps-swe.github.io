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

// Here we have the generateVerbaliHTML function. Since it has only files and no other folder it need to cycle in reverse order through all the files.
function generateVerbaliHTML(folderTree) {
  html = '<ul class="nested">';
  for (const item of folderTree.reverse()) {
    html += `<li class="${item.type}">`;
    html += `<a href="${item.html_url}" target="_blank">${item.name}</a>`;
    html += '</li>';
  }
  html += '</ul>';
  return html;
}

function generateHTML(folderTree) {
  html = '<ul class="nested">';
  for (const item of folderTree) {
    html += `<li class="${item.type}">`;
    if (item.type === 'folder') {
      html += `<span class="Folder"><a>${item.name}</a></span>`;
      if(item.name === 'Verbali'){
        html += generateVerbaliHTML(item.children)
      }else{
        html += generateHTML(item.children);
      }
    } else {
      html += `<a href="${item.html_url}" target="_blank">${item.name}</a>`;
    }
    html += '</li>';
  }
  html += '</ul>';
  return html;
}

function generateTopHtml(folderTree) {
  html = '<ul>';
  for (const item of folderTree) {
    if (item.type === 'folder') {
      html += `<li class="${item.type}">`;
      html += `<span class="Folder"><a>${item.name}</a></span>`;
      html += generateHTML(item.children);
      html += '</li>';
    }
  }
  html += '</ul>';
  return html;
}


function generateLettere(folderTree) {
  html = '<ul>';
  // Checks if a file that has "Lettera di presentazione di PB", save it in a variable and pops it from the array
  // if(folderTree.length == 3){  
    var lettera;
    var i = -1;
    for (const item of folderTree) {
        i += 1;
        console.log(item);
        console.log(i);
        if (item.name === 'Lettera di presentazione PB.pdf') {
            lettera = item;
            folderTree.splice(i, 1);
            break;
        }
    }
    console.log(lettera)

    if (lettera) {
        html += `<li>`;
        html += `<span class="File"><a href="${lettera.html_url}" target="_blank">${lettera.name}</a></span>`;
        html += '</li>';
    }
  // }
  // Puts the lettera var on the top of the other items
  

  for (const item of folderTree.reverse()) {
    // Checks if a file that has "Lettera di presentazione di PB", save it in a variable and pops it from the array
    if (item.type === 'file') {
      html += `<li>`;
      html += `<span class="File"><a href="${item.html_url}" target="_blank">${item.name}</a></span>`;
      html += '</li>';
    }
  }
  html += '</ul>';
  return html;
}

async function main() {
const owner = 'ByteOps-swe';
const repo = 'Documents';

const folderTree = await getRepoFolderTree(owner, repo);

if (folderTree) {
  const html = generateTopHtml(folderTree);
  const html2 = generateLettere(folderTree);
  const place = document.getElementById('files');
  const place2 = document.getElementById('presentazione');
  place.innerHTML = html;
  place2.innerHTML = html2;
  document.dispatchEvent(new Event('FolderTree'));
}
}

main();
