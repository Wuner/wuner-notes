const common = require('../promise/common');
async function main() {
  try {
    const result = await common.Ajax(
      'fed-e-task-01-01/notes/promise/api/user.json',
    );
    console.log(result);
    const result1 = await common.Ajax(
      'fed-e-task-01-01/notes/promise/api/class.json',
    );
    console.log(result1);
  } catch (e) {
    console.error(e);
  }
}

main();
