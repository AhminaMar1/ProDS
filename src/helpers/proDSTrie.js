import {getrurl} from './subdirResolver.js';

const pathDepth = 2; //todo: has to be dynamic
const PRODS_TRIE = {};

const addToTrie = (file) => {
	const ext = file.split('.').pop();
	const arr = file.split('');
	let pointer = PRODS_TRIE,
		pathDepthGate = 1;
	arr.forEach((el) => {
		const key = el + ext;
		if (el === '/') pathDepthGate++;
		if (!pointer[key]) {
			pointer[key] = {matches: []};
		}
		pointer = pointer[key];
		if (pathDepth) {
		}
		if (pathDepthGate > pathDepth) pointer.matches.push(file);
	});
};

const returnMatches = (rurl) => {
	const ext = rurl.split('.').pop();
	const arr = rurl.split('');
	let i = 0,
		el = arr[i++],
		key = el + ext,
		pointer = PRODS_TRIE,
		prevPointer;
	while (pointer && el) {
		prevPointer = pointer;
		pointer = pointer[key];
		el = arr[i++];
		key = el + ext;
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

const resolve_url = (preFile, resFile) => {
	const arr = preFile.split('/');
	for (let i = 0; i < pathDepth; i++) {
		arr.pop();
	}

	return arr.join('/') + resFile;
};

export {addToTrie, trieMatch, resolve_url};
