
import { GluegunCommand } from 'gluegun';
import file from '../helpers/file';

const { cwd } = require('process');
const { prompt, setupProject } = require('../helpers/node');
const { configSetter, configGetAttribute } = require('../helpers/global');
const { getData, checkEqualObjects } = require('../helpers/object');
const filterTags = require('../pageBuilder');
const matrixRain = require('../helpers/matrix');


const questions = {
  'Render project': async () => {
    const { child } = getData();
    if (!child) {
      throw new Error('invalid HTML');
    }
    filterTags(child, configGetAttribute('folders').pages);
  },
  'Live preview': () => {
    matrixRain();
    let childBackup = {};
    setInterval(async () => {
      const { child } = getData();
      if (!child) {
        throw new Error('invalid HTML');
      }
      if (!checkEqualObjects(childBackup, child)) {
        childBackup = child;
        filterTags(child, configGetAttribute('folders').pages);
      }
    }, 100);
  },
};

const command: GluegunCommand = {
  name: 'kluser',
  run: async () => {
    if (!(file.exists('./kluser'))) {
      await setupProject();
    }
  
    const config = file.read(`${cwd()}/kluser/.kluser.json`);
    configSetter(config);
  
    const main = await prompt('Choose an option', 'list', Object.keys(questions));
    questions[main]();
  },
}

module.exports = command
