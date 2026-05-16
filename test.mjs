async function getError() {
  try {
    const res = await fetch("http://localhost:3000/api/auth/session");
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("BODY START:", text.substring(0, 1000));
    
    // Check if there is an error message inside the HTML
    const errMatch = text.match(/<div data-nextjs-dialog-body="true".*?>(.*?)<\/div>/s);
    if (errMatch) {
      console.log("EXTRACTED ERROR:", errMatch[1].replace(/<[^>]*>?/gm, ' '));
    } else {
      const h1Match = text.match(/<h1>(.*?)<\/h1>/);
      if (h1Match) console.log("H1:", h1Match[1]);
      
      const titleMatch = text.match(/<title>(.*?)<\/title>/);
      if (titleMatch) console.log("TITLE:", titleMatch[1]);
    }
  } catch (err) {
    console.error("FETCH ERR:", err);
  }
}
getError();
