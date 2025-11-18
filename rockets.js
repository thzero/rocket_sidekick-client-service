import AppCommonConstants from 'rocket_sidekick_common/constants';
import LibraryClientConstants from '@thzero/library_client/constants.js';

import LibraryCommonUtility from '@thzero/library_common/utility';

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

	async saveStage(correlationId, rocket, stage) {
		try {
			this._enforceNotNull('RocketsService', 'saveStage', rocket, 'rocket', correlationId);
			this._enforceNotNull('RocketsService', 'saveStage', stage, 'stage', correlationId);

			const temp = LibraryCommonUtility.cloneDeep(rocket);
			temp.stages = LibraryCommonUtility.updateArrayByObject(rocket.stages, stage);

			this.stageClean(correlationId, temp);

			const response = await this._saveCommunication(correlationId, temp);
			this._logger.debug('RocketsService', 'saveStage', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'saveStage', null, err, null, null, correlationId);
		}
	}

	async saveStageDelete(correlationId, rocket, id) {
		try {
			this._enforceNotNull('RocketsService', 'saveStageDelete', rocket, 'rocket', correlationId);
			this._enforceNotEmpty('RocketsService', 'saveStageDelete', id, 'id', correlationId);

			const temp = LibraryCommonUtility.cloneDeep(rocket);
			LibraryCommonUtility.deleteArrayById(temp.stages, id);

			temp.stages = temp.stages.sort((a, b) => a.index >= b.index);
			let index = 0;
			for (const item of temp.stages)
				item.index = index++;

			this.stageClean(correlationId, temp);

			const response = await this._saveCommunication(correlationId, temp);
			this._logger.debug('RocketsService', 'saveStageDelete', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'saveStageDelete', null, err, null, null, correlationId);
		}
	}

	async saveStagePart(correlationId, rocket, part) {
		try {
			this._enforceNotNull('RocketsService', 'saveStagePart', rocket, 'rocket', correlationId);
			this._enforceNotNull('RocketsService', 'saveStagePart', part, 'part', correlationId);

			const temp = LibraryCommonUtility.cloneDeep(rocket);
			const stage = temp.stages.find(l => l.id === part.stageId);
			if (!stage)
				return error('RocketsService', 'saveStagePart', `Invalid stage for '${part.stageId}'.`, null, null, null, correlationId);

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
			this._logger.debug('RocketsService', 'saveStagePart', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'saveStagePart', null, err, null, null, correlationId);
		}
	}

	async saveVideo(correlationId, rocket, video) {
		try {
			this._enforceNotNull('RocketsService', 'saveVideo', rocket, 'rocket', correlationId);
			this._enforceNotNull('RocketsService', 'saveVideo', video, 'video', correlationId);

			const temp = LibraryCommonUtility.cloneDeep(rocket);
			temp.videos = temp.videos ?? [];
			temp.videos = LibraryCommonUtility.updateArrayByObject(rocket.videos, video);

			this.stageClean(correlationId, temp);

			const response = await this._saveCommunication(correlationId, temp);
			this._logger.debug('RocketsService', 'saveVideo', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'saveVideo', null, err, null, null, correlationId);
		}
	}

	async saveVideoDelete(correlationId, rocket, id) {
		try {
			this._enforceNotNull('RocketsService', 'saveVideoDelete', rocket, 'rocket', correlationId);
			this._enforceNotEmpty('RocketsService', 'saveVideoDelete', id, 'id', correlationId);

			const temp = LibraryCommonUtility.cloneDeep(rocket);
			LibraryCommonUtility.deleteArrayById(temp.videos, id);
			
			this.stageClean(correlationId, temp);

			const response = await this._saveCommunication(correlationId, temp);
			this._logger.debug('RocketsService', 'saveVideoDelete', 'response', response, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RocketsService', 'saveVideoDelete', null, err, null, null, correlationId);
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

		const func = (item) => { 
			const temp = { 
				id: item.id, 
				itemId: item.itemId, 
				typeId: item.typeId 
			};

			if (item.typeId === AppCommonConstants.Rocketry.PartTypes.altimeter) {
				temp.apogeeDelay = item.apogeeDelay;
				temp.altitudeMain = item.altitudeMain;
				temp.altitudeMainMeasurementUnitId = item.altitudeMainMeasurementUnitId;
				temp.altitudeMainMeasurementUnitsId = item.altitudeMainMeasurementUnitsId;
				temp.motorDelay = item.motorDelay;
			}
			else if (item.typeId === AppCommonConstants.Rocketry.PartTypes.chuteProtector) {
			}
			else if (item.typeId === AppCommonConstants.Rocketry.PartTypes.chuteRelease) {
				temp.altitude = item.altitude;
				temp.altitudeMeasurementUnitId = item.altitudeMeasurementUnitId;
				temp.altitudeMeasurementUnitsId = item.altitudeMeasurementUnitsId;
			}
			else if (item.typeId === AppCommonConstants.Rocketry.PartTypes.deploymentBag) {
			}
			else if (item.typeId === AppCommonConstants.Rocketry.PartTypes.parachute) {
				temp.reefed = item.reefed;
				temp.reefedLength = item.reefedLength;
				temp.reefedLengthMeasurementUnitId = item.reefedLengthMeasurementUnitId;
				temp.reefedLengthMeasurementUnitsId = item.reefedLengthMeasurementUnitsId;

			}
			else if (item.typeId === AppCommonConstants.Rocketry.PartTypes.streamer) {
			}
			else if (item.typeId === AppCommonConstants.Rocketry.PartTypes.tracker) {
			}

			return temp;
		};

		// clean out display data from parts...
		let stage;
		let stages = [];
		for (let i = 0; i < object.stages.length; i++) {
			stage = object.stages[i];
			if (stage.altimeters)
				stage.altimeters = stage.altimeters.map(l => func(l, AppCommonConstants.Rocketry.PartTypes.altimeter));
			if (stage.chuteProtectors)
				stage.chuteProtectors = stage.chuteProtectors.map(l => func(l, AppCommonConstants.Rocketry.PartTypes.chuteProtector));
			if (stage.chuteReleases)
				stage.chuteReleases = stage.chuteReleases.map(l => func(l, AppCommonConstants.Rocketry.PartTypes.chuteRelease));
			if (stage.deploymentBags)
				stage.deploymentBags = stage.deploymentBags.map(l => func(l, AppCommonConstants.Rocketry.PartTypes.deploymentBag));
			// if (stage.motors)
			// 	stage.motors = stage.motors.map(l => func(l, AppCommonConstants.Rocketry.PartTypes.altimeter));
			if (stage.parachutes)
				stage.parachutes = stage.parachutes.map(l => func(l, AppCommonConstants.Rocketry.PartTypes.parachute));
			if (stage.streamers)
				stage.streamers = stage.streamers.map(l => func(l, AppCommonConstants.Rocketry.PartTypes.streamer));
			if (stage.trackers)
				stage.trackers = stage.trackers.map(l => func(l, AppCommonConstants.Rocketry.PartTypes.tracker));
			delete stage.fromRocket;
			stages.push(stage);

			if (stage.motors) {
				for (let motor of stage.motors) {
					delete motor.id;
					delete motor.motorCaseInfo;
					delete motor.motorCaseName;
					delete motor.motorCaseManufacturerId;
					delete motor.motorManufacturerId;
					delete motor.motorName;
				}
			}
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
