import AppCommonConstants from 'rocket_sidekick_common/constants';

import BaseService from '@thzero/library_client/service/index';

class ToolsService extends BaseService {
	_checkField(correlationId, input, error, errors) {
		if (input === -1) {
			errors.push(error);
			return false;
		}
		return true;
	}

	_measurementUnitFromId(correlationId, measurementUnitsId, measurementUnitType, measurementUnitId) {
		const units = AppCommonConstants.MeasurementUnits[measurementUnitsId];
		if (!units)
			return null;
		const unitType = units[measurementUnitType];
		if (!unitType)
			return null;
		return unitType[measurementUnitId];
	}
}

export default ToolsService;
