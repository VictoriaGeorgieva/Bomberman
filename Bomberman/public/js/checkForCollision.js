/**
 * Created by Victoria on 2/8/2016.
 */
function checkForCollision(firstObject, secondObject){

    var result = false;

    if (firstObject.x < secondObject.x + secondObject.width - 3  && firstObject.x + firstObject.width  > secondObject.x &&
        firstObject.y < secondObject.y + secondObject.height - 8 && firstObject.y + firstObject.height - 15 > secondObject.y) {
        result = true;
    }
    return result;
}

function checkForCollisionFieldFire(firstObject, secondObject){

    var result = false;

    if (firstObject.x < secondObject.x + secondObject.width  && firstObject.x + firstObject.width > secondObject.x &&
        firstObject.y < secondObject.y + secondObject.height && firstObject.y + firstObject.height > secondObject.y) {
        result = true;
    }
    return result;
}