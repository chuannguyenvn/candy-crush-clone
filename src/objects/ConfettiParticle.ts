import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter
import Vector2 = Phaser.Math.Vector2
import Maths from '../utility/Maths'

class ConfettiParticle extends Phaser.GameObjects.Particles.Particle
{
    private startScaleX: number
    private startAngle: number
    private targetAngle: number

    constructor(emitter: ParticleEmitter) {
        super(emitter)

        this.targetAngle = Phaser.Math.Between(-400, 750)

        this.emitter.scene.time.delayedCall(0, () => {
            this.startAngle = Phaser.Math.Between(-10, 10) / 100 * Phaser.Math.RAD_TO_DEG + 90
            const rotatedVelocity = new Vector2(0, this.velocityY).rotate((this.startAngle - 90) * Phaser.Math.DEG_TO_RAD)
            this.velocityX = rotatedVelocity.x
            this.velocityY = rotatedVelocity.y
        })
    }

    update(delta: number, step: number, processors: Phaser.GameObjects.Particles.ParticleProcessor[]): boolean {
        if (this.velocityY < 0)
        {
            this.velocityX *= 1.01
            this.angle = this.startAngle
        }
        else
        {
            this.velocityX *= 0.9
            this.velocityY *= 0.3

            const progress = Phaser.Math.Clamp(Maths.inverseLerp(3000, 0, this.lifeCurrent), 0, 1)
            this.alpha = Phaser.Math.Linear(1, 0, Phaser.Math.Easing.Quartic.In(progress))
        }

        this.angle = Phaser.Math.Linear(this.startAngle, this.targetAngle, Phaser.Math.Easing.Sine.In(this.lifeT))

        return super.update(delta, step, processors)
    }
}

export default ConfettiParticle