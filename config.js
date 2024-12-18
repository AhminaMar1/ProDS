//base_url

export const BASE_DOMAIN_URL = 'https://example.com';

// enable flows
export const FLOWS_TO_READ = ['app01', 'app02'];

// Ports
export const PROXY_SERVER_PORT = 1313;
export const FILES_SERVER_PORT = 1314;

//URLs
export const LOCALHOST = 'http://127.0.0.1';
export const URL_FILES_SERVER = LOCALHOST + ':' + FILES_SERVER_PORT;

// resources path that will be servert by the fileServer.
export const ROOT_PATH = './resources';

export const ROOT_PATH_LEN =
	ROOT_PATH.charAt(0) === '.' ? ROOT_PATH.length : ROOT_PATH.length + 2;

//INCLUDEDS/EXCLUDEDS
export const INCLUDED_EXT = new Set(['js', 'css']);
export const EXCLUDED_EXT = new Set(['svg', 'png']);
export const HAS_TO_EXCLUDE_LEGACY = true;
export const LEGACY_TOKEN_NAME = 'legacy';
export const EXCLUDE_WITH_NO_PRODS = '#withnoprods';
