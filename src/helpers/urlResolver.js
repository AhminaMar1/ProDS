import {base_domain_url, EXCLUDE_WITH_NO_PRODS} from '../config.js';

export const fullUrl = (baseUrl) => base_domain_url + baseUrl + EXCLUDE_WITH_NO_PRODS;
