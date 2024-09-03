import {INCLUDED_EXT} from '../config.js';
import {removeChunkhash, getLastTwoSubdir} from './subdirResolver';

const hashFn = (url) => {
	// check if the url is valid
	const ext = url.split('.').pop();
	if (!INCLUDED_EXT.has(ext)) return null;

	//Start hashFn
	const arr = url.split('/');
	const fileName = arr.pop();

	const tokenSubdir = getLastTwoSubdir(arr.join('/'));
	return removeChunkhash(fileName, tokenSubdir);
};

export {hashFn};
