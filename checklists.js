import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class ChecklistsService extends RestExternalService {
	async listingShared(correlationId, params) {
		try {
			const response = await this._listingSharedCommunication(correlationId, params);
			this._logger.debug('ChecklistsService', 'listingShared', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('ChecklistsService', 'listingShared', null, err, null, null, correlationId);
		}
	}

	async listingUser(correlationId, params) {
		try {
			const response = await this._listingUserCommunication(correlationId, params);
			this._logger.debug('ChecklistsService', 'listingUser', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('ChecklistsService', 'listingUser', null, err, null, null, correlationId);
		}
	}

	async retrieveShared(correlationId, id) {
		try {
			const response = await this._retrieveSharedCommunication(correlationId, id);
			this._logger.debug('ChecklistsService', 'retrieveShared', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('ChecklistsService', 'retrieveShared', null, err, null, null, correlationId);
		}
	}

	async retrieveUser(correlationId, id) {
		try {
			const response = await this._retrieveUserCommunication(correlationId, id);
			this._logger.debug('ChecklistsService', 'retrieveUser', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('ChecklistsService', 'retrieveUser', null, err, null, null, correlationId);
		}
	}

	async _listingSharedCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'checklists/listing/shared' }, params);
		this._logger.debug('ChecklistsService', '_listingSharedCommunication', 'response', response, correlationId);
		return response;
	}

	async _listingUserCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'checklists/listing/user' }, params);
		this._logger.debug('ChecklistsService', '_listingUserCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveSharedCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'checklists/shared', id);
		this._logger.debug('ChecklistsService', '_retrieveSharedCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveUserCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'checklists/user', id);
		this._logger.debug('ChecklistsService', '_retrieveUserCommunication', 'response', response, correlationId);
		return response;
	}
}

export default ChecklistsService;
