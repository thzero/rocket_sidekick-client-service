import AppCommonConstants from 'rocket_sidekick_common/constants.js';
import LibraryClientConstants from '@thzero/library_client/constants.js';

import LibraryCommonUtility from '@thzero/library_common/utility/index';

import RestExternalService from '@thzero/library_client/service/externalRest';

class ChecklistsService extends RestExternalService {
	async copy(correlationId, params) {
		try {
			const response = await this._copyCommunication(correlationId, params);
			this._logger.debug('ChecklistsService', 'copy', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('ChecklistsService', 'copy', null, err, null, null, correlationId);
		}
	}

	async delete(correlationId, id) {
		try {
			const response = await this._deleteCommunication(correlationId, id);
			this._logger.debug('ChecklistsService', 'delete', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('ChecklistsService', 'delete', null, err, null, null, correlationId);
		}
	}

	async retrieve(correlationId, id) {
		try {
			const response = await this._retrieveCommunication(correlationId, id);
			this._logger.debug('ChecklistsService', 'retrieve', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('ChecklistsService', 'retrieve', null, err, null, null, correlationId);
		}
	}

	async save(correlationId, checklist) {
		try {
			const temp = LibraryCommonUtility.cloneDeep(checklist);
			delete temp.canLaunch;
			delete temp.location;
			delete temp.rocketSetup;

			const response = await this._saveCommunication(correlationId, temp);
			this._logger.debug('ChecklistsService', 'save', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('ChecklistsService', 'save', null, err, null, null, correlationId);
		}
	}

	async search(correlationId, params) {
		try {
			const response = await this._searchCommunication(correlationId, params);
			this._logger.debug('ChecklistsService', 'search', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('ChecklistsService', 'search', null, err, null, null, correlationId);
		}
	}

	async start(correlationId, params) {
		try {
			const response = await this._startCommunication(correlationId, params);
			this._logger.debug('ChecklistsService', 'start', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('ChecklistsService', 'start', null, err, null, null, correlationId);
		}
	}

	async _copyCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'checklists/copy' }, params);
		this._logger.debug('ChecklistsService', '_copyCommunication', 'response', response, correlationId);
		return response;
	}

	async _deleteCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.deleteById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'checklists', id);
		this._logger.debug('ChecklistsService', '_deleteCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'checklists', id);
		this._logger.debug('ChecklistsService', '_retrieveCommunication', 'response', response, correlationId);
		return response;
	}

	async _saveCommunication(correlationId, checklist) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'checklists' }, checklist);
		this._logger.debug('ChecklistsService', '_saveCommunication', 'response', response, correlationId);
		return response;
	}

	async _searchCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'checklists/search' }, params);
		this._logger.debug('ChecklistsService', '_searchCommunication', 'response', response, correlationId);
		return response;
	}

	async _startCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'checklists/start' }, params);
		this._logger.debug('ChecklistsService', '_startCommunication', 'response', response, correlationId);
		return response;
	}
}

export default ChecklistsService;
