import { gameObjectFactory, GameObject } from './gameObject';

export const targetingProps = {
    targets: [] as GameObject[],
    hasTarget,
    addTarget,
    removeTarget,
    clearTargets,
};

type Targeting = GameObject & typeof targetingProps;

function hasTarget(this: Targeting) {
    return this.targets.length;
}

function addTarget(this: Targeting, targetOptions?: Partial<GameObject>) {
    const target = gameObjectFactory(targetOptions);

    this.targets.push(target);
}

function removeTarget(this: Targeting, target: GameObject) {
    const index = this.targets.indexOf(target);

    if (index >= 0) {
        return this.targets.splice(index, 1);
    }
}

function clearTargets(this: Targeting) {
    const { length } = this.targets;

    for (let i = length - 1; i >= 0; i--) {
        this.removeTarget(this.targets[i]);
    }
}
