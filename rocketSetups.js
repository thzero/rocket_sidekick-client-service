import AppSharedConstants from '@/utility/constants';
import LibraryClientConstants from '@thzero/library_client/constants.js';

import RestExternalService from '@thzero/library_client/service/externalRest';

class RocketSetupsService extends RestExternalService {
	constructor() {
		super();

		this._serviceRockets = null;
	}

	async init(injector) {
		await super.init(injector);

		this._serviceRockets = this._injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
	}

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

	async save(correlationId, rocketSetup) {
		try {
			this._enforceNotNull('RocketSetupsService', 'save', rocketSetup, 'rocketSetup', correlationId);

			// remove the rocket node that was added when selecting a rocket
			delete rocketSetup.rocket;

			// if (rocketSetup.stages) {
			// 	const func = (item) => { return  { id: item.id, itemId: item.itemId, typeId: item.typeId }; };

			// 	// clean out display data from parts...
			// 	let stage;
			// 	let stages = [];
			// 	for (let i = 0; i < rocketSetup.stages.length; i++) {
			// 		stage = rocketSetup.stages[i];
			// 		if (stage.altimeters)
			// 			stage.altimeters = stage.altimeters.map(l => func(l));
			// 		if (stage.chuteProtectors)
			// 			stage.chuteProtectors = stage.chuteProtectors.map(l => func(l));
			// 		if (stage.chuteReleases)
			// 			stage.chuteReleases = stage.chuteReleases.map(l => func(l));
			// 		if (stage.deploymentBags)
			// 			stage.deploymentBags = stage.deploymentBags.map(l => func(l));
			// 		if (stage.motors)
			// 			stage.motors = stage.motors.map(l => func(l));
			// 		if (stage.parachutes)
			// 			stage.parachutes = stage.parachutes.map(l => func(l));
			// 		if (stage.streamers)
			// 			stage.streamers = stage.streamers.map(l => func(l));
			// 		if (stage.trackers)
			// 			stage.trackers = stage.trackers.map(l => func(l));
			// 		stages.push(stage);
			// 	}
			// 	rocketSetup.stages = stages;
			// }
			this._serviceRockets.stageClean(correlationId, rocketSetup);

			const response = await this._saveCommunication(correlationId, rocketSetup);
			this._logger.debug('RocketSetupsService', 'save', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketSetupsService', 'save', null, err, null, null, correlationId);
		}
	}

	async saveStage(correlationId, rocketSetup, stage) {
		try {
			this._enforceNotNull('RocketSetupsService', 'saveStage', rocketSetup, 'rocketSetup', correlationId);
			this._enforceNotNull('RocketSetupsService', 'saveStage', stage, 'stage', correlationId);

			const temp = LibraryCommonUtility.cloneDeep(rocketSetup);
			temp.stages = LibraryCommonUtility.updateArrayByObject(rocketSetup.stages, stage);

			this.stageClean(correlationId, temp);

			const response = await this._saveCommunication(correlationId, temp);
			this._logger.debug('RocketSetupsService', 'saveStage', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketSetupsService', 'saveStage', null, err, null, null, correlationId);
		}
	}

	async saveStageDelete(correlationId, rocketSetup, id) {
		try {
			this._enforceNotNull('RocketSetupsService', 'saveStageDelete', rocketSetup, 'rocketSetup', correlationId);
			this._enforceNotEmpty('RocketSetupsService', 'saveStageDelete', id, 'id', correlationId);

			const temp = LibraryCommonUtility.cloneDeep(rocketSetup);
			LibraryCommonUtility.deleteArrayById(temp.stages, id);

			temp.stages = temp.stages.sort((a, b) => a.index >= b.index);
			let index = 0;
			for (const item of temp.stages)
				item.index = index++;

			this.stageClean(correlationId, temp);

			const response = await this._saveCommunication(correlationId, temp);
			this._logger.debug('RocketSetupsService', 'saveStageDelete', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketSetupsService', 'saveStageDelete', null, err, null, null, correlationId);
		}
	}

	async saveStagePart(correlationId, rocketSetup, part) {
		try {
			this._enforceNotNull('RocketSetupsService', 'saveStagePart', rocketSetup, 'rocketSetup', correlationId);
			this._enforceNotNull('RocketSetupsService', 'saveStagePart', part, 'part', correlationId);

			const temp = LibraryCommonUtility.cloneDeep(rocketSetup);
			const stage = temp.stages.find(l => l.id === part.stageId);
			if (!stage)
				return error('RocketSetupsService', 'saveStagePart', `Invalid stage for '${part.stageId}'.`, null, null, null, correlationId);

			if (part.typeId === AppCommonConstants.Rocketry.PartTypes.altimeter)
				stage.altimeters = LibraryCommonUtility.updateArrayByObject(stage.altimeters, part.item);
			else if (part.typeId === AppCommonConstants.Rocketry.PartTypes.chuteProtector)
				stage.chuteProtectors = LibraryCommonUtility.updateArrayByObject(stage.chuteProtectors, part.item);
			else if (part.typeId === AppCommonConstants.Rocketry.PartTypes.chuteRelease)
				stage.chuteReleases = LibraryCommonUtility.updateArrayByObject(stage.chuteReleases, part.item);
			else if (part.typeId === AppCommonConstants.Rocketry.PartTypes.deploymentBag)
				stage.deploymentBags = LibraryCommonUtility.updateArrayByObject(stage.deploymentBags, part.item);
			else if (part.typeId === AppCommonConstants.Rocketry.PartTypes.parachute)
				stage.parachutes = LibraryCommonUtility.updateArrayByObject(stage.parachutes, part.item);
			else if (part.typeId === AppCommonConstants.Rocketry.PartTypes.streamer)
				stage.streamers = LibraryCommonUtility.updateArrayByObject(stage.streamers, part.item);
			else if (part.typeId === AppCommonConstants.Rocketry.PartTypes.tracker)
				stage.trackers = LibraryCommonUtility.updateArrayByObject(stage.trackers, part.item);

			this.stageClean(correlationId, temp);

			const response = await this._saveCommunication(correlationId, temp);
			this._logger.debug('RocketSetupsService', 'saveStagePart', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsSeRocketSetupsServicervice', 'saveStagePart', null, err, null, null, correlationId);
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
