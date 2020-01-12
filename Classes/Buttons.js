import {Goo} from "./Goo.js";


export class Button extends Goo {
    constructor(builder) {
        super();
        this.className=builder.name;
        if (builder.pIcon) {
            this.append(builder.pIcon)
        }
        if (builder.pText) {
            this.append(builder.pText);
        }
        if (builder.pSize){
            this.style.width=builder.pSize.width;
            this.style.height=builder.pSize.height;
        }
    }

    static get Builder() {
        class Builder {
            name;
            pText;
            pIcon;
            pSize;

            constructor(name) {
                this.name = name;
            }

            text(text) {
                this.pText = document.createElement('div');
                this.pText.style.padding='0 5px';
                this.pText.style.fontWeight = '700';
                this.pText.textContent = text;
                return this;
            }

            size(width, height) {
                this.pSize = {
                    width: width+'px',
                    height: height+'px'
                };
                return this;
            }

            icon(src, size) {
                let icon = document.createElement('div');
                icon.style.width = size + 'px';
                icon.style.minWidth=size+'px';
                icon.style.height = size + 'px';
                let id = src.split('#');
                icon.innerHTML = `<svg class="${id[1]}" viewBox="0 0 ${size} ${size}">
                        <use href="${src}"></use>
                    </svg>`;
                this.pIcon = icon;
                return this;
            }

            build() {
                return new Button(this);
            }
        }

        return Builder;
    }
}
customElements.define('goo-button',Button);

/*--------------------------------------/ICONS FOR BUTTONS/-----------------------------------------------------------*/
const ICON_ICON=
    "../resources/ico.svg#ico";
const COVER_ICON=
    "../resources/cover.svg#cover";
const DISCUSSION_ICON=
    "../resources/discussion.svg#discussion";



/*-----------------------------------------/BUTTONS FOR PAGE CONTROL PANEL/-------------------------------------------*/
export const ADD_ICON_BUTTON=
    new Button.Builder('add-icon-button')
    .text('Добавить иконку')
    .icon(ICON_ICON, 16)
    .build();

export const ADD_COVER_BUTTON =
    new Button.Builder('add-cover-button')
        .text('Добавить обложку')
        .icon(COVER_ICON, 16)
        .build();

export const ADD_DISCUSSION_BUTTON =
    new Button.Builder('add-discussion-button')
        .text('Обсудить')
        .icon(DISCUSSION_ICON, 16)
        .build();