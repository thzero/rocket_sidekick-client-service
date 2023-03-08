import configureMeasurements, { length, speed } from 'convert-units';

import AppConstants from '@/utility/constants';

import LibraryCommonUtility from '@thzero/library_common/utility/index';

import ToolsService from '@/service/tools/index';

class FlightInfoProcessorService extends ToolsService {
	constructor() {
		super();

		this._convert = configureMeasurements({
			length,
			speed
		});
	}

	get id() {
		throw Error('Not Implemented');
	}

	process(correlationId, results, data, measurementUnits) {
		this._enforceNotNull('FlightInfoProcessorService', 'process', results, 'results', correlationId);
		this._enforceNotNull('FlightInfoProcessorService', 'process', data, 'data', correlationId);
		this._enforceNotNull('FlightInfoProcessorService', 'process', measurementUnits, 'measurementUnits', correlationId);
		this._enforceNotEmpty('FlightInfoProcessorService', 'process', measurementUnits.id, 'measurementUnits.id', correlationId);
		this._enforceNotEmpty('FlightInfoProcessorService', 'process', measurementUnits.accelerationId, 'measurementUnits.accelerationId', correlationId);
		this._enforceNotEmpty('FlightInfoProcessorService', 'process', measurementUnits.distanceId, 'measurementUnits.distanceId', correlationId);
		this._enforceNotEmpty('FlightInfoProcessorService', 'process', measurementUnits.velocityId, 'measurementUnits.velocityId', correlationId);
		this._enforceNotEmpty('FlightInfoProcessorService', 'process', measurementUnits.outputId, 'measurementUnits.outputId', correlationId);
		this._enforceNotEmpty('FlightInfoProcessorService', 'process', measurementUnits.accelerationtId, 'measurementUnits.accelerationtId', correlationId);
		this._enforceNotEmpty('FlightInfoProcessorService', 'process', measurementUnits.distanceOutputId, 'measurementUnits.distanceOutputId', correlationId);
		this._enforceNotEmpty('FlightInfoProcessorService', 'process', measurementUnits.velocityOutputId, 'measurementUnits.velocityOutputId', correlationId);

		this._data = new FlightData();

		const responseProcessInput = this._processInput(correlationId, data);
		if (this._hasFailed(responseProcessInput))
			return responseProcessInput;

		const responseProcessInputSort = this._processInputSort(correlationId);
		if (this._hasFailed(responseProcessInputSort))
			return responseProcessInputSort;

		if (responseProcessInputSort.results && LibraryCommonUtility.isFunction(responseProcessInputSort.results))
			this._data.sort(responseProcessInputSort.results);

		const responseProcessInputPost = this._processInputPost(correlationId);
		if (this._hasFailed(responseProcessInputPost))
			return responseProcessInputPost;

		let altitude;
		let altitudeF;
		let apogee;
		let drogue;
		let main;
		let noseOver;
		let time;
		let velocity;
		let velocityF;
		let previousTime = 0;
		let previousVelocity = 0;
		let previousVelocityF = 0;
		let deltaT;
		let deltaV;
		let acceleration;
		let accelerationF;

		results.info.events.apogee.achieved = false;
		results.info.events.drogue.fired = false;
		results.info.events.noseOver.achieved = false;
		results.info.mainFired = false;

		for (const data of this._data.rows) {
			time = data.time;

			results.info.time.push(time);

			altitude = this._convertAltitude(data.altitude, measurementUnits);
			results.info.altitude.data.push(altitude);

			velocity = this._convertVelocity(data.velocity, measurementUnits);
			results.info.velocity.data.push(velocity);

			altitudeF = this._convertAltitude(data.altitudeF, measurementUnits);
			results.info.altitude.dataF.push(altitudeF);

			velocityF = this._convertVelocity(data.velocityF, measurementUnits);
			results.info.velocity.dataF.push(velocityF);

			apogee = data.apogee;
			if (apogee) {
				results.info.events.apogee.achieved = true;
				apogee = this._convertAltitude(apogee, measurementUnits);
				results.info.altitude.max = altitude;
				results.info.altitude.maxF = altitudeF;
				results.info.events.apogee.altitude = altitude;
				results.info.events.apogee.altitudeF = altitudeF;
				results.info.events.apogee.time = time;
				results.info.events.apogee.timeF = time;
				results.info.events.apogee.data.push(altitude);
				results.info.events.apogee.dataF.push(altitudeF);
			}
			else {
				results.info.events.apogee.data.push('N/A');
				results.info.events.apogee.dataF.push('N/A');
			}

			noseOver = data.noseOver;
			if (noseOver) {
				results.info.events.noseOver.achieved = true;
				noseOver = this._convertAltitude(noseOver, measurementUnits);
				results.info.events.noseOver.altitude = altitude;
				results.info.events.noseOver.altitudeF = altitudeF;
				results.info.events.noseOver.time = time;
				results.info.events.noseOver.timeF = time;
				results.info.events.noseOver.data.push(altitude);
				results.info.events.noseOver.dataF.push(altitudeF);
			}
			else {
				results.info.events.noseOver.data.push('N/A');
				results.info.events.noseOver.dataF.push('N/A');
			}

			drogue = data.drogue;
			if (drogue) {
				results.info.events.drogue.fired = true;
				drogue = this._convertAltitude(drogue, measurementUnits);
				results.info.events.drogue.altitude = altitude;
				results.info.events.drogue.time = altitudeF;
				results.info.events.drogue.timeF = time;
				results.info.events.drogue.data.push(altitude);
				results.info.events.drogue.dataF.push(altitudeF);
			}
			else {
				results.info.events.drogue.data.push('N/A');
				results.info.events.drogue.dataF.push('N/A');
			}

			main = data.main;
			if (main) {
				results.info.events.main.fired = true;
				main = this._convertAltitude(main, measurementUnits);
				results.info.events.main.altitude = altitude;
				results.info.events.main.altitudeF = altitudeF;
				results.info.events.main.time = time;
				results.info.events.main.timeF = time;
				results.info.events.main.data.push(altitude);
				results.info.events.main.dataF.push(altitudeF);
			}
			else {
				results.info.events.main.data.push('N/A');
				results.info.events.main.dataF.push('N/A');
			}

			if (!data.ground)
				results.info.events.ground.time = time;

			if (velocity > results.info.velocity.max.value) {
				results.info.velocity.max.altitude = altitude;
				results.info.velocity.max.time = time;
				results.info.velocity.max.value = velocity;
			}
			if (velocityF > results.info.velocity.max.valueF) {
				results.info.velocity.max.altitudeF = altitudeF;
				results.info.velocity.max.timeF = time;
				results.info.velocity.max.valueF = velocityF;
			}

			if (velocity < results.info.velocity.min.value) {
				results.info.velocity.min.altitude = altitude;
				results.info.velocity.min.time = time;
				results.info.velocity.min.value = velocity;
			}
			if (velocityF < results.info.velocity.min.valueF) {
				results.info.velocity.min.altitudeF = altitudeF;
				results.info.velocity.min.timeF = time;
				results.info.velocity.min.valueF = velocityF;
			}

			if (!results.info.events.apogee.achieved) {
				results.info.velocity.avg.temp += velocity;
				results.info.velocity.avg.count++;
				results.info.velocity.avg.tempF += velocityF;
				results.info.velocity.avg.countF++;
			}

			if (results.info.events.main.fired) {
				if (velocity < results.info.velocity.min.main.max.value) {
					results.info.velocity.min.main.max.altitude = altitude;
					results.info.velocity.min.main.max.time = time;
					results.info.velocity.min.main.max.value = velocity;
				}
				if (velocityF < results.info.velocity.min.main.max.valueF) {
					results.info.velocity.min.main.max.altitudeF = altitudeF;
					results.info.velocity.min.main.max.timeF = time;
					results.info.velocity.min.main.max.valueF = velocityF;
				}

				if (velocity > results.info.velocity.min.main.min.value) {
					results.info.velocity.min.main.min.altitude = altitude;
					results.info.velocity.min.main.min.time = time;
					results.info.velocity.min.main.min.value = velocity;
				}
				if (velocityF > results.info.velocity.min.main.min.valueF) {
					results.info.velocity.min.main.min.altitudeF = altitudeF;
					results.info.velocity.min.main.min.timeF = time;
					results.info.velocity.min.main.min.valueF = velocityF;
				}

				results.info.velocity.min.main.avg.temp += velocity;
				results.info.velocity.min.main.avg.count++;
				results.info.velocity.min.main.avg.tempF += velocityF;
				results.info.velocity.min.main.avg.countF++;

				results.info.velocity.min.main.data.push({
					altitude: altitude,
					time: time,
					value: velocity
				});
				results.info.velocity.min.main.dataF.push({
					altitude: altitudeF,
					time: time,
					value: velocityF
				});
			}
			else if (results.info.events.drogue.fired || results.info.events.noseOver.achieved) {
				if (velocity < results.info.velocity.min.drogue.max.value) {
					results.info.velocity.min.drogue.max.altitude = altitude;
					results.info.velocity.min.drogue.max.time = time;
					results.info.velocity.min.drogue.max.value = velocity;
				}
				if (velocityF < results.info.velocity.min.drogue.max.valueF) {
					results.info.velocity.min.drogue.max.altitudeF = altitudeF;
					results.info.velocity.min.drogue.max.timeF = time;
					results.info.velocity.min.drogue.max.valueF = velocityF;
				}

				if (velocity > results.info.velocity.min.drogue.min.value) {
					results.info.velocity.min.drogue.min.altitude = altitude;
					results.info.velocity.min.drogue.min.time = time;
					results.info.velocity.min.drogue.min.value = velocity;
				}
				if (velocityF > results.info.velocity.min.drogue.min.valueF) {
					results.info.velocity.min.drogue.min.altitudeF = altitudeF;
					results.info.velocity.min.drogue.min.timeF = time;
					results.info.velocity.min.drogue.min.valueF = velocityF;
				}

				results.info.velocity.min.drogue.avg.temp += velocity;
				results.info.velocity.min.drogue.avg.count++;
				results.info.velocity.min.drogue.avg.tempF += velocityF;
				results.info.velocity.min.drogue.avg.countF++;

				results.info.velocity.min.drogue.data.push({
					altitude: altitude,
					time: time,
					value: velocity
				});
				results.info.velocity.min.drogue.dataF.push({
					altitude: altitudeF,
					time: time,
					value: velocityF
				});
			}

			deltaT = time - previousTime;
			if (velocity > 0) {
				if (velocity > previousVelocity) {
					deltaV = velocity - previousVelocity;
					acceleration = this._round(deltaT > 0 ? deltaV / deltaT : 0);
					results.info.acceleration.avg.temp = acceleration;
					results.info.acceleration.avg.count++;
				}
				else
					acceleration = 0;
				if (acceleration > results.info.acceleration.max.value) {
					results.info.acceleration.max.altitude = altitude;
					results.info.acceleration.max.time = time;
					results.info.acceleration.max.value = acceleration;
				}
			}
			if (velocityF > 0) {
				if (velocityF > previousVelocityF) {
					deltaV = velocityF - previousVelocityF;
					accelerationF = this._round(deltaT > 0 ? deltaV / deltaT : 0);
					results.info.acceleration.avg.tempF = accelerationF;
					results.info.acceleration.avg.countF++;
				}
				else
					accelerationF = 0;
				if (accelerationF > results.info.acceleration.max.valueF) {
					results.info.acceleration.max.altitudeF = altitudeF;
					results.info.acceleration.max.timeF = time;
					results.info.acceleration.max.valueF = accelerationF;
				}
			}

			if (velocity < 0) {
				if (velocity < previousVelocity) {
					deltaV = velocity - previousVelocity;
					acceleration = this._round(deltaV / deltaT);
				}
				else
					acceleration = 0;

				if (acceleration < results.info.acceleration.min.value) {
					results.info.acceleration.min.altitude = altitude;
					results.info.acceleration.min.time = time;
					results.info.acceleration.min.value = acceleration;
				}

				if (results.info.events.main.fired) {
					// if (acceleration < results.info.acceleration.min.main.value) {
					// 	results.info.acceleration.min.main.altitude = altitude;
					// 	results.info.acceleration.min.main.time = time;
					// 	results.info.acceleration.min.main.value = acceleration;
					// }

					if (acceleration < results.info.acceleration.min.main.max.value) {
						results.info.acceleration.min.main.max.altitude = altitude;
						results.info.acceleration.min.main.max.time = time;
						results.info.acceleration.min.main.max.value = acceleration;
					}

					if (acceleration > results.info.acceleration.min.main.min.value) {
						results.info.acceleration.min.main.min.altitude = altitude;
						results.info.acceleration.min.main.min.time = time;
						results.info.acceleration.min.main.min.value = acceleration;
					}

					results.info.acceleration.min.main.avg.temp += acceleration;
					results.info.acceleration.min.main.avg.count++;
				}
				else if (results.info.events.drogue.fired || results.info.events.noseOver.achieved) {
					// if (acceleration < results.info.acceleration.min.drogue.value) {
					// 	results.info.acceleration.min.drogue.altitude = altitude;
					// 	results.info.acceleration.min.drogue.time = time;
					// 	results.info.acceleration.min.drogue.value = acceleration;
					// }

					if (acceleration < results.info.acceleration.min.drogue.max.value) {
						results.info.acceleration.min.drogue.max.altitude = altitude;
						results.info.acceleration.min.drogue.max.time = time;
						results.info.acceleration.min.drogue.max.value = acceleration;
					}

					if (velocityF > results.info.acceleration.min.drogue.min.value) {
						results.info.acceleration.min.drogue.min.altitude = altitude;
						results.info.acceleration.min.drogue.min.time = time;
						results.info.acceleration.min.drogue.min.value = acceleration;
					}

					results.info.acceleration.min.drogue.avg.temp += acceleration;
					results.info.acceleration.min.drogue.avg.count++;
				}
			}
			if (velocityF < 0) {
				if (velocityF < previousVelocityF) {
					deltaV = velocityF - previousVelocityF;
					accelerationF = this._round(deltaV / deltaT);
				}
				else
					accelerationF = 0;

				if (accelerationF < results.info.acceleration.min.valueF) {
					results.info.acceleration.min.altitudeF = altitudeF;
					results.info.acceleration.min.timeF = time;
					results.info.acceleration.min.valueF = accelerationF;
				}

				if (results.info.events.main.fired) {
					// if (acceleration < results.info.acceleration.min.main.value) {
					// 	results.info.acceleration.min.main.altitudeF = altitudeF;
					// 	results.info.acceleration.min.main.timeF = time;
					// 	results.info.acceleration.min.main.valueF = acceleration;
					// }

					if (accelerationF < results.info.acceleration.min.main.max.valueF) {
						results.info.acceleration.min.main.max.altitudeF = altitudeF;
						results.info.acceleration.min.main.max.timeF = time;
						results.info.acceleration.min.main.max.valueF = accelerationF;
					}

					if (accelerationF > results.info.acceleration.min.main.min.valueF) {
						results.info.acceleration.min.main.min.altitudeF = altitudeF;
						results.info.acceleration.min.main.min.timeF = time;
						results.info.acceleration.min.main.min.valueF = accelerationF;
					}

					results.info.acceleration.min.main.avg.tempF += accelerationF;
					results.info.acceleration.min.main.avg.countF++;
				}
				else if (results.info.events.drogue.fired || results.info.events.noseOver.achieved) {
					// if (acceleration < results.info.acceleration.min.drogue.value) {
					// 	results.info.acceleration.min.drogue.altitudeF = altitudeF;
					// 	results.info.acceleration.min.drogue.timeF = time;
					// 	results.info.acceleration.min.drogue.valueF = acceleration;
					// }

					if (accelerationF < results.info.acceleration.min.drogue.max.valueF) {
						results.info.acceleration.min.drogue.max.altitudeF = altitudeF;
						results.info.acceleration.min.drogue.max.timeF = time;
						results.info.acceleration.min.drogue.max.valueF = accelerationF;
					}

					if (velocityF > results.info.acceleration.min.drogue.min.valueF) {
						results.info.acceleration.min.drogue.min.altitudeF = altitudeF;
						results.info.acceleration.min.drogue.min.timeF = time;
						results.info.acceleration.min.drogue.min.valueF = accelerationF;
					}

					results.info.acceleration.min.drogue.avg.tempF += accelerationF;
					results.info.acceleration.min.drogue.avg.countF++;
				}
			}

			previousTime = time;
			previousVelocity = velocity;
			previousVelocityF = velocityF;
		}

		results.info.acceleration.avg.value = this._round(results.info.acceleration.avg.temp / results.info.acceleration.avg.count);
		results.info.acceleration.avg.valueF = this._round(results.info.acceleration.avg.tempF / results.info.acceleration.avg.countF);
		results.info.acceleration.min.drogue.avg.value = (results.info.events.drogue.fired || results.info.events.noseOver.achieved) ? this._round(results.info.acceleration.min.drogue.avg.temp / results.info.acceleration.min.drogue.avg.count) : 0;
		results.info.acceleration.min.drogue.avg.valueF = (results.info.events.drogue.fired || results.info.events.noseOver.achieved) ? this._round(results.info.acceleration.min.drogue.avg.tempF / results.info.acceleration.min.drogue.avg.countF) : 0;
		results.info.acceleration.min.main.avg.value = (results.info.events.main.fired) ? this._round(results.info.acceleration.min.main.avg.temp / results.info.acceleration.min.main.avg.count) : 0;
		results.info.acceleration.min.main.avg.valueF = (results.info.events.main.fired) ? this._round(results.info.acceleration.min.main.avg.tempF / results.info.acceleration.min.main.avg.countF) : 0;

		results.info.velocity.avg.value = this._round(results.info.velocity.avg.temp / results.info.velocity.avg.count);
		results.info.velocity.avg.valueF = this._round(results.info.velocity.avg.tempF / results.info.velocity.avg.countF);
		results.info.velocity.min.drogue.avg.value = (results.info.events.drogue.fired || results.info.events.noseOver.achieved) ? this._round(results.info.velocity.min.drogue.avg.temp / results.info.velocity.min.drogue.avg.count) : 0;
		results.info.velocity.min.drogue.avg.valueF = (results.info.events.drogue.fired || results.info.events.noseOver.achieved) ? this._round(results.info.velocity.min.drogue.avg.tempF / results.info.velocity.min.drogue.avg.countF) : 0;
		results.info.velocity.min.main.avg.value = (results.info.events.main.fired) ? this._round(results.info.velocity.min.main.avg.temp / results.info.velocity.min.main.avg.count) : 0;
		results.info.velocity.min.main.avg.valueF = (results.info.events.main.fired) ? this._round(results.info.velocity.min.main.avg.tempF / results.info.velocity.min.main.avg.countF) : 0;

		if (!results.info.events.drogue.fired && !results.info.events.noseOver.achieved) {
			results.info.velocity.min.drogue.min.value = 0;
			results.info.velocity.min.drogue.min.valueF = 0;
			results.info.acceleration.min.drogue.min.value = 0;
			results.info.acceleration.min.drogue.min.valueF = 0;
		}

		if (!results.info.events.main.fired) {
			results.info.velocity.min.main.min.value = 0;
			results.info.velocity.min.main.min.valueF = 0;
			results.info.acceleration.min.main.min.value = 0;
			results.info.acceleration.min.main.min.valueF = 0;
		}

		return results;
	}

	_convertAcceleration(value, measurementUnits) {
		if (!value)
			return value;

		// if (measurementUnits === AppUtility.measurementUnitEnglish)
		// 	return value;

		// value = this._round(value * 0.3048);
		// return value;

		value = this._convert(value)
			.from(AppConstants.MeasurementUnits[measurementUnits.id].cceleration[measurementUnits.acceleration])
			.to(AppConstants.MeasurementUnits[measurementUnits.outputId].acceleration[measurementUnits.accelerationOutputId]);
		return value;
	}

	_convertAltitude(value, measurementUnits) {
		if (!value)
			return value;

		// if (measurementUnits === AppUtility.measurementUnitEnglish)
		// 	return value;

		// value = this._round(value * 0.3048);
		// return value;

		value = this._convert(value)
			.from(AppConstants.MeasurementUnits[measurementUnits.id].distance[measurementUnits.distanceId])
			.to(AppConstants.MeasurementUnits[measurementUnits.outputId].distance[measurementUnits.distanceOutputId]);
		return value;
	}

	_convertVelocity(value, measurementUnits) {
		if (!value)
			return value;

		// if (measurementUnits === AppUtility.measurementUnitEnglish)
		// 	return value;

		// value = this._round(value * 0.3048);
		// return value;

		value = this._convert(value)
			.from(AppConstants.MeasurementUnits[measurementUnits.id].velocity[measurementUnits.velocityId])
			.to(AppConstants.MeasurementUnits[measurementUnits.outputId].velocity[measurementUnits.velocityOutputId]);
		return value;
	}

	_processInput(correlationId, input) {
		throw Error('Not Implemented');
	}

	_processInputPost(correlationId) {
		this._data.process(correlationId);
		return this._success(correlationId);
	}

	_processInputSort(correlationId) {
		return this._success(correlationId);
	}

	_publish(correlationId, time, altitude, altitudeF, velocity, velocityF, apogee, noseOver, drogue, main, ground) {
		this._data.publish(correlationId, time, altitude, altitudeF, velocity, velocityF, apogee, noseOver, drogue, main, ground);
	}

	_round(value, places = 2) {
		return Number(value.toFixed(places));
	}
}

class FlightData {
	constructor() {
		this._rows = [];
	}

	get rows() {
		return this._rows;
	}

	publish(correlationId, time, altitude, altitudeF, velocity, velocityF, apogee, noseOver, drogue, main, ground) {
		this._rows.push({
			altitude: Number(altitude),
			altitudeF: altitudeF ? Number(altitudeF) : null,
			apogee: apogee ? Number(apogee) : null,
			drogue: drogue ? Number(drogue) : null,
			ground: ground || false,
			main: main ? Number(main) : null,
			noseOver: noseOver ? Number(noseOver) : null,
			time: Number(time),
			velocity: Number(velocity),
			velocityF: velocityF ? Number(velocityF) : null
		});
	}

	process(correlationId) {
	}
}

export default FlightInfoProcessorService;
