import {EXCLUDED_EXT, EXCLUDE_LEGACY} from '../config.js';

const removeChunkhash = (file, tokenSubdir) => {
	const arr = file.split('.');
	const ext = arr.pop();

	const fileWithoutExt = arr.join('-');
	const fileWithoutChunkHashArr = fileWithoutExt.split('-');
	fileWithoutChunkHashArr.pop(); // popin latest => can be the full chunkhash

	if (fileWithoutChunkHashArr.includes(EXCLUDE_LEGACY) || EXCLUDED_EXT.has(ext))
		return false;
	return tokenSubdir + fileWithoutChunkHashArr.join('-') + '.' + ext;
};

const getLastTwoSubdir = (path) => {
    const len = path.length;
	let i = path.length,
		slashCount = 0;
	while (i > 0 && slashCount < 2) {
	    console.log(i, slashCount, path.charAt(i));
	    if (path.charAt(--i) === '/') slashCount++;
	}

	return path.substr(-(len - i));
};

export {removeChunkhash, getLastTwoSubdir};
