class Renderer2D{
    constructor(){
        this.ctx = VP.getSurface().getContext("2d");
        this.buffer = VP.getBuffer().getContext("2d");
        this.font = "arial";
        this.fontSize = 16;
    }

    getContext(){
        return this.buffer;
    }

    render(){
        this.ctx.drawImage(this.buffer.canvas, 0, 0, VP.getWidth(), VP.getHeight());
    }

    clear(){
        this.buffer.fillStyle = SETTINGS.screenClearColor;
        this.buffer.fillRect(0, 0, VP.getWidth(), VP.getHeight());
    }

    setImageSmoothing(enabled){
        this.buffer.imageSmoothingEnabled = enabled;
    }

    setColor(color){
        this.buffer.strokeStyle = color;
        this.buffer.fillStyle = color;
    }

    setOpacity(op){
        if(op > 1)op = 1;
        if(op < 0)op = 0;
        this.buffer.globalAlpha = op;
    }

    setLineWidth(w){
        this.buffer.lineWidth = w;
    }

    setFontSize(size){
        this.fontSize = size;
        this.buffer.font = `${this.fontSize}px ${this.font}`;
    }

    setFont(font){
        this.font = font;
        this.buffer.font = `${this.fontSize}px ${this.font}`;
    }

    setTextAlign(ta){
        this.buffer.textAlign = ta;
    }

    setTextBaseline(bl){
        this.buffer.textBaseline = bl;
    }

    drawLine(x1, y1, x2, y2){
        this.buffer.beginPath();
        this.buffer.moveTo(x1, y1);
        this.buffer.lineTo(x2, y2);
        this.buffer.stroke();
        this.buffer.closePath();
    }

    drawRect(x, y, w, h){
        this.buffer.beginPath();
        this.buffer.rect(x, y, w, h);
        this.buffer.stroke();
        this.buffer.closePath();
    }

    drawCircle(x, y, r){
        this.buffer.beginPath();
        this.buffer.arc(x, y, r, 0, 6.283, false);
        this.buffer.stroke();
        this.buffer.closePath();
    }

    fillRect(x, y, w, h){
        this.buffer.fillRect(x, y, w, h);
    }

    fillCircle(x, y, r){
        this.buffer.beginPath();
        this.buffer.arc(x, y, r, 0, 6.283, false);
        this.buffer.fill();
        this.buffer.closePath();
    }

    drawImage(image, x, y, w, h){
        this.buffer.drawImage(image, x, y, w, h);
    }
    
    drawRotatedImage(image, x, y, w, h, angle){
        this.buffer.save();
        this.buffer.translate(x + w / 2, y + h / 2);
        this.buffer.rotate(angle);
        this.buffer.drawImage(image, -w / 2, -h / 2, w, h);
        this.buffer.restore();
    }

    drawCroppedImage(image, x, y, w, h, dx, dy, dw, dh){
        this.buffer.drawImage(image, x, y, w, h, dx, dy, dw, dh);
    }
    
    drawRotatedCroppedImage(image, x, y, w, h, dx, dy, dw, dh, angle){
        this.buffer.save();
        this.buffer.translate(dx + dw / 2, dy + dh / 2);
        this.buffer.rotate(angle);
        this.buffer.drawImage(image, x, y, w, h, -dw / 2, -dh / 2, dw, dh);
        this.buffer.restore();
    }


    drawRotatedRect(x, y, w, h, angle){
        this.buffer.save();
        this.buffer.beginPath();
        this.buffer.translate(x + w / 2, y + h / 2);
        this.buffer.rotate(angle);
        this.buffer.rect(-w / 2, -h / 2, w, h);
        this.buffer.stroke();
        this.buffer.closePath();
        this.buffer.restore();
    }

    fillRotatedRect(x, y, w, h, angle){
        this.buffer.save();
        this.buffer.beginPath();
        this.buffer.translate(x + w / 2, y + h / 2);
        this.buffer.rotate(angle);
        this.buffer.fillRect(-w / 2, -h / 2, w, h);
        this.buffer.closePath();
        this.buffer.restore();
    }

    drawPolygone(verts){
        this.buffer.beginPath();
        this.buffer.moveTo(verts[0].x, verts[0].y);
        for (let j = 1; j < verts.length; j++) {
            this.buffer.lineTo(verts[j].x, verts[j].y);
        }
        this.buffer.lineTo(verts[0].x, verts[0].y);
        this.buffer.stroke();
        this.buffer.closePath();
    }

    fillPolygone(verts){
        this.buffer.beginPath();
        this.buffer.moveTo(verts[0].x, verts[0].y);
        for (let j = 1; j < verts.length; j++) {
            this.buffer.lineTo(verts[j].x, verts[j].y);
        }
        this.buffer.lineTo(verts[0].x, verts[0].y);
        this.buffer.fill();
        this.buffer.closePath();
    }

    drawText(text, x, y){
        this.buffer.beginPath();
        this.buffer.strokeText(text, x, y);
        this.buffer.closePath();
    }

    fillText(text, x, y){
        this.buffer.beginPath();
        this.buffer.fillText(text, x, y);
        this.buffer.closePath();
    }

    drawEntity(entity){
        let g = entity.graphics.getSprite();
        if(g == undefined)
            return;
        this.drawRotatedCroppedImage(g.image, g.x, g.y, g.w, g.h, Math.floor(VP.screenX(entity.pos.x - entity.size.x / 2)), Math.floor(VP.screenY(entity.pos.y - entity.size.y / 2)), entity.size.x, entity.size.y, entity.angle);
    }
}