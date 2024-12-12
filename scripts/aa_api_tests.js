try {
    eventDoc = tools.open_doc(7411433821604300143);

    phasesElement = eventDoc.TopElem.AddChild("phases");

    phaseElement = phasesElement.AddChild("phase");

    phaseElement.SetInnerXml(
        "<id>" + UniqueID() + "</id>" +
        "<lector_id>6657445583126083096</lector_id>" +
        "<start_date>" + Date("20.05.2024 10:00" , false) + "</start_date>" +
        "<finish_date>" + Date("20.05.2024 18:00", false) + "</finish_date>");

    eventDoc.Save();

    alert("Saved");
} catch (e) {
    alert("Error: " + e)
}
