var modalWnd = null;

function initModalWindow(parentElementId) {
    if(modalWnd === null) {
        modalWnd = new ModalWindow(parentElementId);
    }

    return modalWnd;
}

class ModalWindow extends Object {
    constructor(parentElementId) {
        super();

        this.parentElementId = parentElementId;

        this.initialize();
    }

    getId() {
        return this.id;
    }

    getContent() {
        return `
            <style>
            .modal-float-left {
                float: left;
            }
            
            .modal-float-right {
                float: right;
            }
            .modal-card {
                border-radius: 10px;
                box-shadow: 0 2px 6px 0 rgb(218 218 253 / 65%), 0 2px 6px 0 rgb(206 206 238 / 54%);
                border-width: 4px !important;
                background-color: white;
                margin-top: 20px;
                margin-left: 10px;
            }
            
            .modal {
                display: none;
                position: fixed;
                z-index: 100;
                padding-top: 100px;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.7);
            }
            
            .modal-content {
                background-color: #fefefe;
                margin: auto;
                padding: 20px;
                border: 1px solid #888;
                width: 40%;
            }
            
            .modal-close-btn {
                color: #aaaaaa;
                float: right;
                margin-top: -15px;
                font-size: 28px;
                font-weight: bold;
            }
            
            .modal-close-btn:hover,
            .modal-close-btn:focus {
                color: #000;
                text-decoration: none;
                cursor: pointer;
            }
            </style>
            
            <div id="modal" class="modal">
                <div id="modal_content" class="modal-content">
                    <div id="modal_child_content" class="modal-float-left"></div>
                    <div id="btn_modal_close" class="modal-float-right modal-close-btn">&times;</div>
                </div>
            </div>
        `;
    }

    initialize() {
        $("#" + this.parentElementId).html(this.getContent());

        $("#btn_modal_close").on( "click", function() {
            ModalWindow.close();
        });
    }

    static show(content, width, height, marginTop) {
        const contentElement = $("#modal_content");

        if(width === undefined) {
            width = "30%";
        }

        if(width.indexOf("%") < 0) {
            width += "%";
        }
        contentElement.css("width", width);

        if(height === undefined) {
            height = "200px";
        }
        contentElement.css("height", height);

        if(marginTop === undefined) {
            marginTop = "200px";
        }
        contentElement.css("margin-top", marginTop);

        $("#modal_child_content").append(content);

        $("#modal").css("display", "block");
    }

    static close() {
        $("#modal_child_content").empty();

        $("#modal").css("display", "none");
    }
}