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
		console.log(features, 'features');
		this._featuresOverride(features);
		console.log(features, 'features.after.override');
		this._features = features;
		console.log(this._features, 'features.final');
		return features;
	}

	_featuresOverride(features) {
	}
}

export default FeatureService;
