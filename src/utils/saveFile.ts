import {writeFile, mkdir} from 'fs/promises';
import {dirname} from 'path';

export default async (path: string, data: string) => {
    const parent = dirname(path);
    await mkdir(parent, {recursive: true});
    await writeFile(path, data, 'utf-8');
};
