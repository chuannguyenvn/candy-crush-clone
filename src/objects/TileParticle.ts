import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter
import Vector2 = Phaser.Math.Vector2
import Maths from '../utility/Maths'

class TileParticle extends Phaser.GameObjects.Particles.Particle
{
    private startVelocityX: number
    private startVelocityY: number

    constructor(emitter: ParticleEmitter) {
        super(emitter)

        const velocity = Phaser.Math.RandomXY(Vector2.ONE).scale(Phaser.Math.Between(500, 750))
        this.startVelocityX = velocity.x
        this.startVelocityY = velocity.y
    }

    update(delta: number, step: number, processors: Phaser.GameObjects.Particles.ParticleProcessor[]): boolean {
        if (this.lifeCurrent > 350)
        {
            const progress = Maths.inverseLerp(700, 350, this.lifeCurrent)
            this.scaleX = 0.75
            this.scaleY = 0.75
            this.velocityX = Phaser.Math.Linear(this.startVelocityX, 0, Phaser.Math.Easing.Circular.Out(progress))
            this.velocityY = Phaser.Math.Linear(this.startVelocityY, 0, Phaser.Math.Easing.Circular.Out(progress))
        }
        else if (this.lifeCurrent <= 250)
        {
            const progress = Maths.inverseLerp(250, 0, this.lifeCurrent)
            this.scaleX = this.scaleY = Phaser.Math.Linear(0.75, 0, Phaser.Math.Easing.Sine.InOut(progress))

            if (this.lifeCurrent <= 5) this.scaleX = this.scaleY = 0
        }
        
        return super.update(delta, step, processors)
    }
}

export default TileParticle