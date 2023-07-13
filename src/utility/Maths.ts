import Vector2 = Phaser.Math.Vector2
import Vector3 = Phaser.Math.Vector3

class Maths
{
    public static DegreeAngleBetween(v1: Vector2, v2: Vector2): number {
        const v1Normalized = v1.clone()
        const v2Normalized = v2.clone()

        return Math.acos((v1Normalized.x * v2Normalized.x + v1Normalized.y * v2Normalized.y) / (v1.length() * v2.length())) * Phaser.Math.RAD_TO_DEG
    }

    public static SignedDegreeAngleBetween(v1: Vector2, v2: Vector2): number {
        const v1Normalized = v1.clone()
        const v2Normalized = v2.clone()

        const angle = Math.acos((v1Normalized.x * v2Normalized.x + v1Normalized.y * v2Normalized.y) / (v1.length() * v2.length())) * Phaser.Math.RAD_TO_DEG
        const cross = new Vector3(0, 0, v1Normalized.x * v2Normalized.y - v2Normalized.x * v1Normalized.y)
        if (Vector3.FORWARD.clone().dot(cross) < 0)
        {
            return angle
        }
        else
        {
            return -angle
        }
    }

    // Assume that the point already lies on the line formed by the two other points.
    public static IsPointBetween(pointToCheck: Vector2, firstPoint: Vector2, secondPoints: Vector2): boolean {
        const firstToSecond = Phaser.Math.Distance.BetweenPoints(firstPoint, secondPoints)
        const pointToFirst = Phaser.Math.Distance.BetweenPoints(pointToCheck, firstPoint)
        const pointToSecond = Phaser.Math.Distance.BetweenPoints(pointToCheck, secondPoints)

        return Math.abs(pointToFirst + pointToSecond - firstToSecond) < Phaser.Math.EPSILON
    }

    public static clampLength(vector: Vector2, maxLength: number): Vector2 {
        vector = vector.clone()
        if (vector.length() > maxLength)
        {
            vector = vector.scale(vector.length() / maxLength)
        }
        return vector
    }

    public static lerpVector2(start: Phaser.Math.Vector2, end: Phaser.Math.Vector2, t: number): Phaser.Math.Vector2 {
        const lerpedX = Phaser.Math.Linear(start.x, end.x, t)
        const lerpedY = Phaser.Math.Linear(start.y, end.y, t)
        return new Phaser.Math.Vector2(lerpedX, lerpedY)
    }

    public static lerpVector2ByDistance(start: Phaser.Math.Vector2, end: Phaser.Math.Vector2, distance: number): Phaser.Math.Vector2 {
        const totalDistance = start.distance(end)
        const t = Phaser.Math.Clamp(distance / totalDistance, 0, 1)
        return Maths.lerpVector2(start, end, t)
    }

    public static inverseLerp(a: number, b: number, value: number): number {
        if (a === b) return 0
        return (value - a) / (b - a)
    }

}

export default Maths