import AppCommonConstants from 'rocket_sidekick_common/constants';

import BaseService from '@thzero/library_client/service/index';

class ToolsService extends BaseService {
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
