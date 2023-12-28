import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryCommonUtility from '@thzero/library_common/utility/index.js';

import SecurityService from '@thzero/library_client/service/security.js';

import securityUser from 'rocket_sidekick_common/security/user.js';
import securityAdmin from 'rocket_sidekick_common/security/admin.js';

class AppSecurityService extends SecurityService {
	constructor() {
		super();

		this._serviceStore = null;
	}

	async init(injector) {
		await super.init(injector);

		this._serviceStore = this._injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_STORE);
	}

	_initModel() {
		return LibraryCommonUtility.merge2(securityUser.options, securityAdmin.options);
	}

	async securityAdmin(correlationId, roles) {
		this._enforceNotNull('AppSecurityService', 'securityAdmin', roles, 'roles', correlationId);
		this._enforce('AppSecurityService', 'securityAdmin', Array.isArray(roles), 'roles.isArray', correlationId);

		const isLoggedIn = this._serviceStore.userAuthIsLoggedIn;
		if (!isLoggedIn)
			return false;
	
		return await this.authorizationCheckRoles(correlationId, this._serviceStore.user, roles);
	}
}

export default AppSecurityService;
