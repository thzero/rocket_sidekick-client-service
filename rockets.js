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
			this._enforceNotEmpty('RocketsService', 'delete', id, 'id', correlationId);

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
			this._enforceNotEmpty('RocketsService', 'retrieve', id, 'id', correlationId);

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
			this._enforceNotEmpty('RocketsService', 'retrieveGallery', id, 'id', correlationId);

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
			this._enforceNotNull('RocketsService', 'save', rocket, 'rocket', correlationId);

			// if (rocket.stages) {
			// 	const func = (item) => { return  { id: item.id, itemId: item.itemId, typeId: item.typeId }; };

			// 	// clean out display data from parts...
			// 	let stage;
			// 	let stages = [];
			// 	for (let i = 0; i < rocket.stages.length; i++) {
			// 		stage = rocket.stages[i];
			// 		if (stage.altimeters)
			// 			stage.altimeters = stage.altimeters.map(l => func(l));
			// 		if (stage.chuteProtectors)
			// 			stage.chuteProtectors = stage.chuteProtectors.map(l => func(l));
			// 		if (stage.chuteReleases)
			// 			stage.chuteReleases = stage.chuteReleases.map(l => func(l));
			// 		if (stage.deploymentBags)
			// 			stage.deploymentBags = stage.deploymentBags.map(l => func(l));
			// 		if (stage.parachutes)
			// 			stage.parachutes = stage.parachutes.map(l => func(l));
			// 		if (stage.streamers)
			// 			stage.streamers = stage.streamers.map(l => func(l));
			// 		if (stage.trackers)
			// 			stage.trackers = stage.trackers.map(l => func(l));
			// 		stages.push(stage);
			// 	}
			// 	rocket.stages = stages;
			// }
			this.stageClean(correlationId, rocket);

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

	stageClean(correlationId, object) {
		if (!object.stages)
			return;

		const func = (item) => { return  { id: item.id, itemId: item.itemId, typeId: item.typeId }; };

		// clean out display data from parts...
		let stage;
		let stages = [];
		for (let i = 0; i < object.stages.length; i++) {
			stage = object.stages[i];
			if (stage.altimeters)
				stage.altimeters = stage.altimeters.map(l => func(l));
			if (stage.chuteProtectors)
				stage.chuteProtectors = stage.chuteProtectors.map(l => func(l));
			if (stage.chuteReleases)
				stage.chuteReleases = stage.chuteReleases.map(l => func(l));
			if (stage.deploymentBags)
				stage.deploymentBags = stage.deploymentBags.map(l => func(l));
			// if (stage.motors)
			// 	stage.motors = stage.motors.map(l => func(l));
			if (stage.parachutes)
				stage.parachutes = stage.parachutes.map(l => func(l));
			if (stage.streamers)
				stage.streamers = stage.streamers.map(l => func(l));
			if (stage.trackers)
				stage.trackers = stage.trackers.map(l => func(l));
			delete stage.fromRocket;
			stages.push(stage);
		}
		object.stages = stages;
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

	async _saveCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rockets' }, params);
		this._logger.debug('RocketsService', '_saveCommunication', 'response', response, correlationId);
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
}

export default RocketsService;
