import {
	EXCLUDED_EXT,
	INCLUDED_EXT,
	HAS_TO_EXCLUDE_LEGACY,
	LEGACY_TOKEN_NAME,
	ROOT_PATH,
} from '../../config.js';

const removeChunkhash = (file, tokenSubdir) => {
	const arr = file.split('.');
	const ext = arr.pop();

	const fileWithoutExt = arr.join('-');
	const fileWithoutChunkHashArr = fileWithoutExt.split('-');
	if (fileWithoutChunkHashArr.length > 1) fileWithoutChunkHashArr.pop(); // popin latest => can be the full chunkhash

	if (
		(HAS_TO_EXCLUDE_LEGACY && fileWithoutChunkHashArr.includes(LEGACY_TOKEN_NAME)) ||
		EXCLUDED_EXT.has(ext)
	)
		return false;
	return tokenSubdir + fileWithoutChunkHashArr.join('-') + '.' + ext;
};

const getLastNSubdir = (path) => {
	const len = path.length;
	return path.substr(-(len - ROOT_PATH.length));
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
	const tokenSubdir = arr.join('/') + '/';

	return [fileName, tokenSubdir];
};

export {removeChunkhash, getLastNSubdir, initDirResolver, getrurl};
