/**
 * Created by Victoria on 2/10/2016.
 */
Fire = function(width, height, image, destinationX, destinationY){
    this.width = width;
    this.height = height;
    this.image = image;
    this.x = destinationX;
    this.y = destinationY;
}

Fire.prototype.constructor = Fire;

Fire.prototype.RemoveBlockedFire = function(arrOfAll, fire, field, canBeDestroyed){

    if(Math.abs(field.x - arrOfAll[0].x) > 35){
        if(field.x > arrOfAll[0].x){
            console.log('right side');

            $.each(arrOfAll, function(){
                if(this.x > field.x){
                    var index = arrOfAll.indexOf(this);

                    if (index > -1) {
                        arrOfAll.splice(index, 1);
                    }
                }
            });
        }
        if(field.x < arrOfAll[0].x){
            console.log('left side');

            $.each(arrOfAll, function(){
                if(this.x < field.x){
                    var index = arrOfAll.indexOf(this);

                    if (index > -1) {
                        arrOfAll.splice(index, 1);
                    }
                }
            });
        }
    } else if(Math.abs(field.y - arrOfAll[0].y) > 35){
        if(field.y > arrOfAll[0].y){
            console.log('down side');

            $.each(arrOfAll, function(){
                if(this.y > field.y){
                    var index = arrOfAll.indexOf(this);

                    if (index > -1) {
                        arrOfAll.splice(index, 1);
                    }
                }
            });
        }
        if(field.y < arrOfAll[0].y){
            console.log('up side');

            $.each(arrOfAll, function(){
                if(this.y < field.y){
                    var index = arrOfAll.indexOf(this);

                    if (index > -1) {
                        arrOfAll.splice(index, 1);
                    }
                }
            });
        }
    }

    if(!canBeDestroyed) {
        var index = arrOfAll.indexOf(fire);

        if (index > -1) {
            arrOfAll.splice(index, 1);
        }
    }
}