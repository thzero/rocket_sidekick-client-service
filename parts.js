import AppCommonConstants from 'rocket_sidekick_common/constants';
import AppUtilityConstants from '@/utility/constants';
import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class PartsService extends RestExternalService {
	constructor() {
		super();

		this._serviceSecurity = null;
		this._serviceStore = null;
		this._serviceExternalMotorSearch = null;
	}

	async init(injector) {
		await super.init(injector);

		this._serviceSecurity = this._injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_SECURITY);
		this._serviceStore = this._injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_STORE);
		this._serviceExternalMotorSearch = this._injector.getService(AppUtilityConstants.InjectorKeys.SERVICE_EXTERNAL_MOTOR_SEARCH);
	}

	async copy(correlationId, params) {
		try {
			const response = await this._copyCommunication(correlationId, params);
			this._logger.debug('PartsService', 'copy', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'copy', null, err, null, null, correlationId);
		}
	}

	async delete(correlationId, id) {
		try {
			const response = await this._deleteCommunication(correlationId, id);
			this._logger.debug('PartsService', 'delete', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'delete', null, err, null, null, correlationId);
		}
	}

	async retrieve(correlationId, id) {
		try {
			const response = await this._retrieveCommunication(correlationId, id);
			this._logger.debug('PartsService', 'retrieve', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'retrieve', null, err, null, null, correlationId);
		}
	}

	async retrieveMotor(correlationId, id) {
		try {
			const response = await this._retrieveMotorCommunication(correlationId, id);
			this._logger.debug('PartsService', 'retrieveMotor', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'retrieveMotor', null, err, null, null, correlationId);
		}
	}

	async save(correlationId, part, cache, cached) {
		try {
			const response = await this._saveCommunication(correlationId, part);
			this._logger.debug('PartsService', 'save', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'save', null, err, null, null, correlationId);
		}
	}

	async search(correlationId, params) {
		try {
			this._enforceNotNull('PartsService', 'search', params, 'params', correlationId);
			this._enforceNotEmpty('PartsService', 'search', params.typeId, 'params.typeId', correlationId);

			if (params.typeId === AppCommonConstants.Rocketry.PartTypes.motor) {
				// console.log('parts.search.response');
				// console.dir(response);
				return this._serviceExternalMotorSearch.search();
			}
			
			// TODO: potentially look at caching; look at expanding the motorsearch caching schema at a parts type level.

			const response = await this._searchCommunication(correlationId, params);
			this._logger.debug('PartsService', 'search', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'search', null, err, null, null, correlationId);
		}
	}

	async searchMotors(correlationId, params) {
		try {
			this._enforceNotNull('PartsService', 'search', params, 'params', correlationId);

			params.typeId = AppCommonConstants.Rocketry.PartTypes.motor;

			const response = await this._searchMotorCommunication(correlationId, params);
			// console.log('parts.searchMotors.response');
			// console.dir(response);
			this._logger.debug('PartsService', 'searcHMotors', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'searcHMotors', null, err, null, null, correlationId);
		}
	}

	async searchRocket(correlationId, params) {
		try {
			this._enforceNotNull('PartsService', 'searchRocket', params, 'params', correlationId);
			this._enforceNotEmpty('PartsService', 'search', params.partTypes, 'params.partTypes', correlationId);
			
			// TODO: potentially look at caching; look at expanding the motorsearch caching schema at a parts type level.
			const response = await this._searchRocketCommunication(correlationId, params);
			this._logger.debug('PartsService', 'searchRocket', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('PartsService', 'searchRocket', null, err, null, null, correlationId);
		}
	}

	// async securityIsAdmin(correlationId) {
	// 	const isLoggedIn = this._serviceStore.userAuthIsLoggedIn;
	// 	if (!isLoggedIn)
	// 		return false;
	
	// 	success = await this._serviceSecurity.authorizationCheckRoles(correlationId, this._serviceStore.user, roles, 'or');
	// }

	async _copyCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'parts/copy' }, params);
		this._logger.debug('PartsService', '_copyCommunication', 'response', response, correlationId);
		return response;
	}

	async _deleteCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.deleteById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'parts', id);
		this._logger.debug('PartsService', '_deleteCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'parts', id);
		this._logger.debug('PartsService', '_retrieveCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveMotorCommunication(correlationId, id) {
		let response = null;
		const isLoggedIn = this._serviceStore.userAuthIsLoggedIn;
		if (isLoggedIn)
			response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'parts', id);
		else
			response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'motors', id);
		this._logger.debug('PartsService', '_retrieveMotorCommunication', 'response', response, correlationId);
		return response;
	}

	async _searchCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'parts/search' }, params);
		this._logger.debug('PartsService', '_searchCommunication', 'response', response, correlationId);
		return response;
	}

	async _searchMotorCommunication(correlationId, params) {
		let response = null;
		const isLoggedIn = this._serviceStore.userAuthIsLoggedIn;
		if (isLoggedIn)
			response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'parts/search' }, params);
		else
			response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'motors/search' }, params);
		this._logger.debug('PartsService', '_searchMotorCommunication', 'response', response, correlationId);
		return response;
	}

	async _searchRocketCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'parts/search/rocket' }, params);
		this._logger.debug('PartsService', '_searchRocketCommunication', 'response', response, correlationId);
		return response;
	}

	async _saveCommunication(correlationId, part) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'parts' }, part);
		this._logger.debug('PartsService', '_saveCommunication', 'response', response, correlationId);
		return response;
	}
}

export default PartsService;
