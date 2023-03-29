import AppSharedConstants from '@/utility/constants';

import BaseFeaturesService from '@thzero/library_client/service/features';

class FeatureService extends BaseFeaturesService {
	constructor() {
		super();

		this._features = null;
	}

	features() {
		if (this._features)
			return this._features;

		const features = AppSharedConstants.Features;
		this._featuresOverride(features);
		this._features = features;
		return features;
	}

	_featuresOverride(features) {
	}
}

export default FeatureService;
