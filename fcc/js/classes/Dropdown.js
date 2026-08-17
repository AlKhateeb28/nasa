// The dropdown variable MUST be declared in external classes\files
class Dropdown {
    constructor(instanceVariableName, parentElementId, executeParentMethod, disabled) {
        //super();
		this.options = [];
        this.instanceVariableName = instanceVariableName;
        this.dropdownId = "";
        this.parentElementId = parentElementId;
        this.executeParentMethod = executeParentMethod;
        this.dropdownIdSuffix = Date.now() + "_" + this.random();
		this.disabled = disabled;

        this.initialize();
    }

    getTemplate(templateId) {
        return $("#" + templateId).html();
    }

    random() {
        return Math.floor(Math.random() * 1000) + 1;
    }


    getContent() {
        return `
            <style>
				/* SELECT ELEMENT*/
				.dropdown {
				    position: relative;
				    overflow: hidden;
				    height: 28px;
				    background-color: #f2f2f2;
				    border: 1px solid;
				    border-color: white #f7f7f7 whitesmoke;
				    border-radius: 3px;
				    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
				}
	
				.dropdown:before, .dropdown:after {
				    content: '';
				    position: absolute;
				    z-index: 2;
				    top: 9px;
				    right: 10px;
				    width: 0;
				    height: 0;
				    border: 4px dashed;
				    border-color: #888888 transparent;
				    pointer-events: none;
				}
	
				.dropdown:before {
				    border-bottom-style: solid;
				    border-top: none;
				}
	
				.dropdown:after {
				    margin-top: 7px;
				    border-top-style: solid;
				    border-bottom: none;
				}
	
				.dropdown-select {
				    position: relative;
				    width: 130%;
				    margin: 0;
				    padding: 6px 8px 6px 10px;
				    height: 28px;
				    line-height: 14px;
				    font-size: 1.05em;
				    color: black !important;
				    text-shadow: 0 1px white;
				    border: 0;
				    border-radius: 0;
				    -webkit-appearance: none;
					background-color: whitesmoke;
				}
	
				.dropdown-select:focus {
				    z-index: 3;
				    width: 100%;
				    color: #394349;
				    outline: 2px solid #49aff2;
				    outline: 2px solid -webkit-focus-ring-color;
				    outline-offset: -2px;
				}
	
				.dropdown-select > option {
				    margin: 3px;
				    padding: 6px 8px;
				    text-shadow: none;
				    background: #f2f2f2;
				    border-radius: 3px;
				    cursor: pointer;
				}
	
				.lt-ie9 .dropdown {
				    z-index: 1;
				}
	
				.lt-ie9 .dropdown-select {
				    z-index: -1;
				}
	
				.lt-ie9 .dropdown-select:focus {
				    z-index: 3;
				}
	
				@-moz-document url-prefix() {
				    .dropdown-select {
				        padding-left: 6px;
				    }
				}
	
				.dropdown-select:focus {
				    color: #ccc;
				}
	
				.dropdown-select > option {
				    text-shadow: 0 1px rgba(0, 0, 0, 0.4);
				}
            </style>
            
			<div class="dropdown">
				<select id="dropdown" class="dropdown-select" onchange="${this.instanceVariableName}.onChange()">
				</select>
			</div>
			
			<script type="text/html" id="option_template">
				<option id="option" value="" ></option>
			</script>
			
			<script type="text/html" id="option_group_template">
				<optgroup id="group" label=""></optgroup>
			</script>
        `;
    }

    getDropdownId() {
        return this.dropdownId;
    }

    initialize() {
        $("#" + this.parentElementId).html(this.getContent());

        this.dropdownId = "dropdown_" + this.dropdownIdSuffix;

        $("#dropdown").attr("id", this.dropdownId);
		
		if(this.disabled != undefined && this.disabled) {
			$("#" + this.dropdownId).prop("disabled", true);
		}
		
    }

    addGroup(label) {
        $("#" + this.dropdownId).append(this.getTemplate("option_group_template"));


        const groupId = "group_" + this.dropdownIdSuffix + "_" + this.random();

        $("#group").attr("id", groupId);
        $("#" + groupId).attr("label", label);

        return groupId;
    }

    addOption(destinationId, label, value, select, disabled) {
        if (destinationId === undefined) {
            destinationId = this.dropdownId;
        }

        $("#" + destinationId).append(this.getTemplate("option_template"));

        const optionId = "option_" + this.dropdownIdSuffix + "_" + this.random();

        $("#option").attr("id", optionId);

        const optionElement = $("#" + optionId);
        optionElement.html(label);
        optionElement.val(value);
		
        if (select !== undefined && select != null && select === true) {
            optionElement.prop("selected", true);
        }

		if (disabled !== undefined && disabled != null && disabled === true) {
			optionElement.prop("disabled", true);
		}

		this.options.push(optionId);

        return optionId;
    }

    addAttributeToOption(destinationId, name, value) {
        $("#" + destinationId).attr(name, value);
    }

    getSelectedOptionValues() {
        const selectedOption = $("#" + this.dropdownId).find(":selected");

        const result = {};

        result.caption = selectedOption.html();
        result.value = selectedOption.val();

        selectedOption.each(function() {
            $.each(this.attributes, function() {
                if (this.specified && this.name.indexOf("data_") >= 0) {
                    eval("result." + this.name + " = " + this.value);
                }
            });
        });

        return result;
    }

	selectOption(value) {
		$("#" + this.dropdownId + " option").each(function () {
			$(this).prop("selected", false);

			if ($(this).val() === value) {
				$(this).prop("selected", true);
			}
		});
	}

	enable() {
		$("#" + this.dropdownId + " option").prop("disabled", false);
	}

	disable() {
		$("#" + this.dropdownId + " option").prop("disabled", true);
	}

    setFirstOptionAsSelected() {
        $("#" + this.dropdownId + " option:first").prop("selected", true);
    }
	
	onChange() {
		eval(this.executeParentMethod);
	}

	focus() {
		$("#" + this.dropdownId).focus();
	}
}