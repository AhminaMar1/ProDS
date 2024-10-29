import {getrurl} from './subdirResolver.js';

const pathDepth = 2; //todo: has to be dynamic
const PRODS_TRIE = {};

const addToTrie = (file) => {
	const arr = file.split('');
	let pointer = PRODS_TRIE,
		pathDepthGate = 1;
	arr.forEach((el) => {
		if (el === '/') pathDepthGate++;
		if (!pointer[el]) {
			pointer[el] = {matches: []};
		}
		pointer = pointer[el];
		if (pathDepth) {
		}
		if (pathDepthGate > pathDepth) pointer.matches.push(file);
	});
};

const returnMatches = (rurl) => {
	const arr = rurl.split('');
	let i = 0,
		el = arr[i++],
		pointer = PRODS_TRIE,
		prevPointer;
	while (pointer && el) {
		prevPointer = pointer;
		pointer = pointer[el];
		el = arr[i++];
	}

	return pointer ? pointer.matches : prevPointer.matches;
};

const trieMatch = (fullurl) => {
	const resolvedUrl = getrurl(fullurl);
	if (!resolvedUrl) return null;
	const [fileName, tokenSubdir] = resolvedUrl;
	const rurl = tokenSubdir + fileName;
	const res = returnMatches(rurl);

	if (!res) return {success: false, resolve: false};
	return {success: res.length === 1, resolve: true, res: res[0]};
};

export {addToTrie, trieMatch};
