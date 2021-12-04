import { checkEqualObjects, getData } from './../helpers/object';
import { GluegunCommand } from 'gluegun';
import file from '../helpers/file';
import { configGetAttribute, configSetter } from '../helpers/global';
import matrix from '../helpers/matrix';
import { prompt, setupProject } from '../helpers/node';
import filterTags from '../pageBuilder';

const questions = {
  'Render project': async () => {
    const { child } = getData();
    if (!child) {
      throw new Error('invalid HTML');
    }
    filterTags(child, configGetAttribute('folders').pages);
  },
  'Live preview': () => {
    matrix();
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
  
    const config = file.read('./kluser/.kluser.json');
    configSetter(config);
  
    const main: any = await prompt('Choose an option', 'list', Object.keys(questions));
    questions[main]();
  },
}

module.exports = command
