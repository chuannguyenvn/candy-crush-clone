import { CONST } from '../const/Const'
import { GameScene } from '../scenes/game-scene'
import Keys from '../const/Keys'
import ConfettiParticle from './ConfettiParticle'

class ScoreManager extends Phaser.GameObjects.Container
{
    private targetScore: number = 12000
    private currentScore: number = 0
    private currentProgressBarScore: number = 0

    private text: Phaser.GameObjects.Text
    private progressBar: Phaser.GameObjects.Graphics
    private progressBarBackground: Phaser.GameObjects.Graphics

    public gameScene: GameScene

    private scoreMultiplier = 1

    private star1: Phaser.GameObjects.Image
    private star2: Phaser.GameObjects.Image
    private star3: Phaser.GameObjects.Image

    private star1Background: Phaser.GameObjects.Image
    private star2Background: Phaser.GameObjects.Image
    private star3Background: Phaser.GameObjects.Image

    private milestonesReached = 0

    constructor(scene: GameScene) {
        super(scene, 0, 0)
        scene.add.group([this], {
            runChildUpdate: true,
        })
        this.gameScene = scene
        this.progressBar = this.scene.add.graphics()
        this.progressBar.setDepth(-100)
        this.progressBar.fillStyle(0x444444, 1)
        this.progressBar.fillRoundedRect(
            CONST.TILE_HEIGHT * -0.5,
            CONST.TILE_HEIGHT * 8,
            CONST.TILE_HEIGHT * 8,
            5,
            2.5,
        )

        this.progressBarBackground = this.scene.add.graphics()
        this.progressBarBackground.setDepth(-101)
        this.progressBarBackground.fillStyle(0xcccccc, 1)
        this.progressBarBackground.fillRoundedRect(
            CONST.TILE_HEIGHT * -0.5,
            CONST.TILE_HEIGHT * 8,
            CONST.TILE_HEIGHT * 8,
            5,
            2.5,
        )

        this.star1 = scene.add.image(
            CONST.TILE_HEIGHT * -0.5 + CONST.TILE_HEIGHT * 8 / 3,
            CONST.TILE_HEIGHT * 8,
            Keys.Sprite.PROGRESS_STAR,
        )
        this.star1.setTint(0xcccccc)
        this.star1.setOrigin(0.5)
        this.star1.setDepth(0)
        this.star1.setDisplaySize(24, 24)

        this.star1Background = scene.add.image(
            CONST.TILE_HEIGHT * -0.5 + CONST.TILE_HEIGHT * 8 / 3,
            CONST.TILE_HEIGHT * 8,
            Keys.Sprite.PROGRESS_STAR,
        )
        this.star1Background.setTint(0xeeeeee)
        this.star1Background.setOrigin(0.5)
        this.star1Background.setDepth(-1)
        this.star1Background.setDisplaySize(32, 32)

        // Create the second star
        this.star2 = scene.add.image(
            CONST.TILE_HEIGHT * -0.5 + (CONST.TILE_HEIGHT * 8 / 3) * 2,
            CONST.TILE_HEIGHT * 8,
            Keys.Sprite.PROGRESS_STAR,
        )
        this.star2.setTint(0xcccccc)
        this.star2.setOrigin(0.5)
        this.star2.setDepth(0)
        this.star2.setDisplaySize(24, 24)

        this.star2Background = scene.add.image(
            CONST.TILE_HEIGHT * -0.5 + (CONST.TILE_HEIGHT * 8 / 3) * 2,
            CONST.TILE_HEIGHT * 8,
            Keys.Sprite.PROGRESS_STAR,
        )
        this.star2Background.setTint(0xeeeeee)
        this.star2Background.setOrigin(0.5)
        this.star2Background.setDepth(-1)
        this.star2Background.setDisplaySize(32, 32)

        // Create the third star
        this.star3 = scene.add.image(
            CONST.TILE_HEIGHT * -0.5 + (CONST.TILE_HEIGHT * 8 / 3) * 3,
            CONST.TILE_HEIGHT * 8,
            Keys.Sprite.PROGRESS_STAR,
        )
        this.star3.setTint(0xcccccc)
        this.star3.setOrigin(0.5)
        this.star3.setDepth(0)
        this.star3.setDisplaySize(24, 24)

        this.star3Background = scene.add.image(
            CONST.TILE_HEIGHT * -0.5 + (CONST.TILE_HEIGHT * 8 / 3) * 3,
            CONST.TILE_HEIGHT * 8,
            Keys.Sprite.PROGRESS_STAR,
        )
        this.star3Background.setTint(0xeeeeee)
        this.star3Background.setOrigin(0.5)
        this.star3Background.setDepth(-1)
        this.star3Background.setDisplaySize(32, 32)
    }

    public addScore(amount: number): void {
        this.gameScene.playPopSound((this.scoreMultiplier - 1) * 300)
        
        this.currentScore += amount * this.scoreMultiplier
        this.scoreMultiplier += 0.05
        this.scoreMultiplier = Phaser.Math.Clamp(this.scoreMultiplier, 1, 3)

        if (this.currentScore >= 4000 && this.milestonesReached === 0)
        {
            this.gameScene.cheersSound.play()
            this.star1.setTint(0x444444)
            this.milestonesReached = 1
            this.gameScene.tweens.add({
                targets: this.star1,
                angle: 360,
                duration: 500,
                ease: Phaser.Math.Easing.Sine.InOut,
            })

            this.explodeConfetti(this.star1.x, this.star1.y)
            this.gameScene.gridManager.awaitingShuffle = true
        }
        else if (this.currentScore >= 8000 && this.milestonesReached === 1)
        {
            this.gameScene.cheersSound.play()
            this.star2.setTint(0x444444)
            this.milestonesReached = 2
            this.gameScene.tweens.add({
                targets: this.star2,
                angle: 360,
                duration: 500,
                ease: Phaser.Math.Easing.Sine.InOut,
            })

            this.explodeConfetti(this.star2.x, this.star2.y)
            this.gameScene.gridManager.awaitingShuffle = true
        }
        else if (this.currentScore >= 12000 && this.milestonesReached === 2)
        {
            this.gameScene.cheersSound.play()
            this.star3.setTint(0x444444)
            this.milestonesReached = 3
            this.gameScene.tweens.add({
                targets: this.star3,
                angle: 360,
                duration: 500,
                ease: Phaser.Math.Easing.Sine.InOut,
            })

            this.explodeConfetti(this.star3.x, this.star3.y)
            this.gameScene.gridManager.awaitingShuffle = true
        }
    }

    private explodeConfetti(xPos: number, yPos: number) {
        const hsv = Phaser.Display.Color.HSVColorWheel(0.8, 0.9)
        const tint = hsv.map(entry => entry.color)

        this.gameScene.add.particles(xPos, yPos, Keys.Sprite.CONFETTI, {
            lifespan: { min: 4000, max: 6000 },
            // speedX: { min: -150, max: 150 },
            speedY: { min: -750, max: -2000 },
            gravityY: 2000,
            scale: { min: 0.1, max: 0.5 },
            tint: tint,
            emitting: true,
            particleClass: ConfettiParticle,
        }).explode(Phaser.Math.Between(50, 100))

        this.gameScene.add.particles(xPos, yPos, Keys.Sprite.CONFETTI_FLIPPED, {
            lifespan: { min: 4000, max: 6000 },
            // speedX: { min: -150, max: 150 },
            speedY: { min: -750, max: -2000 },
            gravityY: 2000,
            scale: { min: 0.1, max: 0.5 },
            tint: tint,
            emitting: true,
            particleClass: ConfettiParticle,
        }).explode(Phaser.Math.Between(50, 100))
    }

    public resetMultiplier(): void {
        this.scoreMultiplier = 1
    }

    update(time: number, deltaTime: number) {
        if (this.currentProgressBarScore < this.currentScore)
            this.currentProgressBarScore += deltaTime * 10

        const progress = Phaser.Math.Clamp(this.currentProgressBarScore / this.targetScore, 0, 1)

        this.progressBar.clear()
        this.progressBar.fillStyle(0x444444, 1)
        this.progressBar.fillRoundedRect(CONST.TILE_HEIGHT * -0.5, CONST.TILE_HEIGHT * 8, CONST.TILE_HEIGHT * 8 * progress, 5, 2.5)
    }
}

export default ScoreManager