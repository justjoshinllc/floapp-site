(function () {
  var URL = "https://ewnsrtnmvqhnxsyanask.supabase.co/rest/v1/waitlist";
  var KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bnNydG5tdnFobnhzeWFuYXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MTA0MzAsImV4cCI6MjEwNDk4NjQzMH0.jkSIK6ZO9oT6iNNEtUumfCq61F2h_Y55lomoqpA_fpY";
  var mount = document.getElementById("flo-waitlist");
  if (!mount) return;
  var source = mount.getAttribute("data-source") || location.pathname.replace(/\W+/g, "") || "home";
  mount.innerHTML =
    '<form class="waitlist" novalidate>' +
      '<label class="wl-label" for="wl-email">Get a TestFlight invite when the beta opens</label>' +
      '<div class="wl-row">' +
        '<input id="wl-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@email.com" required>' +
        '<button class="btn btn-primary" type="submit">Join the list</button>' +
      '</div>' +
      '<input name="company" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" class="wl-hp">' +
      '<p class="wl-note" role="status" aria-live="polite">Free while it\'s in beta. No spam, just the invite.</p>' +
    '</form>';
  var form = mount.querySelector("form"), input = form.querySelector("#wl-email");
  var note = form.querySelector(".wl-note"), button = form.querySelector("button"), shown = Date.now();
  function say(t, tone) { note.textContent = t; note.className = "wl-note" + (tone ? " wl-" + tone : ""); }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = input.value.trim();
    if (form.company.value || Date.now() - shown < 1500) { say("You're on the list. Watch your inbox.", "ok"); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { say("That email doesn't look right.", "bad"); input.focus(); return; }
    button.disabled = true; say("Adding you...");
    fetch(URL, { method: "POST", headers: { "apikey": KEY, "Authorization": "Bearer " + KEY,
      "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify({ email: email, source: source }) })
    .then(function (r) {
      if (r.ok || r.status === 409) {
        form.querySelector(".wl-row").style.display = "none";
        form.querySelector(".wl-label").textContent = r.status === 409 ? "You're already on the list." : "You're on the list.";
        say("We'll email " + email + " a TestFlight invite when the beta opens.", "ok");
      } else { button.disabled = false; say("That didn't go through. Try again in a moment.", "bad"); }
    }).catch(function () { button.disabled = false; say("Couldn't reach Flo. Check your connection and try again.", "bad"); });
  });
})();
