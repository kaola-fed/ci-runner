const cron = require('node-cron');
const fetch = require('node-fetch');
const db = require('./utils/db');

const CMDS = [
  'mkdir .tmp',
  'cd .tmp',
  'git clone --branch <branch> --single-branch <sshUrl> .',
  'git checkout <sha>',
  'npm i',
  'npm test',
].join(' && ');


const {
  CI_TOKEN = 'ci',
  WEBHOOK_URL = 'http://localhost:8088/_webhook_',
} = process.env;

const docker = new Docker();
const dockerRun = cmds => {
  return new Promise((resolve, reject) => {
    docker.run('ci', ['bash', '-c', cmds], process.stdout, (err, data, container) => {
      container.remove();
      if (err || data.StatusCode) {
        return reject();
      }
      resolve();
    });
  })
}

const runTask = async task => {
  const { branch, sshUrl, sha } = task;
  const cmds = CMDS.replace('<branch>', branch)
    .replace('<sshUrl>', sshUrl)
    .replace('<sha>', sha);
  try {
    await dockerRun(cmds);
    await db.add(task, true);
  } catch(e) {
    await db.add(task, false);
  }
};

setInterval(async () => {
  const response = await fetch(WEBHOOK_URL, {
    headers: { 'X-Gitlab-Token': CI_TOKEN }
  });
  const tasks = await response.json();
  for (let task of tasks) {
    await runTask(task);
  }
}, 1 * 1000);
