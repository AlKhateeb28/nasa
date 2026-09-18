// AJAX
for (let i = 0; i < 10; i++) {
    try {
        await new Promise((resolve, reject) => {
            $.ajax({
                url: "...",
                type: "GET",
                dataType: "json",
                success: resolve,
                error: reject
            });
        }).then(data => {
            console.log("Success:", data);
            return data;
        });
    } catch (error) {
        console.log("Reject:", error);
    }
}
// FETCH
let sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function start() {
    for (let i = 0; i < 10; i++) {
        try {
            const response = await fetch('https://pptrf.miflib.ru/books/1823.ajax', {
                method: 'GET', // POST
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ id: i })
            });

            const data = await response.json();

            console.log("Success:", data);
        } catch (error) {
            console.log("Reject:", error);
        }

        await sleep(1000);
    }
}
//  ASYNC AWAIT + EXCLUDE JQUERY $('.row').each(
async function start(element) {
    const rows = $('.row').toArray();

    for (const row of rows) {
        if (index === 1) {
            return false;
        }

        for (let i = 0; i < 10; i++) {
            try {
                const response = await fetch('https://pptrf.miflib.ru/books/1823.ajax', {
                    method: 'GET', // POST
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                console.log("Success:", data);
            } catch (error) {
                console.log("Reject:", error);
            }

            await sleep(1000);
        }
    }
}