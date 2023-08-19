import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class RocketSetupsService extends RestExternalService {
	async copy(correlationId, params) {
		try {
			const response = await this._copyCommunication(correlationId, params);
			this._logger.debug('RocketSetupsService', 'copy', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketSetupsService', 'copy', null, err, null, null, correlationId);
		}
	}

	async delete(correlationId, id) {
		try {
			this._enforceNotEmpty('RocketSetupsService', 'delete', id, 'id', correlationId);

			const response = await this._deleteCommunication(correlationId, id);
			this._logger.debug('RocketSetupsService', 'delete', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketSetupsService', 'delete', null, err, null, null, correlationId);
		}
	}

	async retrieve(correlationId, id) {
		try {
			this._enforceNotEmpty('RocketSetupsService', 'retrieve', id, 'id', correlationId);

			const response = await this._retrieveCommunication(correlationId, id);
			this._logger.debug('RocketSetupsService', 'retrieve', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketSetupsService', 'retrieve', null, err, null, null, correlationId);
		}
	}

	async save(correlationId, rocket) {
		try {
			this._enforceNotNull('RocketSetupsService', 'save', rocket, 'rocket', correlationId);

			if (rocket.stages) {
				const func = (item) => { return  { id: item.id, itemId: item.itemId, typeId: item.typeId }; };

				let stage;
				let stages = [];
				for (let i = 0; i < rocket.stages.length; i++) {
					stage = rocket.stages[i];
					if (stage.altimeters)
						stage.altimeters = stage.altimeters.map(l => func(l));
					if (stage.recovery)
						stage.recovery = stage.recovery.map(l => func(l));
					if (stage.trackers)
						stage.trackers = stage.trackers.map(l => func(l));
					stages.push(stage);
				}
				rocket.stages = stages;
			}

			const response = await this._saveCommunication(correlationId, rocket);
			this._logger.debug('RocketSetupsService', 'save', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketSetupsService', 'save', null, err, null, null, correlationId);
		}
	}

	async search(correlationId, params) {
		try {
			const response = await this._searchCommunication(correlationId, params);
			this._logger.debug('RocketSetupsService', 'search', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketSetupsService', 'search', null, err, null, null, correlationId);
		}
	}

	async _copyCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rocketSetups/copy' }, params);
		this._logger.debug('RocketSetupsService', '_copyCommunication', 'response', response, correlationId);
		return response;
	}

	async _deleteCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.deleteById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'rocketSetups', id);
		this._logger.debug('RocketSetupsService', '_deleteCommunication', 'response', response, correlationId);
		return response;
	}

	async _retrieveCommunication(correlationId, id) {
		const response = await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'rocketSetups', id);
		this._logger.debug('RocketSetupsService', '_retrieveCommunication', 'response', response, correlationId);
		return response;
	}

	async _saveCommunication(correlationId, rocket) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rocketSetups' }, rocket);
		this._logger.debug('RocketSetupsService', '_saveCommunication', 'response', response, correlationId);
		return response;
	}

	async _searchCommunication(correlationId, params) {
		const response = await this._serviceCommunicationRest.post(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, { url: 'rocketSetups/search' }, params);
		this._logger.debug('RocketSetupsService', '_searchCommunication', 'response', response, correlationId);
		return response;
	}
}

export default RocketSetupsService;
