import {INCLUDED_EXT} from '../config.js';
import {removeChunkhash, getLastTwoSubdir} from './subdirResolver.js';

const hashFn = (url) => {
	// check if the url is valid
	const splitQP = url?.split('?');
	const splitAnchor = splitQP[0]?.split('#');
	const pureURL = splitAnchor[0];
	const ext = pureURL.split('.').pop();
	if (!INCLUDED_EXT.has(ext)) return null;

	//Start hashFn
	const arr = pureURL.split('/');
	const fileName = arr.pop();

	const tokenSubdir = getLastTwoSubdir(arr.join('/')+'/');
	return removeChunkhash(fileName, tokenSubdir);
};

export {hashFn};
