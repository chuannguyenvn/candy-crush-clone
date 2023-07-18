import { GameScene } from '../scenes/game-scene'
import Keys from '../const/Keys'

class FollowTarget extends Phaser.GameObjects.Container
{
    constructor(scene: GameScene) {
        super(scene)
    }
}

export default FollowTarget