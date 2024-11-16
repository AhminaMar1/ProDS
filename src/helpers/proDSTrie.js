import {DEEP_PATH_INTO_CONSIDERATION} from '../../config.js';
import {getrurl} from './subdirResolver.js';

const pathDepth = DEEP_PATH_INTO_CONSIDERATION; // todo: has to be dynamic
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

const hasTheSamePath = (dir1, dir2) => {
	const dir2BeforeOp = dir2.split('/');
	dir2BeforeOp.pop();
	const dir2AfterOp = dir2BeforeOp.join('/');

	const dir1BeforeOp = dir1.split('/');
	const len1 = dir1BeforeOp.length;
	const dir1AfterOpArr = [''];
	for (let i = len1 - DEEP_PATH_INTO_CONSIDERATION; i < len1 - 1; i++) {
		dir1AfterOpArr.push(dir1BeforeOp[i]);
	}

	const dir1AfterOp = dir1AfterOpArr.join('/');
	return dir1AfterOp === dir2AfterOp;
};

const trieMatch = (fullurl) => {
	const resolvedUrl = getrurl(fullurl);
	if (!resolvedUrl) return null;
	const [fileName, tokenSubdir] = resolvedUrl;
	const rurl = tokenSubdir + fileName;
	const res = returnMatches(rurl);
	if (!res) return {success: false, resolved: false};

	const hasTheSamePathBool = hasTheSamePath(fullurl, res[0]);
	return {
		success: hasTheSamePathBool && hasTheSamePathBool && res.length === 1,
		resolved: true,
		res: res[0],
	};
};

const resolve_url = (preFile, resFile) => {
	const arr = preFile.split('/');
	for (let i = 0; i < pathDepth; i++) {
		arr.pop();
	}

	return arr.join('/') + resFile;
};

export {addToTrie, trieMatch, resolve_url};
