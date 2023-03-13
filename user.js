import LibraryClientConstants from '@thzero/library_client/constants';

import AppUtility from '@/utility/app';

import VueBaseUserService from '@thzero/library_client_vue3/service/baseUser';

class UserService extends VueBaseUserService {
	async fetchByGamerId(correlationId, gamerId) {
		if (!gamerId)
			return this._error('UserService', 'fetchByGamerId', 'Invalid gamerId.');

		this._logger.debug('UserService', 'fetchByGamerId', 'gamerId', gamerId, correlationId);
		try {
			// const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'users/gamerId', gamerId);
			const response = await this._fetchByGamerIdCommunication(correlationId, gamerId);
			this._logger.debug('UserService', 'fetchByGamerId', 'response', response, correlationId);
			if (this._hasSucceeded(response))
				return response;
		}
		catch (err) {
			this._logger.exception('UserService', 'fetchByGamerId', err, correlationId);
		}

		return this._error('UserService', 'fetchByGamerId', null, null, null, null, correlationId);
	}

	async fetchByGamerTag(correlationId, gamerTag) {
		if (!gamerTag)
			return this._error('UserService', 'fetchByGamerTag', 'Invalid gamerTag.', null, null, null, correlationId);

		this._logger.debug('UserService', 'fetchByGamerTag', 'gamerTag', gamerTag, correlationId);
		try {
			// const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'users/gamerTag', gamerTag);
			const response = await this._fetchByGamerTag(correlationId, gamerTag);
			this._logger.debug('UserService', 'fetchByGamerTag', 'response', response, correlationId);
			if (this._hasSucceeded(response))
				return response;
		}
		catch (err) {
			this._logger.exception('UserService', 'fetchByGamerTag', err, correlationId);
		}

		return this._error('UserService', 'fetchByGamerTag', null, null, null, null, correlationId);
	}

	initializeSettings(correlationId) {
		return AppUtility.initializeSettingsUser();
	}

	async _fetchByGamerIdCommunication(correlationId, gamerId) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'users/gamerId', gamerId);
		this._logger.debug('UserService', '_fetchByGamerIdCommunication', 'response', response, correlationId);
		return response;
	}

	async _fetchByGamerTag(correlationId, gamerTag) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'users/gamerTag', gamerTag);
		this._logger.debug('UserService', '_fetchByGamerTag', 'response', response, correlationId);
		return response;
	}
}

export default UserService;
