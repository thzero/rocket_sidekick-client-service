import FlightInfoProcessorService from './index';

class EggtimerFlightInfoProcessorService extends FlightInfoProcessorService {
	get id() {
		return 'eggtimer';
	}

	_processInput(correlationId, input) {
		this._enforceNotNull('EggtimerFlightInfoProcessor', '_processInput', input, 'input', correlationId);

		const regex = /^[a-z]+$/i;
		const temp = input.data[0][4];
		if ((regex.exec(temp)) !== null)
			input.data.shift();

		for (const data of input.data) {
			this._publish(
				correlationId,
				data[0], // time
				data[1], // altitude
				data[3], // altitudeF
				data[2], // velocity
				data[4], // velocityF
				data[7], // apogee
				data[8], // noseOver
				data[9], // drogue
				data[10], // main
				data.length < 1 // ground
			);
		}

		return this._success(correlationId);
	}
}

export default EggtimerFlightInfoProcessorService;
