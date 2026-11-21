// Mock data for the Build Replay prototype: a tiny made-up booking website (6 files, 8 steps).
// Ported from docs/reference/build-replay-prototype.html (same text and code), plus the "source" labels and "risk"
// ("Watch out") texts from docs/01-build-replay.md PART B.
// Not used by any page outside features/build-replay/.

export const REPO_URL = "https://github.com/example/booking-app";

/** Diagram nodes. x/y are the centre of the box in a 560x400 viewBox. kind "pkg" = outside package (dashed). */
export const NODES = {
  website: {
    label: "Website",
    x: 280,
    y: 50,
    step: 1,
    files: ["index.html"],
    what: "The page the customer opens in the browser.",
    why: "Everything starts here. It is the screen the customer sees and the place every other part plugs into.",
  },
  styles: {
    label: "Styles",
    x: 470,
    y: 50,
    step: 2,
    files: ["styles.css"],
    what: "Controls how the page looks.",
    why: "Without it the page would be plain, unformatted text.",
  },
  bcrypt: {
    label: "bcryptjs",
    kind: "pkg",
    x: 80,
    y: 330,
    step: 3,
    files: ["package.json"],
    what: "An outside library (package) for checking passwords safely.",
    why: "Passwords should never be stored or compared as plain text.",
  },
  login: {
    label: "Login",
    x: 150,
    y: 190,
    step: 4,
    files: ["login.js", "index.html"],
    what: "Lets a customer prove who they are.",
    why: "The app needs to know which customer is making a booking.",
  },
  booking: {
    label: "Booking",
    x: 410,
    y: 190,
    step: 5,
    files: ["booking.js", "index.html"],
    what: "Lets a logged-in customer choose a room and a date.",
    why: "Booking rooms is the reason the whole app exists.",
  },
  database: {
    label: "Database",
    x: 290,
    y: 330,
    step: 6,
    files: ["database.js"],
    what: "Stores customers and their bookings.",
    why: "Without it, every booking would vanish when the page is closed.",
  },
};

/** Diagram connections. step = the step that created it; file/code = the line that makes it real. */
export const EDGES = [
  {
    id: "website-styles",
    from: "website",
    to: "styles",
    step: 2,
    why: "index.html displays the page. styles.css controls how that page looks.",
    file: "index.html",
    code: "<link rel=\"stylesheet\" href=\"styles.css\">",
  },
  {
    id: "website-login",
    from: "website",
    to: "login",
    step: 4,
    why: "The page loads login.js so the login form actually does something when submitted.",
    file: "index.html",
    code: "<script src=\"login.js\"></script>",
  },
  {
    id: "login-bcrypt",
    from: "login",
    to: "bcrypt",
    step: 4,
    why: "Login uses bcryptjs to compare the typed password with the stored, scrambled one.",
    file: "login.js",
    code: "const ok = await bcrypt.compare(password, user.passwordHash);",
  },
  {
    id: "website-booking",
    from: "website",
    to: "booking",
    step: 5,
    why: "The page loads booking.js so the booking form works.",
    file: "index.html",
    code: "<script src=\"booking.js\"></script>",
  },
  {
    id: "login-booking",
    from: "login",
    to: "booking",
    step: 5,
    why: "Booking needs to know which customer is logged in, so the booking belongs to that customer.",
    file: "booking.js",
    code: "createBooking(currentUser, room.value, date.value);",
  },
  {
    id: "login-database",
    from: "login",
    to: "database",
    step: 6,
    why: "Login asks the database whether an account with that email exists.",
    file: "login.js",
    code: "const user = await findUser(email);",
  },
  {
    id: "booking-database",
    from: "booking",
    to: "database",
    step: 7,
    why: "booking.js sends the finished booking to database.js so it is stored.",
    file: "booking.js",
    code: "await saveBooking(booking);",
  },
];

/**
 * The 8 building steps. source: "From history" or "Reconstructed". risk: optional "Watch out" text.
 * diffs: per file, lines starting with + (added), - (removed) or a space (unchanged context).
 */
export const STEPS = [
  {
    type: "File",
    title: "The application was started",
    when: "Day 1 · 09:12",
    source: "From history",
    what: "A basic web page was created.",
    why: "This is the starting page of the application. It is what the browser loads first.",
    created: ["index.html"],
    changed: [],
    diffs: {
      "index.html": `+<!DOCTYPE html>
+<html>
+<head>
+  <title>Room Booking</title>
+</head>
+<body>
+  <h1>Book a room</h1>
+</body>
+</html>`,
    },
  },
  {
    type: "File",
    title: "The page was given its appearance",
    when: "Day 1 · 09:40",
    source: "From history",
    what: "A stylesheet was added and the page was told to use it.",
    why: "The page needed its own layout and look.",
    created: ["styles.css"],
    changed: ["index.html"],
    diffs: {
      "styles.css": `+body {
+  font-family: sans-serif;
+  max-width: 480px;
+  margin: 40px auto;
+}
+
+form { display: grid; gap: 8px; }
+button { padding: 10px; }`,
      "index.html": `   <title>Room Booking</title>
+  <link rel="stylesheet" href="styles.css">
 </head>`,
    },
  },
  {
    type: "Command",
    title: "A password library was installed",
    when: "Day 1 · 11:05",
    source: "Reconstructed",
    what: "The builder ran a command that downloaded an outside package called bcryptjs.",
    command: "npm install bcryptjs",
    output: "added 1 package in 2s",
    why: "Login is coming next, and passwords must be checked safely, never as plain text.",
    created: ["package.json"],
    changed: [],
    diffs: {
      "package.json": `+{
+  "name": "booking-app",
+  "dependencies": {
+    "bcryptjs": "^2.4.3"
+  }
+}`,
    },
  },
  {
    type: "Function",
    title: "Customers can now log in",
    when: "Day 1 · 11:30",
    source: "From history",
    what: "login.js was created with a login() function, and a login form was added to the page.",
    why: "The application needs to know which customer is making a booking.",
    created: ["login.js"],
    changed: ["index.html"],
    map: `login(email, password)
│
├── looks up the customer by email
├── checks the password with bcryptjs
└── remembers them as currentUser`,
    diffs: {
      "login.js": `+const USERS = [
+  { id: 1, email: "amina@example.com", passwordHash: "$2a$10$..." }
+];
+let currentUser = null;
+
+async function login(email, password) {
+  const user = USERS.find(u => u.email === email);
+  if (!user) return showError("No account with that email");
+  const ok = await bcrypt.compare(password, user.passwordHash);
+  if (!ok) return showError("Wrong password");
+  currentUser = user;
+  showBookingForm();
+}`,
      "index.html": `   <h1>Book a room</h1>
+  <form id="login-form">
+    <input id="email" placeholder="Email">
+    <input id="password" type="password">
+    <button>Log in</button>
+  </form>
+  <script src="login.js"></script>
 </body>`,
    },
    risk: "No limit on login attempts — someone could keep guessing passwords.",
  },
  {
    type: "Function",
    title: "Customers can now choose a room",
    when: "Day 2 · 10:02",
    source: "From history",
    what: "booking.js was created with a createBooking() function, and a booking form was added to the page.",
    why: "Allowing customers to book rooms is the original purpose of the application.",
    created: ["booking.js"],
    changed: ["index.html"],
    map: `createBooking(user, room, date)
│
├── uses the logged-in customer  (from Login)
├── receives the room
├── receives the date
└── not saved anywhere yet`,
    diffs: {
      "booking.js": `+async function createBooking(user, room, date) {
+  if (!user) return showError("Please log in first");
+  const booking = { userId: user.id, room, date };
+  showMessage("Booked " + room + " for " + date);
+}
+
+bookingForm.addEventListener("submit", e => {
+  e.preventDefault();
+  createBooking(currentUser, room.value, date.value);
+});`,
      "index.html": `   </form>
+  <form id="booking-form" hidden>
+    <select id="room">
+      <option>Room 101</option>
+      <option>Room 102</option>
+    </select>
+    <input id="date" type="date">
+    <button>Book</button>
+  </form>
   <script src="login.js"></script>
+  <script src="booking.js"></script>`,
    },
    risk: "Nothing stops two customers booking the same room on the same date.",
  },
  {
    type: "File",
    title: "A database was added",
    when: "Day 2 · 14:20",
    source: "Reconstructed",
    what: "database.js was created. Login was changed to look up customers there instead of a hard-coded list.",
    why: "Customers were written directly inside login.js. They needed a proper home, and bookings need one too.",
    created: ["database.js"],
    changed: ["login.js", "index.html"],
    diffs: {
      "database.js": `+const db = {
+  users: [{ id: 1, email: "amina@example.com", passwordHash: "$2a$10$..." }],
+  bookings: []
+};
+
+async function findUser(email) {
+  return db.users.find(u => u.email === email);
+}
+
+async function saveBooking(booking) {
+  db.bookings.push({ id: db.bookings.length + 1, ...booking });
+}`,
      "login.js": `-const USERS = [
-  { id: 1, email: "amina@example.com", passwordHash: "$2a$10$..." }
-];
 let currentUser = null;

 async function login(email, password) {
-  const user = USERS.find(u => u.email === email);
+  const user = await findUser(email);`,
      "index.html": `+  <script src="database.js"></script>
   <script src="login.js"></script>`,
    },
    risk: "Data is kept only in memory — every customer and booking disappears when the app restarts.",
  },
  {
    type: "Connection",
    title: "Bookings are now saved",
    when: "Day 2 · 14:45",
    source: "Reconstructed",
    what: "One line inside createBooking() connected Booking to the Database.",
    why: "Until now a booking only showed a message and was then lost. It needs to be stored after the customer submits it.",
    created: [],
    changed: ["booking.js"],
    map: `createBooking(user, room, date)
│
├── uses the logged-in customer
├── receives room and date
└── sends the booking to saveBooking()  →  database.js`,
    diffs: {
      "booking.js": `   const booking = { userId: user.id, room, date };
+  await saveBooking(booking);
   showMessage("Booked " + room + " for " + date);`,
    },
  },
  {
    type: "Fix",
    title: "Bookings in the past were blocked",
    when: "Day 3 · 09:15",
    source: "From history",
    what: "A check was added so a room cannot be booked for a date that has already passed.",
    why: "While testing, a booking for yesterday was accepted and saved. That should never happen.",
    created: [],
    changed: ["booking.js"],
    diffs: {
      "booking.js": `   if (!user) return showError("Please log in first");
+  if (new Date(date) < new Date()) {
+    return showError("Choose a date in the future");
+  }
   const booking = { userId: user.id, room, date };`,
    },
  },
].map((s, i) => ({ ...s, n: i + 1 }));

/** The final code of every file. part = the NODES id the file belongs to. */
export const FILES = {
  "index.html": {
    part: "website",
    purpose: "The starting page. Holds the login form and the booking form, and loads the scripts.",
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Room Booking</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Book a room</h1>
  <form id="login-form">
    <input id="email" placeholder="Email">
    <input id="password" type="password">
    <button>Log in</button>
  </form>
  <form id="booking-form" hidden>
    <select id="room">
      <option>Room 101</option>
      <option>Room 102</option>
    </select>
    <input id="date" type="date">
    <button>Book</button>
  </form>
  <script src="database.js"></script>
  <script src="login.js"></script>
  <script src="booking.js"></script>
</body>
</html>`,
  },
  "styles.css": {
    part: "styles",
    purpose: "How the page looks: width, spacing and buttons.",
    code: `body {
  font-family: sans-serif;
  max-width: 480px;
  margin: 40px auto;
}

form { display: grid; gap: 8px; }
button { padding: 10px; }`,
  },
  "package.json": {
    part: "bcrypt",
    purpose: "Lists the outside libraries the app depends on. Here, only bcryptjs.",
    code: `{
  "name": "booking-app",
  "dependencies": {
    "bcryptjs": "^2.4.3"
  }
}`,
  },
  "login.js": {
    part: "login",
    purpose: "Checks the customer's email and password and remembers who is logged in.",
    code: `let currentUser = null;

async function login(email, password) {
  const user = await findUser(email);
  if (!user) return showError("No account with that email");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return showError("Wrong password");
  currentUser = user;
  showBookingForm();
}`,
  },
  "booking.js": {
    part: "booking",
    purpose: "Creates a booking for the logged-in customer and sends it to be saved.",
    code: `async function createBooking(user, room, date) {
  if (!user) return showError("Please log in first");
  if (new Date(date) < new Date()) {
    return showError("Choose a date in the future");
  }
  const booking = { userId: user.id, room, date };
  await saveBooking(booking);
  showMessage("Booked " + room + " for " + date);
}

bookingForm.addEventListener("submit", e => {
  e.preventDefault();
  createBooking(currentUser, room.value, date.value);
});`,
  },
  "database.js": {
    part: "database",
    purpose: "Keeps customers and bookings, and offers findUser() and saveBooking().",
    code: `const db = {
  users: [{ id: 1, email: "amina@example.com", passwordHash: "$2a$10$..." }],
  bookings: []
};

async function findUser(email) {
  return db.users.find(u => u.email === email);
}

async function saveBooking(booking) {
  db.bookings.push({ id: db.bookings.length + 1, ...booking });
}`,
  },
};

// Derived once, the same way the reference does it.
for (const s of STEPS) {
  s.newNodes = Object.keys(NODES).filter((k) => NODES[k].step === s.n);
  s.newEdges = EDGES.filter((e) => e.step === s.n).map((e) => e.id);
}
for (const f of Object.keys(FILES)) {
  FILES[f].created = STEPS.find((s) => s.created.includes(f)).n;
  FILES[f].changedIn = STEPS.filter((s) => s.changed.includes(f)).map((s) => s.n);
}

export const edgeById = (id) => EDGES.find((e) => e.id === id);
export const stepTitle = (n) => STEPS[n - 1].title;
