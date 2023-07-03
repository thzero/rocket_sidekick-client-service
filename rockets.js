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

	async listingGallery(correlationId, params) {
		try {
			const response = await this._listingGalleryCommunication(correlationId, params);
			this._logger.debug('RocketsService', 'listingGalleryr', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'listlistingGalleryringUser', null, err, null, null, correlationId);
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
			const response = await this._saveCommunication(correlationId, rocket);
			this._logger.debug('RocketsService', 'save', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'save', null, err, null, null, correlationId);
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

	async _listingCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rockets/listing' }, params);
		this._logger.debug('RocketsService', '_listingCommunication', 'response', response, correlationId);
		return response;
	}

	async _listingGalleryCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rockets/listing/gallery' }, params);
		this._logger.debug('RocketsService', '_listingGalleryCommunication', 'response', response, correlationId);
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
