export const toRad = (angle: number): number => (Math.PI / 180) * angle;

type sineParams = {
  min: number;
  max: number;
  angle: number;
  phase?: number;
};

/**
 * Oscillates value by sine function
 *
 * @param min – min value
 * @param max - max value
 * @param angle – sine angle in degrees
 * @param phase – phase value between 0 & 1
 *
 * @returns {number} – current value between -amp & +amp
 */
export const sine = ({ min, max, angle, phase = 0 }: sineParams): number => {
  let radians = toRad(angle + phase * Math.PI * 2);
  let distance = max - min;

  return min + distance / 2 + (distance / 2) * Math.sin(radians);
};

export const pointAtAngle = (circle: Circle, angle: number): Point => ({
  x: circle.center.x + circle.radius * Math.cos(toRad(angle)),
  y: circle.center.y + circle.radius * Math.sin(toRad(angle)),
});

export const polyPoints = (
  circle: Circle,
  vertices: number = 1,
  startAngle: number = 0
): Point[] => {
  let points: Point[] = [];

  for (let i = 0; i < vertices; i++) {
    let pointAngle = startAngle + ((Math.PI * 2) / vertices) * i;
    points.push({
      x: circle.center.x + circle.radius * Math.cos(pointAngle),
      y: circle.center.y + circle.radius * Math.sin(pointAngle),
    });
  }

  return points;
};
