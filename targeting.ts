import { gameObjectFactory } from './gameObject';
import { scene } from './index';

export function makeTargeting(gameObject) {
    Object.assign(gameObject, {
        targets: [],
        hasTarget,
        addTarget,
        removeTarget,
        clearTargets,
        approachTarget,
    });
}

function hasTarget() {
    return this.targets.length;
}

function addTarget(targetOptions) {
    const target = gameObjectFactory(targetOptions);

    this.targets.push(target);
}

function removeTarget(target) {
    const index = this.targets.indexOf(target);

    if (index >= 0) {
        return this.targets.splice(index, 1);
    }
}

function clearTargets() {
    const { length } = this.targets;

    for (let i = length - 1; i >= 0; i--) {
        this.removeTarget(this.targets[i]);
    }
}

function approachTarget() {
    if (this.moveToward) {
        const target = this.targets[0];
        const speed = this.getSpeed();

        const directionX = target.x - this.x;
        const directionY = this.y - target.y;

        if (
            Math.abs(directionX) < speed
            && Math.abs(directionY) < speed
        ) {
            this.removeTarget(target);
        }
        else {
            this.moveToward(directionX, directionY);
        }
    }
}
