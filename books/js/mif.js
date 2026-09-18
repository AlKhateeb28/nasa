let sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const books = [];
let isStarted = false;

let willBeDeleted = 0;
let willNotBeDeleted = 0;

const greenSVG = `
    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
        d="M2.12264 12.816C2.41018 13.8186 3.18295 14.5914 4.72848 16.1369L6.55812 17.9665C9.24711 20.6555 10.5916 22 12.2623 22C13.933 22 15.2775 20.6555 17.9665 17.9665C20.6555 15.2775 22 13.933 22 12.2623C22 10.5916 20.6555 9.24711 17.9665 6.55812L16.1369 4.72848C14.5914 3.18295 13.8186 2.41018 12.816 2.12264C11.8134 1.83509 10.7485 2.08083 8.61875 2.57231L7.39057 2.85574C5.5988 3.26922 4.70292 3.47597 4.08944 4.08944C3.47597 4.70292 3.26922 5.59881 2.85574 7.39057L2.57231 8.61875C2.08083 10.7485 1.83509 11.8134 2.12264 12.816ZM10.1234 7.27098C10.911 8.05856 10.911 9.33549 10.1234 10.1231C9.33581 10.9107 8.05888 10.9107 7.27129 10.1231C6.48371 9.33549 6.48371 8.05856 7.27129 7.27098C8.05888 6.48339 9.33581 6.48339 10.1234 7.27098ZM19.0511 12.0511L12.0721 19.0303C11.7792 19.3232 11.3043 19.3232 11.0114 19.0303C10.7185 18.7375 10.7185 18.2626 11.0114 17.9697L17.9904 10.9904C18.2833 10.6975 18.7582 10.6975 19.0511 10.9904C19.344 11.2833 19.344 11.7582 19.0511 12.0511Z"
        fill="#03ca03" />
    </svg>
`;

const redSVG = `
    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
        d="M2.12264 12.816C2.41018 13.8186 3.18295 14.5914 4.72848 16.1369L6.55812 17.9665C9.24711 20.6555 10.5916 22 12.2623 22C13.933 22 15.2775 20.6555 17.9665 17.9665C20.6555 15.2775 22 13.933 22 12.2623C22 10.5916 20.6555 9.24711 17.9665 6.55812L16.1369 4.72848C14.5914 3.18295 13.8186 2.41018 12.816 2.12264C11.8134 1.83509 10.7485 2.08083 8.61875 2.57231L7.39057 2.85574C5.5988 3.26922 4.70292 3.47597 4.08944 4.08944C3.47597 4.70292 3.26922 5.59881 2.85574 7.39057L2.57231 8.61875C2.08083 10.7485 1.83509 11.8134 2.12264 12.816ZM10.1234 7.27098C10.911 8.05856 10.911 9.33549 10.1234 10.1231C9.33581 10.9107 8.05888 10.9107 7.27129 10.1231C6.48371 9.33549 6.48371 8.05856 7.27129 7.27098C8.05888 6.48339 9.33581 6.48339 10.1234 7.27098ZM19.0511 12.0511L12.0721 19.0303C11.7792 19.3232 11.3043 19.3232 11.0114 19.0303C10.7185 18.7375 10.7185 18.2626 11.0114 17.9697L17.9904 10.9904C18.2833 10.6975 18.7582 10.6975 19.0511 10.9904C19.344 11.2833 19.344 11.7582 19.0511 12.0511Z"
        fill="#ff0000" />
    </svg>
`;

function getTemplate(templateId) {
    return $("#" + templateId).html();
}

function initialize() {
    
}

function beforeReload() {
    $("#wait_caption").html("Загружаем...")
    $("#wait").css("display", "block");
}

function afterReload() {
    $("#wait").css("display", "none");
}


async function start(element) {
    clickedElement = element;

    if (clickedElement !== undefined) {
        $(clickedElement).addClass("btn-flash");

        sleep(1000).then((r) => {
            $(clickedElement).removeClass("btn-flash")
        });
    }

    isStarted = true;

    const rows = $('.row').toArray();

    let step = 0;

    let deletedBooks = 0;
    let notDeletedBooks = 0;

    for (const row of rows) {
        if (!isStarted) {
            return false;
        }

        if (books[step].delete === 1) {
            return false;
        }

        await $("progress_" + step).css("display", "block");

        try {
            const response = await fetch("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7328198076491720999&id=" + books[step].id, {
                method: 'GET', // POST
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if(data.deleted) {
                await $("#deleted_" + step).html("&#9745;");
                await $("#deleted_" + step).css("color", "#008000");

                deletedBooks++;
                await $("#d_box").html(deletedBooks.toLocaleString());
            } else {
                await $("#deleted_" + step).html("&#9746;");

                notDeletedBooks++;
                await $("#nd_box").html(notDeletedBooks.toLocaleString());
            }
        } catch (error) {
            $("#deleted_" + step).html(notDeletedSVG);

            notDeletedBooks++;
            await $("#nd_box").html(notDeletedBooks.toLocaleString());
        }

        step++;

        await $("progress_" + step).css("display", "none");

        if(step % 17 == 0) {
            try {
                await $("#row_" + (step + 2)).get(0).previousElementSibling.previousElementSibling.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } catch(e) {}
        }

        await sleep(10);
    }    
}

function stop(element) {
    clickedElement = element;

    if (clickedElement !== undefined) {
        $(clickedElement).addClass("btn-flash");

        sleep(1000).then((r) => {
            $(clickedElement).removeClass("btn-flash")
        });
    }

    if (!isStarted) {
        return;
    }

    isStarted = false;

    afterReload();
}

function onError(error, id) {
    console.log("ERROR: " + error + ". See " + id + " log file/");
}

function showBook(element) {
    window.open("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/view_doc.html?mode=library_material_shelves&object_id=" + $(element).attr("data-id"), "_blank");
}

function addBooksForDelete(element) {    
    clickedElement = element;

    if (clickedElement !== undefined) {
        $(clickedElement).addClass("btn-flash");

        sleep(1000).then((r) => {
            $(clickedElement).removeClass("btn-flash")
        });
    }
    
    pickSingleFile().then(readFile);
}

async function pickSingleFile() {
    const [fileHandle] = await window.showOpenFilePicker();

    return await fileHandle.getFile();
}

async function readFile(file) {
    beforeReload();

    readXlsxFile(file).then(function (rows) {
        rows.forEach((row, index) => {
            if (index > 0) {
                const book = {};

                book.author = row[0];
                book.name = row[1];
                book.bookId = row[2];
                book.id = row[3];
                book.delete = parseInt(row[4]);

                if(book.delete === 0) {
                    willBeDeleted++;                    
                } else {
                    willNotBeDeleted++;
                }

                books.push(book);
            }
        });

        showBooks();

        $("#wd_box").html(willBeDeleted.toLocaleString());
        $("#wnd_box").html(willNotBeDeleted.toLocaleString());

        afterReload();
    })
}

function showBooks() {
    let index = 0;

    const styledTableBodyElement = $("#style_table_body");

    for (const book of books) {
        styledTableBodyElement.append(getTemplate("row_template"));

        $("#row").attr("id", "row_" + index);
        $("#row_" + index).attr("data-id", book.id);
        $("#row_" + index).attr("data-mif-id", book.bookId);

        $("#sn").attr("id", "sn_" + index);
        $("#sn_" + index).html(index + 1);

        $("#author").attr("id", "author_" + index);
        $("#author_" + index).html(book.author);

        $("#name").attr("id", "name_" + index);
        $("#name_" + index).html(book.name);

        $("#progress").attr("id", "progress_" + index);

        $("#will_delete").attr("id", "will_delete_" + index);
        
        if(parseInt(book.delete) === 0) {
            $("#will_delete_" + index).attr("title", "Will delete");
            $("#will_delete_" + index).html(redSVG);
        } else {
            $("#will_delete_" + index).attr("title", "Will remain undelete");            
            $("#will_delete_" + index).html(greenSVG);
        }

        $("#deleted").attr("id", "deleted_" + index);

        index++;
    }
}