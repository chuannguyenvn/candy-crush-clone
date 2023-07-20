import { CONST } from '../const/Const'
import GridManager from '../objects/GridManager'
import ScoreManager from '../objects/ScoreManager'
import HTML5AudioSound = Phaser.Sound.HTML5AudioSound

export class GameScene extends Phaser.Scene
{
    public gridManager: GridManager
    public scoreManager: ScoreManager

    public squeakySound: Phaser.Sound.HTML5AudioSound
    public popSounds: Phaser.Sound.HTML5AudioSound[] = []
    public swapSound: Phaser.Sound.HTML5AudioSound
    public cheersSound: Phaser.Sound.HTML5AudioSound
    public starSound: Phaser.Sound.HTML5AudioSound
    public chooseSound: Phaser.Sound.HTML5AudioSound
    
    constructor() {
        super({
            key: 'GameScene',
        })
    }

    create(): void {
        this.cameras.main.setBackgroundColor(0xeeeeee)
        this.cameras.main.centerOn(CONST.TILE_WIDTH * 3.5, CONST.TILE_HEIGHT * 4)

        this.gridManager = new GridManager(this, 8, 8, CONST.CANDY_TYPES)
        this.scoreManager = new ScoreManager(this)
        this.squeakySound = this.sound.add('squeak') as HTML5AudioSound
        for (let i = 0; i < 10; i++)
        {
            this.popSounds.push(this.sound.add('pop') as HTML5AudioSound)
        }
        
        this.swapSound = this.sound.add('swap') as HTML5AudioSound
        this.cheersSound = this.sound.add('cheers') as HTML5AudioSound
        this.starSound = this.sound.add('star') as HTML5AudioSound
        this.chooseSound = this.sound.add('choose') as HTML5AudioSound
    }

    public playPopSound(detune: number): void {
        for (let i = 0; i < 10; i++)
        {
            if (!this.popSounds[i].isPlaying)
            {
                this.popSounds[i].setDetune(detune)
                this.popSounds[i].play()
                return
            }
        }
    }
}
