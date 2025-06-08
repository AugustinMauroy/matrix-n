import { readFileSync, writeFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

const FILE_PATH = './src/mod.ts';

const fileContent = readFileSync(FILE_PATH, 'utf-8');
const strippedContent = stripTypeScriptTypes(fileContent);
writeFileSync(
	FILE_PATH.replace('.ts', '.js'),
	strippedContent,
	'utf-8'
);
