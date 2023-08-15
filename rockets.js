import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class RocketsService extends RestExternalService {
	async copy(correlationId, params) {
		try {
			const response = await this._copyCommunication(correlationId, params);
			this._logger.debug('RocketsService', 'copy', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'copy', null, err, null, null, correlationId);
		}
	}

	async delete(correlationId, id) {
		try {
			const response = await this._deleteCommunication(correlationId, id);
			this._logger.debug('RocketsService', 'delete', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'delete', null, err, null, null, correlationId);
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

	async retrieveGallery(correlationId, id) {
		try {
			const response = await this._retrieveGalleryCommunication(correlationId, id);
			this._logger.debug('RocketsService', 'retrieveGallery', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'retrieveGallery', null, err, null, null, correlationId);
		}
	}

	async save(correlationId, rocket) {
		try {
			const items = [ rocket ];
			items.push(...rocket.stages);

			const func = (item) => { return  { id: item.id, itemId: item.itemId, typeId: item.typeId }; };

			for (const item of items) {
				if (item.altimeters)
					item.altimeters = item.altimeters.map(i => func(i));
				if (item.recovery)
					item.recovery = item.recovery.map(i => func(i));
				if (item.trackers)
					item.trackers = item.trackers.map(i => func(i));	
			}

			const response = await this._saveCommunication(correlationId, rocket);
			this._logger.debug('RocketsService', 'save', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'save', null, err, null, null, correlationId);
		}
	}

	async search(correlationId, params) {
		try {
			const response = await this._searchCommunication(correlationId, params);
			this._logger.debug('RocketsService', 'search', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'search', null, err, null, null, correlationId);
		}
	}

	async searchGallery(correlationId, params) {
		try {
			const response = await this._searchGalleryCommunication(correlationId, params);
			this._logger.debug('RocketsService', 'searchGallery', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'searchGallery', null, err, null, null, correlationId);
		}
	}

	async _copyCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rockets/copy' }, params);
		this._logger.debug('RocketsService', '_copyCommunication', 'response', response, correlationId);
		return response;
	}

	async _deleteCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.deleteById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'rockets', id);
		this._logger.debug('RocketsService', '_deleteCommunication', 'response', response, correlationId);
		return response;
	}

	async _searchCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rockets/search' }, params);
		this._logger.debug('RocketsService', '_searchCommunication', 'response', response, correlationId);
		return response;
	}

	async _searchGalleryCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rockets/search/gallery' }, params);
		this._logger.debug('RocketsService', '_searchGalleryCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'rockets', id);
		this._logger.debug('RocketsService', '_retrieveCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveGalleryCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'rockets/gallery', id);
		this._logger.debug('RocketsService', '_retrieveGalleryCommunication', 'response', response, correlationId);
		return response;
	}

	async _saveCommunication(correlationId, rocket) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rockets' }, rocket);
		this._logger.debug('RocketsService', '_saveCommunication', 'response', response, correlationId);
		return response;
	}
}

export default RocketsService;
