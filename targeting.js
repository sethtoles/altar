((global) => {
    global.makeTargeting = makeTargeting;

    function makeTargeting(gameObject) {
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
        const target = global.gameObjectFactory(targetOptions);

        scene.targets.push(target);

        this.targets.push(target);
    }

    function removeTarget(target) {
        const index = this.targets.indexOf(target);
        const sceneIndex = scene.targets.indexOf(target);

        if (sceneIndex >= 0) {
            scene.targets.splice(sceneIndex, 1);
        }

        if (index >= 0) {
            return this.targets.splice(index, 1);
        }
    }

    function clearTargets() {
        if (this.targets.length) {
            this.targets.forEach(this.removeTarget.bind(this));
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
            } else {
                this.moveToward(directionX, directionY);
            }
        }
    }
})(window);
