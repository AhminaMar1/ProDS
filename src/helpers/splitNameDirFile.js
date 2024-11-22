import {ROOT_PATH} from '../../config.js';

export const splitNameDirFile = (fileDirAndName) => {
	const arr = fileDirAndName.split('/');
	const fileName = arr.pop();
	return [fileName, ROOT_PATH + arr.join('/') + '/'];
};
