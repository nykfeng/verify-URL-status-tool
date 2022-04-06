const submitEL = document.querySelector('.row-submit');

submitEL.addEventListener("click", function() {
    sendURL('https://www.mediaradar.com');
})


// Post request to send url to server and check
async function sendURL(urlBody) {
    const url = "/url";
    const data = urlBody;
    await fetch(url, {
        method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded  ",
      }),
      body: data,
    })
}


// async function register(newUser) {
//     const url = "/register";
//     const data = new URLSearchParams();
//     for (const [key, value] of Object.entries(newUser)) {
//       data.append(key, value);
//     }
//     await fetch(url, {
//       method: "POST",
//       headers: new Headers({
//         "Content-Type": "application/x-www-form-urlencoded  ",
//       }),
//       body: data,
//     });
//   }