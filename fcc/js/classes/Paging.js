// The paging variable MUST be declared in external classes\files
class Paging {
    constructor(instanceVariableName, parentElementId, executeParentMethod) {
        //super();

		this.instanceVariableName = instanceVariableName;
        this.parentElementId = parentElementId;
        this.executeParentMethod = executeParentMethod;
		this.currentPage = 1;
		this.maxPage = "";
		this.isPageNumberValid = true;
        this.initialize();
    }

    getContent() {
        return `
            <style>
				.page-button {
					cursor: pointer;
				    border-radius: 2rem !important;
				    padding-left: .5rem !important;
				    padding-right: .5rem !important;
				    border: 1px solid mintcream !important;
					background-image: linear-gradient(-20deg, #02486e, #02486e, #02486e 100%) !important;
					text-align: center;
					width: 20px;
					margin-top: 2px;
				}
            </style>
            
			<div style="float: right; margin-right: 30px;">
				<div class="page-button" style="float: left;" title="В начало" onclick="${this.instanceVariableName}.goToPage(0)">
					<div  style="float: left; padding-left: 4px;">
						<svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10px" height="10px" viewBox="0 0 970.477 970.477"
							 xml:space="preserve">
						<g>
							<path d="M842.849,970.477c26.601,0,53.5-8.8,75.7-27c51.4-41.9,59.101-117.4,17.2-168.8l-234.6-288l237-290.9
								c41.899-51.399,34.1-127-17.2-168.8c-51.4-41.899-127-34.1-168.8,17.2l-298.8,366.7c-36,44.1-36,107.399,0,151.6l296.4,363.9
								C773.45,955.377,808.049,970.477,842.849,970.477z"/>
							<path d="M328.85,926.276c23.7,29.101,58.301,44.2,93.101,44.2c26.6,0,53.5-8.8,75.7-27c51.399-41.9,59.1-117.4,17.199-168.8
								l-234.599-288l237-290.9c41.9-51.399,34.1-127-17.2-168.8c-51.399-41.899-127-34.1-168.799,17.2l-298.9,366.7
								c-36,44.1-36,107.5,0,151.6L328.85,926.276z"/>
						</g>
						</svg>
					</div>
				</div>
				<div class="page-button" style="float: left; margin-right: 5px;"  title="Предыдущая"  onclick="${this.instanceVariableName}.goToPage(1)">
					<div style="margin-left: -2px;">
						<svg width="10px" height="10px" viewBox="-4 0 20 20" xmlns="http://www.w3.org/2000/svg">
						  <g id="Lager_13" data-name="Lager 13" transform="translate(-10 -6)">
						    <path id="Path_15" data-name="Path 15" d="M15.909,16.681a1.97,1.97,0,0,1-.278-.732,1,1,0,0,1,.278-.679l5.517-5.732a2.116,2.116,0,0,0,.01-2.887l-.028-.03a1.958,1.958,0,0,0-2.854-.008l-8.267,8.613a1.077,1.077,0,0,0-.287.723,2.115,2.115,0,0,0,.287.775l8.267,8.665a1.959,1.959,0,0,0,2.854-.012l.028-.036a2.134,2.134,0,0,0-.01-2.9Z" fill="#ffffff"/>
						  </g>
						</svg>
					</div>
				</div>
				<div style="float: left;">
					<input id="page_number" placeholder="Введите номер страницы..." pattern="[0-9]*" inputmode="numeric" 
						type="text" name="text" class="input" style="width: 50px; text-align: center;" onchange="${this.instanceVariableName}.onChagePageNumber()"/>
				</div>
				<div id="last_page" class="page-button" style="float: left; margin-left: 5px; color: #ffffff; width: 50px;">
				</div>
				<div class="page-button" style="float: left; margin-left: 5px;" title="Следующая"  onclick="${this.instanceVariableName}.goToPage(2)">
					<div>
						<svg fill="#ffffff" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
							 viewBox="0 0 491.1 491.1" xml:space="preserve">
						<g>
							<path d="M379.25,282.85l-192.8,192.8c-20.6,20.6-54,20.6-74.6,0s-20.6-54,0-74.6l155.5-155.5l-155.5-155.5
								c-20.6-20.6-20.6-54,0-74.6s54-20.6,74.6,0l192.8,192.8C399.85,228.85,399.85,262.25,379.25,282.85z"/>
						</g>
						</svg>
					</div>
				</div>
				<div class="page-button" style="float: left;"  title="В конец" onclick="${this.instanceVariableName}.goToPage(3)">
					<div style="float: left; margin-left: 6px;">
						<svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10px" height="10px" viewBox="0 0 970.627 970.627"
							 xml:space="preserve">
						<g>
							<path d="M49.777,943.627c22.3,18.101,49.1,27,75.7,27c34.8,0,69.4-15.1,93.1-44.199l298.7-366.7c36-44.101,36-107.401,0-151.601
								l-296.4-363.899c-41.9-51.4-117.4-59.1-168.8-17.3c-51.4,41.9-59.1,117.5-17.3,168.9l234.7,288.101l-237,290.9
								C-9.323,826.127-1.623,901.728,49.777,943.627z"/>
							<path d="M641.777,44.227c-41.801-51.4-117.4-59.1-168.801-17.3c-51.399,41.9-59.1,117.4-17.199,168.8l234.6,288.1l-237,290.901
								c-41.9,51.399-34.1,127,17.2,168.8c22.3,18.1,49.1,27,75.7,27c34.8,0,69.399-15.1,93.1-44.2l298.7-366.7c36-44.1,36-107.4,0-151.6
								L641.777,44.227z"/>
						</g>
						</svg>
					</div>
				</div>
			</div>
        `;
    }

    initialize() {
        $("#" + this.parentElementId).html(this.getContent());
    }

	setMaxPageValue(maxPage) {
		this.maxPage = maxPage;
		
		$("#last_page").html(maxPage);
	}
	
	onChagePageNumber() {
		const pageNumberElement = $("#page_number");
		
		const pageNumber = parseInt(pageNumberElement.val());
		
		if(Number.isNaN(pageNumber)) {
			this.isPageNumberValid = false;
			
			pageNumberElement.css("background-color", "lightcoral");
		} else {
			this.isPageNumberValid = true;
			
			pageNumberElement.css("background-color", "white");
			
			if(pageNumber > this.maxPage) {
				this.isPageNumberValid = false;
				
				$("#last_page").css("color", "lightcoral");
			} else {
				this.isPageNumberValid = true;
				
				$("#last_page").css("color", "white");
			}
		}
		
		if(this.isPageNumberValid) {
			this.currentPage = pageNumber;
			
			eval(this.executeParentMethod + "()");
		}
	}
	
    goToPage(direction) {	
		if(!this.isPageNumberValid) {
			return;
		}	
		
        if (direction == 0) {
            // TO FIRST PAGE
            if (this.currentPage != 1) {
                this.currentPage = 1;

                $("#page_number").val(this.currentPage);

                eval(this.executeParentMethod + "()")
            }
        } else if (direction == 1) {
            // TO PREVIOUS PAGE
            if (this.currentPage != 1) {
                this.currentPage--;

                $("#page_number").val(this.currentPage);

                eval(this.executeParentMethod + "()")
            }
        } else if (direction == 2) {
            // TO NEXT PAGE		
            if (this.currentPage != this.maxPage) {
                this.currentPage++;

                $("#page_number").val(this.currentPage);

                eval(this.executeParentMethod + "()")
            }
        } else {
            // TO LAST PAGE
            if (this.currentPage != this.maxPage) {
                this.currentPage = this.maxPage;

                $("#page_number").val(this.currentPage);

                eval(this.executeParentMethod)
            }
        }
    }
}