## Summary

**3D Hardware Lab lets anyone learn computer hardware by exploring, building and fixing a PC in 3D — in the browser, even on a phone.**
Rotate a computer, tap any part to learn what it does, explode it to see how everything fits, assemble it step by step, and practise diagnosing real faults.

> **Promise:** *"Open a computer without a screwdriver."*

## The problem

Learning computer hardware needs hands-on practice — but:
- Many schools and colleges have **few or no spare computers** that students may open.
- Real parts are **expensive and fragile**; mistakes (static, wrong slot, bent pins) break them.
- Textbooks show **flat diagrams**; students struggle to picture how parts connect in 3D.
- Teachers lack **interactive material** for ICT and computer maintenance classes.
- Beginner technicians learn by trial and error on customers' machines.

## The idea

A virtual computer lab in the browser:
1. **Explore** a realistic 3D PC.
2. **Explode** it to see every part and how they fit.
3. **Build** it step by step, learning *why* each step matters.
4. **Fix** simulated faults like a technician.
5. **Quiz** yourself; teachers see progress.

It follows the same principle as Build Replay: **understanding grows best when you watch something being built, step by step, with the why.**

## How it works

### Explore
Rotate, zoom and pan a 3D desktop PC. Tap any part — CPU, RAM, motherboard, power supply (PSU), storage, graphics card, cooler, case fans — and see:
- **What it is**
- **What it does** (in plain words, with an everyday comparison)
- **What it connects to**
- **Common faults & signs**

### Explode
One button separates all parts in the air, labelled, then brings them back together. Ideal for showing a class how a PC is structured.

### Build mode
Assemble a PC from an empty case:
1. Install the power supply — *why: everything needs power.*
2. Place the CPU in the socket — *why: the brain of the computer; align the triangle, no force.*
3. Apply thermal paste and mount the cooler — *why: the CPU gets hot.*
4. Insert RAM — *why: fast working memory for the CPU.*
5. Install storage — *why: keeps your files and the operating system.*
6. Insert the graphics card — *why: draws what you see on the screen.*
7. Connect power cables — *why: each part needs its own power.*
8. Close the case and power on.

Each step highlights where the part goes; the student taps/drags it into place; wrong placement gives a friendly explanation.

### Fix mode (diagnosis practice)
Scenario-based fault finding:
- *"The PC turns on, beeps, but shows nothing on screen."* → inspect parts, read clues → likely RAM not seated.
- *"The PC shuts down after 10 minutes of gaming."* → overheating: dusty cooler / dried thermal paste.
- *"Clicking sound, very slow, files missing."* → failing hard drive.
- *"No power at all, no fans."* → power supply or power cable.

The student inspects parts in 3D (dust, loose cable, swollen capacitor shown visually), picks a diagnosis, and gets feedback with the reasoning.

### Quiz
"Tap the part that stores data permanently." Scores per topic; weak areas shown.

## Who it is for

| User | Use |
|------|-----|
| Secondary-school ICT students | Understand hardware visually |
| College & vocational (VETA-type) trainees | Practise assembly and diagnosis safely |
| Teachers | Project on a screen; run quizzes; track the class |
| Beginner repair technicians | Practise fault-finding before touching real machines |
| Curious learners | Learn how their own computer works |

## Why 3D in the browser

- No installation; works on school computers and phones.
- Can work **offline** after first load — good for weak internet.
- Cheap to scale: one link for a whole school.

## How it would be built (real version)

| Part | Approach |
|------|---------|
| 3D rendering | Three.js via React Three Fiber in a Next.js web app |
| Models | Start with simplified, clean models (one desktop, one laptop); add detailed models later (free/licensed models or commissioned) |
| Lessons | Data-driven: parts, steps, scenarios and quizzes stored as content files — easy to add more |
| Languages | English and Swahili |
| Teacher tools | Class codes, progress dashboard (later phase) |
| Offline | Progressive web app caching |

## Doability

**Doable — yes, very.** 3D in the browser is mature and runs on ordinary phones.

Hardest parts:
- **3D models** — detailed, accurate models take time; start simple and stylised.
- **Performance on low-end phones** — keep models light.
- **Good teaching content** — needs input from real ICT teachers.

## Competition & difference

PC-building simulators exist mainly as **games** (paid, desktop-only, entertainment-focused) and some paid training platforms. Our difference:
- **Free/low-cost, browser-based, phone-friendly.**
- **Teaching first:** the *why* behind every step, fault diagnosis, quizzes.
- **Local relevance:** Swahili, offline use, aligned with school ICT syllabi.

## Future extensions

- Laptops, phones (battery, charging port, screen), printers, networking (router, cables).
- **AR mode:** place the 3D PC on your real desk through the phone camera.
- Teacher dashboard and certificates.

## Risks

| Risk | Mitigation |
|-----|-----------|
| Model creation cost | Stylised models first; community/licensed models later |
| Slow phones | Low-poly models, lazy loading |
| Content accuracy | Review by ICT teachers and technicians |

## Roadmap

| Phase | Deliverable |
|------|-------------|
| 0 | Clickable 3D prototype *(this app)* |
| 1 | Explore + explode + build mode for one desktop PC |
| 2 | Fix mode with 8–10 scenarios; quizzes |
| 3 | Swahili, offline mode, teacher dashboard |
| 4 | Laptop and phone models; AR mode |

## About the prototype

The prototype shows a simplified 3D desktop PC built from basic shapes. You can rotate it, tap parts to learn about them, explode it, follow a guided build, try one fault-diagnosis scenario and a short quiz. All data is mock data.
