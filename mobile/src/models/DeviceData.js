// Device Integration Models

export const DeviceType = {
    RINGCONN: 'RingConn Smart Ring (Gen 2 Air)',
    RESMED: 'ResMed AirSense 11 AutoSet',
    ALIVECOR: 'AliveCor KardiaMobile Personal EKG',
    WITHINGS_BPM: 'Withings BPM Connect',
    WITHINGS_BEAMO: 'Withings BeamO',
    HEARTMATH: 'HeartMath Inner Balance Coherence Plus',
    BREAS: 'Breas Z2 Auto Travel CPAP',
    SYNE: 'Syne Wearable Health Device'
};

export const DataStreamType = {
    SLEEP_STAGES: 'Sleep Stages',
    HEART_RATE: 'Heart Rate',
    HEART_RATE_VARIABILITY: 'Heart Rate Variability',
    BLOOD_OXYGEN: 'Blood Oxygen (SpO2)',
    BLOOD_PRESSURE: 'Blood Pressure',
    ECG: 'Electrocardiogram (ECG)',
    APNEA_EVENTS: 'Apnea Events',
    TEMPERATURE: 'Body Temperature',
    COHERENCE_SCORE: 'Coherence Score' // HeartMath specific
};

export class DeviceConnection {
    constructor(deviceId, deviceName, type, connectionMethod) {
        this.id = deviceId;
        this.name = deviceName;
        this.type = type; // e.g., DeviceType.RINGCONN
        this.connectionMethod = connectionMethod; // e.g., 'HealthKit', 'Apple Health', 'Google Health Connect'
        this.connectedAt = new Date().toISOString();
        this.lastSync = null;
        this.activeStreams = []; // Array of DataStreamType
    }
}

export class BiometricDataPoint {
    constructor(deviceId, streamType, value, unit, timestamp = new Date().toISOString()) {
        this.id = Math.random().toString(36).substring(2, 9);
        this.deviceId = deviceId;
        this.streamType = streamType;
        this.value = value;
        this.unit = unit;
        this.timestamp = timestamp;
    }
}
