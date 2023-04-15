import LibraryCommonUtility from '@thzero/library_common/utility/index.js';

import SecurityService from '@thzero/library_client/service/security.js';

import securityUser from 'rocket_sidekick_common/security/user.js';
import securityAdmin from 'rocket_sidekick_common/security/admin.js';

class AppSecurityService extends SecurityService {
	constructor() {
		super();
	}

	_initModel() {
		return LibraryCommonUtility.merge2(securityUser.options, securityAdmin.options);
	}
}

export default AppSecurityService;
