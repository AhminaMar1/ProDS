//base_url

export const base_domain_url = 'https://example.com';

// files

export const DEEP_PATH_INTO_CONSIDERATION = 2;

// Ports
export const fileServerPort = 1313;
export const proxyServerPort = 1314;

//
export const URL_FILES_SERVER = 'http://127.0.0.1:' + fileServerPort;
// resources path that will be servert by the fileServer.
export const ROOT_PATH = './resourcesExample';

export const ROOT_PATH_LEN =
	ROOT_PATH.charAt(0) === '.' ? ROOT_PATH.length : ROOT_PATH.length + 2;
//
export const INCLUDED_EXT = new Set(['js', 'html']);
export const EXCLUDED_EXT = new Set(['svg', 'png']);
export const EXCLUDE_LEGACY = 'legacy';
export const EXCLUDE_WITH_NO_PRODS = '#withnoprods';
