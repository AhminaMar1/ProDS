import {
	EXCLUDED_EXT,
	INCLUDED_EXT,
	EXCLUDE_LEGACY,
	DEEP_PATH_INTO_CONSIDERATION,
} from '../config.js';

const removeChunkhash = (file, tokenSubdir) => {
	const arr = file.split('.');
	const ext = arr.pop();

	const fileWithoutExt = arr.join('-');
	const fileWithoutChunkHashArr = fileWithoutExt.split('-');
	if (fileWithoutChunkHashArr.length > 1) fileWithoutChunkHashArr.pop(); // popin latest => can be the full chunkhash

	if (fileWithoutChunkHashArr.includes(EXCLUDE_LEGACY) || EXCLUDED_EXT.has(ext))
		return false;
	return tokenSubdir + fileWithoutChunkHashArr.join('-') + '.' + ext;
};

const getLastTwoSubdir = (path) => {
	const len = path.length;
	let i = path.length,
		slashCount = 0;
	while (i > 0 && slashCount < DEEP_PATH_INTO_CONSIDERATION) {
		if (path.charAt(--i) === '/') slashCount++;
	}

	return path.substr(-(len - i));
};

const resolveSlashs = (left, right) => {
	const lastL = left.charAt(left.length - 1),
		firstR = right.charAt(0),
		end = right.charAt(right.length - 1) !== '/' ? '/' : '';

	if (lastL === '/' && firstR === '/') return left.slice(0, -1) + right + end;
	if (lastL === '/' || firstR === '/') return left + right + end;

	return left + '/' + right + end;
};

const resolveDir = (rootPath, path) => resolveSlashs(rootPath, path);
const initDirResolver = (rootPath) => (path) => resolveDir(rootPath, path);

const getrurl = (url) => {
	const splitQP = url?.split('?');
	const splitAnchor = splitQP[0]?.split('#');
	const pureURL = splitAnchor[0];
	const ext = pureURL.split('.').pop();
	if (!INCLUDED_EXT.has(ext)) return null;

	//Start hashFn
	const arr = pureURL.split('/');
	const fileName = arr.pop();

	const tokenSubdir = getLastTwoSubdir(arr.join('/') + '/');

	return [fileName, tokenSubdir];
};

export {removeChunkhash, getLastTwoSubdir, initDirResolver, getrurl};
