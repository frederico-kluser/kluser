import {
  existsSync, mkdirSync, readFileSync, rmdirSync, writeFileSync,
} from 'fs';

const file = {
  read: (href: string): string => readFileSync(href, { encoding: 'utf8' }),
  write: (fileName: string, fileContent: string, filePath: string) => {
    if (!existsSync(filePath)) {
      mkdirSync(filePath, { recursive: true });
    }
    writeFileSync(filePath + fileName, fileContent, { encoding: 'utf8' });
  },
  delete: (href: string) => rmdirSync(href, { recursive: true }),
  exists: (href: string) => existsSync(href),
};

export default file;
