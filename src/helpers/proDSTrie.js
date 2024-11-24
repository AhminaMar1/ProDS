import {getrurl} from './subdirResolver.js';

const PRODS_TRIE = {};

const addToTrie = (file) => {
	const fullDir = file.split('.');
	const ext = fullDir.pop();
	const arr = file.split('');
	const len = fullDir.join('').split('/').length;
	let pointer = PRODS_TRIE,
		pathDepthGate = 1;
	arr.forEach((el) => {
		const key = el + ext;
		if (el === '/') pathDepthGate++;
		if (!pointer[key]) {
			pointer[key] = {matches: []};
		}
		pointer = pointer[key];
		if (pathDepthGate >= len) pointer.matches.push(file);
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

const hasTheSamePath = (dir1, dir2) => {
	const dir2BeforeOp = dir2.split('/');
	dir2BeforeOp.pop();
	const dir2AfterOp = dir2BeforeOp.join('/');

	const dir1BeforeOp = dir1.split('/');

	const dir1AfterOp = dir1BeforeOp.join('/');
	return dir1AfterOp === dir2AfterOp;
};

const trieMatch = (fullurl) => {
	const resolvedUrl = getrurl(fullurl);
	if (!resolvedUrl) return null;
	const [fileName, tokenSubdir] = resolvedUrl;
	const rurl = tokenSubdir + fileName;
	const res = returnMatches(rurl);
	if (!res || !res.length) return {success: false, resolved: false};

	const hasTheSamePathBool = hasTheSamePath(fullurl, res[0]);
	return {
		success: hasTheSamePathBool && hasTheSamePathBool && res.length === 1,
		resolved: true,
		res: res[0],
	};
};

export {addToTrie, trieMatch};
