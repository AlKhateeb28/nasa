// The ConfirmPopupWindow variable MUST be declared in external classes\files
class ConfirmPopupWindow {
    constructor(instanceVariableName, parentElementId, message, executeParentMethod) {
        this.id = Math.floor(Math.random() * 1000) + 1;

        this.instanceVariableName = instanceVariableName;
        this.parentElementId = parentElementId;
        this.message = message;
        this.executeParentMethod = executeParentMethod;

        this.initialize();
    }

	getId() {
		return this.id;
	}

    getContent() {
        return `
			<style>
				.popup-modal {
		            position: fixed;
		            z-index: 10000;
		            padding-top: 100px;
		            left: 0;
		            top: 0;
		            width: 100%;
		            height: 100%;
		            overflow: auto;
		            background-color: rgba(0,0,0,0.7);
				}
				
				.popup-modal-content {
					position:  absolute;
					width: 350px;
					height: 150px;
					padding: 10px;
					border-radius: 5px;
					border: 1px solid black;
					top: 35%;
					left: 40%;
					background-color: whitesmoke;
				}
			</style>
			
			<div id="popup_modal_${this.id}" class="popup-modal">
				<div class="popup-modal-content">
			    	<div style="width: 100%;">
						${this.message}
						<div id="popup_buttons_${this.id}" style="margin-top: 35px;">
							<div style="float: left; margin-top: -20px; padding-left: 50px;">
								<button onclick="${this.instanceVariableName}.onYes()">Да</button>
							</div>
							<div style="float: left; margin-top: -20px; margin-left: 20px;">
								<button onclick="${this.instanceVariableName}.onNo()">Нет</button>
							</div>
						</div>
					</div>
			   </div>
			</div>
        `;
    }

    initialize() {
        $("#" + this.parentElementId).html(this.getContent());

    }

    onYes() {
        eval(this.executeParentMethod);

        $("#popup_modal_" + this.id).remove();
    }

    onNo() {
        $("#popup_modal_" + this.id).remove();
    }
}