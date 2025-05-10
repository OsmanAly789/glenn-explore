import { Coords, coordsToVector3 } from 'react-three-map';

// Data points for Z-offset calculation
const dataPoints = [
    { latDeg: 0, offset: 0 },
    { latDeg: 1.0596696870124873, offset: -1 },
    { latDeg: 5.4731838709179925, offset: -1 },
    { latDeg: 17.94305613152696, offset: 10 },
    { latDeg: 20.238566141994056, offset: 13 },
    { latDeg: 38.42928640788094, offset: 59 },
    { latDeg: 53.29212549158353, offset: 182.73229986130883 },
    { latDeg: 57.70576659145931, offset: 220 },
    { latDeg: 57.71025718760271, offset: 222 },
    { latDeg: 57.92042004883942, offset: 230 },
    { latDeg: 58.35520778389906, offset: 235 },
    { latDeg: 59.07864392613004, offset: 248 },
    { latDeg: 59.50398472426278, offset: 258 },
    { latDeg: 60.3236532349209, offset: 270 },
    { latDeg: 62.052543519359745, offset: 310 },
    { latDeg: 64.00796728538162, offset: 360 },
    { latDeg: 65.85436925799212, offset: 421 },
    { latDeg: 68.58185501606764, offset: 494.47255747194254 }
];

// Calculate constants for Z-offset
const calculateZOffsetConstants = () => {
    const n = dataPoints.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    dataPoints.forEach(point => {
        const latRad = (point.latDeg * Math.PI) / 180;
        const secLat = 1 / Math.cos(latRad);
        sumX += secLat;
        sumY += point.offset;
        sumXY += secLat * point.offset;
        sumX2 += secLat * secLat;
    });

    const C2 = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const C1 = (sumY - C2 * sumX) / n;

    return { C1, C2 };
};

const { C1: C1_CALCULATED, C2: C2_CALCULATED } = calculateZOffsetConstants();

interface CoordinatePoint {
    longitude: number;
    latitude: number;
}

interface PositionConfig {
    basePosOffsetX: number;
    basePosOffsetY: number;
    basePosOffsetZ: number;
    scaleFactor: number;
}

export const coordsToVector3WithCorrection = (
    point: CoordinatePoint,
    origin: CoordinatePoint,
    config: PositionConfig
): [number, number, number] => {
    const basePosition = coordsToVector3(point, origin);

    const point_latitude_rad = (point.latitude * Math.PI) / 180;
    const sec_point_lat = 1 / Math.cos(point_latitude_rad);

    const dynamicOffsetZ = C1_CALCULATED + C2_CALCULATED * sec_point_lat;

    return [
        basePosition[0] + config.basePosOffsetX,
        basePosition[1] + config.basePosOffsetY,
        basePosition[2] + (config.basePosOffsetZ || dynamicOffsetZ)
    ];
};


export const earthRadius = 6371008.8;

import { MathUtils, Vector3Tuple } from 'three';


const mercatorScaleLookup: { [key: number]: number } = {};

function getMercatorScale(lat: number): number {
    const index = Math.round(lat * 1000);
    if (mercatorScaleLookup[index] === undefined) {
        mercatorScaleLookup[index] = 1 / Math.cos(lat * MathUtils.DEG2RAD);
    }
    return mercatorScaleLookup[index];
}

export function averageMercatorScale(originLat: number, pointLat: number, steps = 50): number {
    let totalScale = 0;
    const latStep = (pointLat - originLat) / steps;
    for (let i = 0; i <= steps; i++) {
        const lat = originLat + latStep * i;
        totalScale += getMercatorScale(lat);
    }
    const avgScale = totalScale / (steps + 1);
    return avgScale;
}

let cachedMercatorScaleLookup: { [key: string]: Vector3Tuple } = {};

function getKey(point: Coords, origin: Coords): string {
    return `${point.latitude}-${point.longitude}-${origin.latitude}-${origin.longitude}`;
}

export function coordsToVector1337(point: Coords, origin: Coords, scale: number): Vector3Tuple {
    const key = getKey(point, origin);
    if (cachedMercatorScaleLookup[key] === undefined) {
        const latitudeDiff = (point.latitude - origin.latitude) * MathUtils.DEG2RAD;
        const longitudeDiff = (point.longitude - origin.longitude) * MathUtils.DEG2RAD;
        const altitudeDiff = (point.altitude || 0) - (origin.altitude || 0);

        const x = longitudeDiff * earthRadius * Math.cos(origin.latitude * MathUtils.DEG2RAD);
        const y = altitudeDiff;

        // dynamic step size based on latitude difference. calculate the mercator unit scale at origin
        // and the scale average along the line to the point for better accuracy far from origin
        const steps = Math.ceil(Math.abs(point.latitude - origin.latitude)) * 1;
        console.log(steps);
        const avgScale = averageMercatorScale(origin.latitude, point.latitude, scale);

        const z = ((-latitudeDiff * earthRadius) / getMercatorScale(origin.latitude)) * avgScale;
        const response = [x, y, z] as Vector3Tuple;
        cachedMercatorScaleLookup[key] = response;
        return response;
    }
    return cachedMercatorScaleLookup[key];
}