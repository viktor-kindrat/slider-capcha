let checkboxElement = document.querySelector('.capchaRequier__checkbox')

class Capcha {
    constructor(capchaElement, checkbox) {
        this.positionsOfThePiece = {}
        this.positionOfTheThumb = 0;

        this.canvas = document.querySelector('#' + capchaElement + ' #canvas');
        this.ctx = this.canvas.getContext('2d');
        this.changer = document.querySelector('#' + capchaElement + ' #changer');
        this.block = document.querySelector('#' + capchaElement + ' #block');
        this.capchaBlock = document.getElementById(capchaElement);
        this.checkboxElement = document.querySelector(checkbox)
    }

    create(thisBlock) {
        let ctx = this.ctx
        fetch(`https://source.unsplash.com/1800x1800/?random`)
            .then((response) => {
                let imageElement = new Image(500, 500);
                imageElement.src = response.url;
                imageElement.onload = function () {
                    ctx.drawImage(imageElement, 0, 0, 500, 500);
                    thisBlock.capchaBlock.setAttribute('data-hidden', 'false')

                    thisBlock.positionsOfThePiece.x = Math.round(Math.random() * 500);
                    thisBlock.positionsOfThePiece.y = Math.round(Math.random() * 500);

                    thisBlock.block.style.background = `url("${response.url}") no-repeat no-repeat`
                    thisBlock.block.style.backgroundPosition = `calc(${thisBlock.positionsOfThePiece.x / 5}% - 25px) calc(${thisBlock.positionsOfThePiece.y / 5}% - 25px)`
                    thisBlock.block.style.backgroundSize = `515px 515px`;
                    thisBlock.block.style.top = thisBlock.positionsOfThePiece.y / 5 + '%';

                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.fillRect(thisBlock.positionsOfThePiece.x, thisBlock.positionsOfThePiece.y, 50, 50);
                }
            })

        thisBlock.changer.addEventListener('input', function () {
            thisBlock.block.style.left = `${thisBlock.changer.value}%`;
        })

        thisBlock.changer.addEventListener('change', function () {
            let val = Math.round(thisBlock.changer.value * 5);
            if (val === thisBlock.positionsOfThePiece.x || (val + 5 >= thisBlock.positionsOfThePiece.x && val - 5 <= thisBlock.positionsOfThePiece.x)) {
                alert(`Capcha resolved!\n\nAcuracy ${100 - Math.abs((thisBlock.positionsOfThePiece.x - val) / 5)}%`)
                thisBlock.clear(thisBlock);
                thisBlock.checkboxElement.dataset.status = 'ready'
            }
        })
        return true;
    }

    clear(thisBlock) {
        thisBlock.ctx.clearRect(0, 0, 500, 500);
        thisBlock.block.style = '';
        thisBlock.capchaBlock.setAttribute('data-hidden', 'true');
    }
}

checkboxElement.addEventListener('click', function () {
    this.dataset.status = 'loading';
    let newCapcha = new Capcha('capcha', '.capchaRequier__checkbox');
    newCapcha.create(newCapcha);
})