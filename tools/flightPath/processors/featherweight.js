import FlightPathProcessorService from './index';

class FeatherweightFlightPathProcessorService extends FlightPathProcessorService {
	get id() {
		return 'featherweight';
	}

	_processData(correlationId, input) {
		this._enforceNotNull('FeatherweightFlightPathProcessorService', '_processData', input, 'input', correlationId);

		const regex = /^[a-z]+$/i;
		const temp = input.data[0][4];
		if ((regex.exec(temp)) !== null)
			input.data.shift();

		let verticalV;
		for (const data of input.data) {
			verticalV = Number(data[8]);
			if (verticalV >= 0 && verticalV < 10)
				continue;
			if (verticalV > -10 && verticalV <= 0)
				continue;
			this._publish(
				correlationId,
				// data[2], // time
				// data[5] - 595.67, // altitude
				// data[3], // latitude
				// data[4], // longitude
				// data[7], // verticalH
				// verticalV // verticalV
				data[1], // time
				data[2], // altitude
				data[3], // latitude
				data[4], // longitude
				data[7], // verticalH
				verticalV // verticalV
			);
		}

		return this._success(correlationId);
	}

	_processDataSort(correlationId) {
		return this._successResponse((a, b) => {
			if (a.time > b.time)
				return 1;
			if (a.time < b.time)
				return -1;

			return 0;
		}, correlationId);
	}
}

export default FeatherweightFlightPathProcessorService;
