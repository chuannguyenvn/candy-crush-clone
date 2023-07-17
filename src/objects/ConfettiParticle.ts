import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter
import Maths from '../utility/Maths'

class ConfettiParticle extends Phaser.GameObjects.Particles.Particle
{
    private startScaleX: number
    private startAngle: number
    private targetAngle: number

    constructor(emitter: ParticleEmitter) {
        super(emitter)

        this.startAngle = Phaser.Math.Between(80, 100)
        this.targetAngle = Phaser.Math.Between(-800, 1500)
    }

    update(delta: number, step: number, processors: Phaser.GameObjects.Particles.ParticleProcessor[]): boolean {
        if (this.lifeCurrent > 4200)
        {
            this.velocityX *= 0.99
            this.velocityY *= 0.95
            this.angle = this.startAngle
        }
        else
        {
            this.velocityX *= 0.95
            this.velocityY *= 0.9

            const progress = Phaser.Math.Clamp(Maths.inverseLerp(3000, 0, this.lifeCurrent), 0, 1)
            this.alpha = Phaser.Math.Linear(1, 0, Phaser.Math.Easing.Quartic.Out(progress))
        }

        this.angle = Phaser.Math.Linear(this.startAngle, this.targetAngle, Phaser.Math.Easing.Sine.In(this.lifeT))

        return super.update(delta, step, processors)
    }
}

export default ConfettiParticle