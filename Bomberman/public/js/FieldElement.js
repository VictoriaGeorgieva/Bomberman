/**
 * Created by Victoria on 2/8/2016.
 */
FieldElement = function(width, height, destinationX, destinationY, canBeDestroyed) {
    this.width = width;
    this.height = height;
    this.x = destinationX;
    this.y = destinationY;
    this.canBeDestroyed = canBeDestroyed;
}

FieldElement.prototype.constructor = FieldElement;