import {BASE_DOMAIN_URL, EXCLUDE_WITH_NO_PRODS} from '../../config.js';

export const excludedfullUrl = (baseUrl) =>
	BASE_DOMAIN_URL + baseUrl + EXCLUDE_WITH_NO_PRODS;
