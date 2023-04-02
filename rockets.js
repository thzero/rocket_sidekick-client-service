import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class RocketsService extends RestExternalService {
	async listing(correlationId, params) {
		try {
			const response = await this._listingCommunication(correlationId, params);
			this._logger.debug('RocketsService', 'listing', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'listing', null, err, null, null, correlationId);
		}
	}

	async listingUser(correlationId, params) {
		try {
			const response = await this._listingUserCommunication(correlationId, params);
			this._logger.debug('RocketsService', 'listingUser', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'listingUser', null, err, null, null, correlationId);
		}
	}

	async retrieve(correlationId, id) {
		try {
			const response = await this._retrieveCommunication(correlationId, id);
			this._logger.debug('RocketsService', 'retrieve', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'retrieve', null, err, null, null, correlationId);
		}
	}

	async retrieveUser(correlationId, id) {
		try {
			const response = await this._retrieveUserCommunication(correlationId, id);
			this._logger.debug('RocketsService', 'retrieveUser', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'retrieveUser', null, err, null, null, correlationId);
		}
	}

	async _listingCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rockets/listing' }, params);
		this._logger.debug('RocketsService', '_listingCommunication', 'response', response, correlationId);
		return response;
	}

	async _listingUserCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rockets/listing/user' }, params);
		this._logger.debug('RocketsService', '_listingUserCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'rockets', id);
		this._logger.debug('RocketsService', '_retrieveCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveUserCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'rockets/user', id);
		this._logger.debug('RocketsService', '_retrieveUserCommunication', 'response', response, correlationId);
		return response;
	}
}

export default RocketsService;
