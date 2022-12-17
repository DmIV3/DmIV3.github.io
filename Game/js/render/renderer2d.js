class Renderer2D{
    constructor(){
        this.ctx = VP.getSurface().getContext("2d");
        this.font = "arial";
        this.fontSize = 16;
    }

    getContext(){
        return this.ctx;
    }

    clear(){
        this.ctx.fillStyle = SETTINGS.screenClearColor;
        this.ctx.fillRect(0, 0, VP.getWidth(), VP.getHeight());
    }

    setImageSmoothing(enabled){
        this.ctx.imageSmoothingEnabled = enabled;
    }

    setColor(color){
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
    }

    setOpacity(op){
        if(op > 1)op = 1;
        if(op < 0)op = 0;
        this.ctx.globalAlpha = op;
    }

    setLineWidth(w){
        this.ctx.lineWidth = w;
    }

    setFontSize(size){
        this.fontSize = size;
        this.ctx.font = `${this.fontSize}px ${this.font}`;
    }

    setFont(font){
        this.font = font;
        this.ctx.font = `${this.fontSize}px ${this.font}`;
    }

    setTextAlign(ta){
        this.ctx.textAlign = ta;
    }

    setTextBaseline(bl){
        this.ctx.textBaseline = bl;
    }

    drawLine(x1, y1, x2, y2){
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawRect(x, y, w, h){
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawCircle(x, y, r){
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 6.283, false);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    fillRect(x, y, w, h){
        this.ctx.fillRect(x, y, w, h);
    }

    fillCircle(x, y, r){
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 6.283, false);
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawImage(image, x, y, w, h){
        this.ctx.drawImage(image, x, y, w, h);
    }
    
    drawRotatedImage(image, x, y, w, h, angle){
        this.ctx.save();
        this.ctx.translate(x + w / 2, y + h / 2);
        this.ctx.rotate(angle);
        this.ctx.drawImage(image, -w / 2, -h / 2, w, h);
        this.ctx.restore();
    }

    drawCroppedImage(image, x, y, w, h, dx, dy, dw, dh){
        this.ctx.drawImage(image, x, y, w, h, dx, dy, dw, dh);
    }
    
    drawRotatedCroppedImage(image, x, y, w, h, dx, dy, dw, dh, angle){
        this.ctx.save();
        this.ctx.translate(dx + dw / 2, dy + dh / 2);
        this.ctx.rotate(angle);
        this.ctx.drawImage(image, x, y, w, h, -dw / 2, -dh / 2, dw, dh);
        this.ctx.restore();
    }


    drawRotatedRect(x, y, w, h, angle){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(x + w / 2, y + h / 2);
        this.ctx.rotate(angle);
        this.ctx.rect(-w / 2, -h / 2, w, h);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    fillRotatedRect(x, y, w, h, angle){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(x + w / 2, y + h / 2);
        this.ctx.rotate(angle);
        this.ctx.fillRect(-w / 2, -h / 2, w, h);
        this.ctx.closePath();
        this.ctx.restore();
    }

    drawPolygone(verts){
        this.ctx.beginPath();
        this.ctx.moveTo(verts[0].x, verts[0].y);
        for (let j = 1; j < verts.length; j++) {
            this.ctx.lineTo(verts[j].x, verts[j].y);
        }
        this.ctx.lineTo(verts[0].x, verts[0].y);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    fillPolygone(verts){
        this.ctx.beginPath();
        this.ctx.moveTo(verts[0].x, verts[0].y);
        for (let j = 1; j < verts.length; j++) {
            this.ctx.lineTo(verts[j].x, verts[j].y);
        }
        this.ctx.lineTo(verts[0].x, verts[0].y);
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawText(text, x, y){
        this.ctx.beginPath();
        this.ctx.strokeText(text, x, y);
        this.ctx.closePath();
    }

    fillText(text, x, y){
        this.ctx.beginPath();
        this.ctx.fillText(text, x, y);
        this.ctx.closePath();
    }

    drawEntity(entity){
        if(!CollisionDetection.rectRect(entity.pos.x - entity.size.x / 2, entity.pos.y - entity.size.y / 2, entity.size.x, entity.size.y, VP.getCamera().pos.x, VP.getCamera().pos.y, VP.getWidth(), VP.getHeight()))
            return;
        let g = entity.graphics.getSprite();
        this.drawRotatedCroppedImage(g.image, g.x, g.y, g.w, g.h, Math.floor(VP.screenX(entity.pos.x - entity.size.x / 2)), Math.floor(VP.screenY(entity.pos.y - entity.size.y / 2)), entity.size.x, entity.size.y, entity.angle);
    }
}