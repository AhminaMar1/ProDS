import {getrurl, removeChunkhash} from './subdirResolver.js';

const hashFn = (url) => {
	const res = getrurl(url);
	if (!res) return res;
	const [fileName, tokenSubdir] = res;
	return removeChunkhash(fileName, tokenSubdir);
};

export {hashFn};
