/**
 * @author Wuner
 * @date 2020/8/22 12:16
 * @description
 */
const shell = require('shelljs');
const signale = require('signale');

const { Signale } = signale;
const tasks = ['sh git-push.sh', 'sh deploy.sh'];

tasks.every((task) => {
  signale.start(task);

  const interactive = new Signale({ interactive: true });
  interactive.pending(task);

  const result = shell.exec(`${task} --silent`);

  if (result.code !== 0) {
    interactive.error(task);
    return false;
  }

  interactive.success(task);
  return true;
});
