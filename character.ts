import { GameObject } from './gameObject';
import { TILES } from './tiles';
import { ctx } from './index';
import { Camera } from './camera';
import { FRAME_RATE } from './constants';
import { vectorLength } from './helpers';

type Status = 'exhausted';

export class Character extends GameObject {
    baseSpeed = 2;
    maxSpeed = 5;
    isSprinting = false;
    inertia = 10;
    maxStamina = 50;
    stamina: number;
    statuses: Partial<{ [status in Status]: { ticks: number} }> = {};
    targets: GameObject[] = [];
    tileSet: GameObject['tileSet'] = [
        {
            tile: TILES.character,
        },
    ];

    constructor(options?: Partial<Character>) {
        super(options);

        this.stamina = this.maxStamina;

        Object.assign(this, options);
    }

    moveToward(targetX: number, targetY: number) {
        if (!targetX && !targetY) {
            return;
        }

        const maxSpeed = !this.statuses.exhausted && this.isSprinting ? this.maxSpeed : this.baseSpeed;

        // Scale movement units based on angle.
        const angle = Math.atan2(targetX, targetY);
        const unitX = Math.sin(angle) * maxSpeed;
        const unitY = Math.cos(angle) * maxSpeed;

        // Average the desired velocity with the current velocity, weighted by inertia.
        const [velocityX, velocityY] = this.velocity;
        const weightedVelocityX = velocityX * this.inertia;
        const weightedVelocityY = velocityY * this.inertia;
        let averageX = (unitX + weightedVelocityX) / (this.inertia + 1);
        let averageY = (unitY + weightedVelocityY) / (this.inertia + 1);

        // Scale X movement if nearing target.
        if (Math.abs(targetX) < Math.abs(weightedVelocityX)) {
            averageX *= 0.9;
        }

        // Scale Y movement if nearing target.
        if (Math.abs(targetY) < Math.abs(weightedVelocityY)) {
            averageY *= 0.9;
        }

        this.move(averageX, averageY);
    }

    processFrame(frame: number) {
        super.processFrame(frame);

        const isExhausted = this.statuses.exhausted;

        // Stamina is locked at 0 for 5 seconds into exhaustion.
        if (!isExhausted || this.statuses.exhausted.ticks < FRAME_RATE * 5) {
            // Adjust stamina based on movement amount.
            const moveAmount = vectorLength(this.velocity);

            // Stamina regenerates while moving under baseSpeed.
            if (moveAmount <= this.baseSpeed * 1.1) {
                this.stamina = Math.min(this.stamina + 0.1, this.maxStamina);
            } else {
                const exertion = (moveAmount - this.baseSpeed) / (this.maxSpeed - this.baseSpeed);
                this.stamina = Math.max(0, this.stamina - exertion * 0.2);
            }
        }

        // If character has just run out of stamina...
        if (!this.stamina && !isExhausted) {
            // Set the exhausted status for 10 seconds.
            this.statuses.exhausted = { ticks: FRAME_RATE * 10 };
        } else if (isExhausted) {
            const newValue = Math.max(0, this.statuses.exhausted.ticks - 1)
            this.statuses.exhausted.ticks = newValue;

            if (newValue === 0 && this.stamina === this.maxStamina) {
                delete this.statuses.exhausted;
            }
        }
    }

    hasTarget() {
        return !!this.targets.length;
    }

    addTarget(targetOptions?: Partial<GameObject>) {
        const target = new GameObject(targetOptions);

        this.targets.push(target);
    }

    removeTarget(target: GameObject) {
        const index = this.targets.indexOf(target);

        if (index >= 0) {
            this.targets.splice(index, 1);
        }
    }

    clearTargets() {
        // this.targets must be mutated because the world has a reference to it.
        this.targets.forEach(this.removeTarget.bind(this));
    }

    approachTarget() {
        const target = this.targets[0];
        const directionX = target.x - this.x;
        const directionY = target.y - this.y;
        
        this.moveToward(directionX, directionY);

        const moveComplete = (
            Math.abs(this.x - target.x) < Math.abs(this.velocity[0])
            && Math.abs(this.y - target.y) < Math.abs(this.velocity[1])
        );

        if (moveComplete) {
            this.x = target.x;
            this.y = target.y;
            this.removeTarget(target);
        }
    }

    render(camera: Camera) {
        super.render(camera);

        const [velocityX, velocityY] = this.velocity;
        const x = (this.x - camera.x) * camera.zoom;
        const y = (this.y + this.height - camera.y) * camera.zoom;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + velocityX * 100, y + velocityY * 100);
        ctx.stroke();
    }
}
