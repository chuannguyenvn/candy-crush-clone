import { CONST } from '../const/Const'
import { GameScene } from '../scenes/game-scene'

class ScoreManager extends Phaser.GameObjects.Container
{
    private targetScore: number = 10000
    private currentScore: number = 0
    private currentProgressBarScore: number = 0

    private text: Phaser.GameObjects.Text
    private progressBar: Phaser.GameObjects.Graphics

    public gameScene: GameScene

    private scoreMultiplier = 1

    constructor(scene: GameScene) {
        super(scene, 0, 0)
        scene.add.group([this], {
            runChildUpdate: true,
        })
        this.gameScene = scene
        this.progressBar = this.scene.add.graphics()
        this.progressBar.fillStyle(0x444444, 1)
        this.progressBar.fillRoundedRect(CONST.TILE_HEIGHT * -0.5, CONST.TILE_HEIGHT * 8, CONST.TILE_HEIGHT * 8, 5, 2.5)
    }

    public addScore(amount: number): void {
        this.currentScore += amount * this.scoreMultiplier
        this.scoreMultiplier += 0.25
    }

    public resetMultiplier(): void {
        this.scoreMultiplier = 1
    }

    update(time: number, deltaTime: number) {
        if (this.currentProgressBarScore < this.currentScore)
            this.currentProgressBarScore += deltaTime * 10

        const progress = this.currentProgressBarScore / this.targetScore

        this.progressBar.clear()
        this.progressBar.fillStyle(0x444444, 1)
        this.progressBar.fillRoundedRect(CONST.TILE_HEIGHT * -0.5, CONST.TILE_HEIGHT * 8, CONST.TILE_HEIGHT * 8 * progress, 5, 2.5)
    }
}

export default ScoreManager