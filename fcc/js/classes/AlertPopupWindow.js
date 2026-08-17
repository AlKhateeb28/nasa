// The AlertPopupWindow variable MUST be declared in external classes\files
class AlertPopupWindow {
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
				.alert-popup-modal {
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
				
				.alert-popup-modal-content {
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
			
			<div id="alert_popup_modal_${this.id}" class="alert-popup-modal">
				<div class="alert-popup-modal-content">
			    	<div style="width: 100%; height: 100px; max-height: 100px;">
						${this.message}
					</div>
					<div id="alert_popup_buttons_${this.id}">
						<div>
							<button id="alert_popup_btn" style="margin-left: 12rem;" onclick="${this.instanceVariableName}.onOk()">Ok</button>
						</div>
					</div>					
			   </div>
			</div>
        `;
    }

    initialize() {
        $("#" + this.parentElementId).html(this.getContent());

    }

    onOk() {
        $("#alert_popup_modal_" + this.id).remove();
    }
}