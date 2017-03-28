const cron = require('node-cron');
const fetch = require('node-fetch');
const spawn = require('child_process').spawn;
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

const runTask = async task => {
  const { branch, sshUrl, sha } = task;
  const cmds = CMDS.replace('<branch>', branch)
    .replace('<sshUrl>', sshUrl)
    .replace('<sha>', sha);

  const docker = spawn('docker', ['run', '-it', 'ci', '/bin/bash', `"${cmds}"`]);
  docker.stdout.on('data', data => {
    console.log(`out: ${data}`);
  });
  docker.stderr.on('data', data => {
    console.log(`err: ${data}`);
  });
  docker.on('close', code => {
    console.log(`code: ${code}`);
  })
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
