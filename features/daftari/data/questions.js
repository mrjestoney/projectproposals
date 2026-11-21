// Mock question bank "Biology Form 2": 50 questions (36 short, 14 structured) on Cells, Nutrition, Transport and
// Classification (Form 2 level). Short questions are 2 marks; structured questions are 10 marks with parts (a)(b)(c)...
// Marking points end with their mark in brackets, e.g. "xylem (1)", and always add up to the question's marks
// (verified with a script when the data was written). lastUsed: the exam a question appeared in, or null (never used).
// Question numbers in source tags ("Q17") are the 1-based position in this list.

export const BANK_NAME = "Biology Form 2";
export const TOPICS = ["Cells", "Nutrition", "Transport", "Classification"];
export const USED_EXAM = "Mid-Term 2025";

const short = (id, topic, difficulty, text, marking, lastUsed = null) => ({
  id,
  type: "short",
  topic,
  difficulty,
  marks: 2,
  text,
  marking,
  lastUsed,
});

const structured = (id, topic, difficulty, text, parts, { lastUsed = null, diagram = false } = {}) => ({
  id,
  type: "structured",
  topic,
  difficulty,
  marks: 10,
  text,
  parts,
  lastUsed,
  diagram,
});

const part = (label, text, marks, marking) => ({ label, text, marks, marking });

const SHORT = [
  // ---- Cells
  short("C01", "Cells", "easy", "Name the part of a cell that controls all its activities and state one thing it contains.", [
    "Nucleus (1)",
    "Chromosomes / DNA / genetic material (1)",
  ]),
  short("C02", "Cells", "easy", "State two functions of the cell membrane.", [
    "Controls what enters and leaves the cell (1)",
    "Holds the cell contents together / protects the cell (1)",
  ]),
  short("C03", "Cells", "easy", "Name the organelle where aerobic respiration takes place and state what is released.", [
    "Mitochondria (1)",
    "Energy (1)",
  ]),
  short("C04", "Cells", "medium", "State two differences between a plant cell and an animal cell.", [
    "A plant cell has a cell wall; an animal cell does not (1)",
    "A plant cell has chloroplasts and a large permanent vacuole; an animal cell has none or only small vacuoles (1)",
  ]),
  short("C05", "Cells", "medium", "Define osmosis.", [
    "Movement of water molecules from a region of high water concentration (dilute solution) to a region of low water concentration (concentrated solution) (1)",
    "Through a semi-permeable (partially permeable) membrane (1)",
  ], USED_EXAM),
  short("C06", "Cells", "medium", "Name the structure that gives a plant cell its fixed shape and state what it is made of.", [
    "Cell wall (1)",
    "Cellulose (1)",
  ]),
  short("C07", "Cells", "hard", "A red blood cell is placed in pure water. State what happens to the cell and give a reason.", [
    "It swells and bursts (1)",
    "Water enters by osmosis, and the cell has no cell wall to resist the swelling (1)",
  ]),
  short("C08", "Cells", "easy", "State the function of the chloroplast in a plant cell.", [
    "It is the site of photosynthesis (1)",
    "It contains chlorophyll that absorbs light energy (1)",
  ], USED_EXAM),
  short("C09", "Cells", "hard", "Explain why a plant cell placed in pure water does not burst.", [
    "Water enters by osmosis and the cell becomes turgid (1)",
    "The strong cell wall resists the pressure / stops the cell from expanding too much (1)",
  ]),
  // ---- Nutrition
  short("N01", "Nutrition", "easy", "Name the process by which green plants make food and state the source of energy it uses.", [
    "Photosynthesis (1)",
    "Light (sunlight) energy (1)",
  ]),
  short("N02", "Nutrition", "easy", "Name two raw materials needed for photosynthesis.", [
    "Carbon dioxide (1)",
    "Water (1)",
  ]),
  short("N03", "Nutrition", "easy", "Name the two products of photosynthesis.", [
    "Glucose (1)",
    "Oxygen (1)",
  ], USED_EXAM),
  short("N04", "Nutrition", "easy", "State the chemical used to test for starch and the colour of a positive result.", [
    "Iodine solution (1)",
    "Blue-black (1)",
  ]),
  short("N05", "Nutrition", "medium", "Name the food class needed for growth and repair of the body and give one food rich in it.", [
    "Proteins (1)",
    "Any one: beans, meat, fish, eggs, milk (1)",
  ]),
  short("N06", "Nutrition", "medium", "Name the disease caused by a lack of vitamin C and state one of its signs.", [
    "Scurvy (1)",
    "Any one: bleeding gums, slow healing of wounds, sore joints (1)",
  ], USED_EXAM),
  short("N07", "Nutrition", "medium", "Name the enzyme found in saliva and state the food it digests.", [
    "Amylase (1)",
    "Starch (1)",
  ]),
  short("N08", "Nutrition", "hard", "Explain why a balanced diet is important for a growing child.", [
    "It contains all the food classes in the right amounts (1)",
    "It supplies energy and materials for growth and repair and prevents deficiency diseases (1)",
  ]),
  short("N09", "Nutrition", "hard", "Name the test for a reducing sugar and state the colour of a positive result.", [
    "Benedict's test (heating with Benedict's solution) (1)",
    "Brick-red (orange-red) precipitate (1)",
  ]),
  // ---- Transport
  short("T01", "Transport", "easy", "Name the tissue that carries water up a plant and state one way its cells are adapted.", [
    "Xylem (1)",
    "Any one: hollow, no end walls, walls strengthened with lignin (1)",
  ]),
  short("T02", "Transport", "easy", "Name the tissue that carries manufactured food in a plant and one substance it carries.", [
    "Phloem (1)",
    "Any one: sucrose, amino acids (1)",
  ]),
  short("T03", "Transport", "easy", "Name the blood cells that carry oxygen and the pigment they contain.", [
    "Red blood cells (1)",
    "Haemoglobin (1)",
  ], USED_EXAM),
  short("T04", "Transport", "medium", "Define transpiration.", [
    "Loss of water vapour from the aerial parts of a plant (1)",
    "Mainly through the stomata of the leaves (1)",
  ]),
  short("T05", "Transport", "medium", "State two factors that increase the rate of transpiration.", [
    "Any one: high temperature, strong wind, low humidity, bright light (1)",
    "Any other one from the same list (1)",
  ]),
  short("T06", "Transport", "medium", "Name the blood vessels that carry blood away from the heart and state one feature of their walls.", [
    "Arteries (1)",
    "Thick, muscular and elastic walls (1)",
  ], USED_EXAM),
  short("T07", "Transport", "medium", "State the function of white blood cells.", [
    "Defend the body against disease-causing organisms (1)",
    "By engulfing them (phagocytosis) or by making antibodies (1)",
  ]),
  short("T08", "Transport", "hard", "Explain why root hairs are well adapted for absorbing water.", [
    "They have a large surface area (1)",
    "They have thin walls, and the cell sap is more concentrated than soil water, so water enters by osmosis (1)",
  ]),
  short("T09", "Transport", "hard", "Name the part of the heart that pumps blood to the whole body and explain why its wall is the thickest.", [
    "Left ventricle (1)",
    "It must pump blood at high pressure over a long distance to the whole body (1)",
  ]),
  // ---- Classification
  short("K01", "Classification", "easy", "Name any two of the five kingdoms of living things.", [
    "Any one: Monera, Protoctista, Fungi, Plantae, Animalia (1)",
    "Any other one from the same list (1)",
  ]),
  short("K02", "Classification", "easy", "Name the group of animals that have a backbone and give one example.", [
    "Vertebrates (1)",
    "Any one: fish, frog, lizard, bird, human (1)",
  ]),
  short("K03", "Classification", "easy", "State two characteristics of all living things.", [
    "Any one: movement, respiration, sensitivity, growth, reproduction, excretion, nutrition (1)",
    "Any other one from the same list (1)",
  ]),
  short("K04", "Classification", "medium", "Name the class of arthropods that have three pairs of legs and give one example.", [
    "Insecta (insects) (1)",
    "Any one: housefly, butterfly, ant, grasshopper (1)",
  ], USED_EXAM),
  short("K05", "Classification", "medium", "Name the phylum to which earthworms belong and state one feature of the phylum.", [
    "Annelida (1)",
    "Body made of many similar segments / ring-like segments (1)",
  ]),
  short("K06", "Classification", "medium", "State two features that distinguish mammals from other vertebrates.", [
    "Have hair or fur on the body (1)",
    "Have mammary glands that produce milk for the young (1)",
  ], USED_EXAM),
  short("K07", "Classification", "medium", "Name the kingdom whose members have cell walls made of chitin and feed by absorption, and give one example.", [
    "Fungi (1)",
    "Any one: mushroom, yeast, bread mould (1)",
  ]),
  short("K08", "Classification", "hard", "A bat can fly, but it is classified as a mammal and not as a bird. Give two reasons.", [
    "It has hair (fur) on its body (1)",
    "It gives birth to live young and feeds them with milk (1)",
  ]),
  short("K09", "Classification", "hard", "State two features used to classify an organism as a plant.", [
    "It has chlorophyll and makes its own food by photosynthesis (1)",
    "Its cells have cellulose cell walls (1)",
  ]),
];

const STRUCTURED = [
  // ---- Cells
  structured("C10", "Cells", "medium", "Plant cells have a typical structure that can be drawn and labelled.", [
    part("a", "Draw a labelled diagram of a typical plant cell showing the cell wall, cell membrane, cytoplasm, nucleus, chloroplast and vacuole.", 4, [
      "Large, neat, correct outline of the cell (1)",
      "Any three parts correctly labelled (3)",
    ]),
    part("b", "State the function of each of the following: cell wall, nucleus and vacuole.", 3, [
      "Cell wall: supports the cell and gives it shape (1)",
      "Nucleus: controls the activities of the cell (1)",
      "Vacuole: stores water and dissolved substances (cell sap) (1)",
    ]),
    part("c", "Name two structures found in plant cells but not in animal cells and state one function of either.", 3, [
      "Any one: cell wall, chloroplast, large permanent vacuole (1)",
      "Any other one from the same list (1)",
      "Correct function of one named structure (1)",
    ]),
  ], { diagram: true }),
  structured("C11", "Cells", "hard", "A cylinder of potato 5 cm long was placed in a strong sugar solution for one hour.", [
    part("a", "State what happened to the length of the cylinder.", 1, ["It decreased / it became shorter (1)"]),
    part("b", "Explain your answer to (a).", 3, [
      "The sugar solution had a lower water concentration than the potato cells (1)",
      "Water left the cells by osmosis (1)",
      "Through the partially permeable cell membrane; the cells became flaccid (1)",
    ]),
    part("c", "Describe and explain what would happen to a similar cylinder placed in distilled water.", 3, [
      "It would increase in length / become firm (1)",
      "Water enters the cells by osmosis (1)",
      "The cells become turgid but the cell wall stops them from bursting (1)",
    ]),
    part("d", "Explain how osmosis helps plant roots to absorb water from the soil.", 3, [
      "Root hair cell sap is more concentrated than the soil water (1)",
      "So water moves into the root hair cells by osmosis (1)",
      "Then from cell to cell until it reaches the xylem (1)",
    ]),
  ], { lastUsed: USED_EXAM }),
  structured("C12", "Cells", "medium", "Living things are organised at different levels.", [
    part("a", "Define the terms tissue and organ.", 4, [
      "Tissue: a group of similar cells that work together to do the same job (2)",
      "Organ: a group of different tissues that work together to do a particular job (2)",
    ]),
    part("b", "Arrange these in order from the smallest to the largest: organ, cell, organism, tissue, organ system.", 3, [
      "Cell, tissue, organ, organ system, organism (3)",
    ]),
    part("c", "Give one example of a tissue in a plant and one in an animal, and state the function of the plant tissue you named.", 3, [
      "Plant tissue, e.g. xylem, phloem or palisade tissue (1)",
      "Animal tissue, e.g. muscle, nerve or blood (1)",
      "Correct function of the plant tissue named (1)",
    ]),
  ]),
  structured("C13", "Cells", "hard", "A student used a light microscope to observe onion epidermal cells.", [
    part("a", "Name two parts of a light microscope that magnify the image.", 2, [
      "Eyepiece lens (1)",
      "Objective lens (1)",
    ]),
    part("b", "The eyepiece lens is x10 and the objective lens is x40. Calculate the total magnification.", 2, [
      "10 x 40 (1)",
      "400 times (1)",
    ]),
    part("c", "Explain why the onion cells were stained with iodine solution before viewing.", 3, [
      "Most cell parts are transparent / colourless (1)",
      "Iodine stains the nucleus and other parts yellow-brown (1)",
      "This gives contrast so the structures can be seen clearly (1)",
    ]),
    part("d", "State three precautions to take when preparing the temporary slide.", 3, [
      "Use a very thin piece of specimen (1)",
      "Lower the cover slip slowly at an angle to avoid air bubbles (1)",
      "Remove excess stain or water with filter paper (1)",
    ]),
  ]),
  // ---- Nutrition
  structured("N10", "Nutrition", "medium", "Green plants make their own food by photosynthesis.", [
    part("a", "Write the word equation for photosynthesis.", 3, [
      "Carbon dioxide + water (1)",
      "Glucose + oxygen (1)",
      "Light energy and chlorophyll shown (1)",
    ]),
    part("b", "State three ways in which a leaf is adapted for photosynthesis.", 3, [
      "Any three: broad and flat (large surface area); thin so gases diffuse quickly; chloroplasts with chlorophyll; stomata for gas exchange; veins bring water and remove food (3)",
    ]),
    part("c", "Describe how you would test a leaf for starch.", 4, [
      "Boil the leaf in water to kill it (1)",
      "Boil it in ethanol in a water bath to remove chlorophyll (1)",
      "Rinse in warm water to soften it (1)",
      "Add iodine solution; blue-black shows starch is present (1)",
    ]),
  ], { lastUsed: USED_EXAM }),
  structured("N11", "Nutrition", "hard", "A balanced diet contains different food classes.", [
    part("a", "Name the food class that supplies each of the following: (i) energy, (ii) growth and repair, (iii) protection against diseases.", 3, [
      "Carbohydrates (and fats) (1)",
      "Proteins (1)",
      "Vitamins and mineral salts (1)",
    ]),
    part("b", "Name the deficiency disease caused by a lack of: (i) vitamin D, (ii) iron, (iii) protein.", 3, [
      "Rickets (1)",
      "Anaemia (1)",
      "Kwashiorkor (1)",
    ]),
    part("c", "Explain why roughage (dietary fibre) is important in the diet.", 4, [
      "It gives bulk to the food (1)",
      "It stimulates peristalsis (the movement of food through the gut) (1)",
      "It prevents constipation (1)",
      "It reduces the risk of bowel diseases (1)",
    ]),
  ]),
  structured("N12", "Nutrition", "medium", "The alimentary canal digests and absorbs food.", [
    part("a", "Name two organs where chemical digestion begins and the food digested in each.", 2, [
      "Mouth: starch (1)",
      "Stomach: protein (1)",
    ]),
    part("b", "State the role of bile in digestion.", 3, [
      "Made by the liver and stored in the gall bladder (1)",
      "Breaks fat into tiny droplets (emulsifies fats) (1)",
      "This gives a larger surface area for lipase to act on / neutralises stomach acid (1)",
    ]),
    part("c", "Describe how the villi are adapted for absorbing digested food.", 5, [
      "Finger-like projections give a large surface area (1)",
      "Thin walls, one cell thick (1)",
      "Rich supply of blood capillaries (1)",
      "That carry absorbed food away quickly (1)",
      "A lacteal absorbs fatty acids and glycerol (1)",
    ]),
  ]),
  structured("N13", "Nutrition", "hard", "The human alimentary canal.", [
    part("a", "Draw and label the alimentary canal showing the mouth, oesophagus, stomach, small intestine and large intestine.", 5, [
      "Clear, correctly sequenced diagram (1)",
      "Any four parts correctly labelled (4)",
    ]),
    part("b", "State two functions of the large intestine.", 2, [
      "Absorbs water (1)",
      "Forms and stores faeces (1)",
    ]),
    part("c", "Explain what happens to food that cannot be digested.", 3, [
      "It passes into the rectum (1)",
      "It is stored as faeces (1)",
      "It is removed from the body through the anus (egestion) (1)",
    ]),
  ], { diagram: true }),
  // ---- Transport
  structured("T10", "Transport", "medium", "Plants take up water and lose it from their leaves.", [
    part("a", "Describe the path taken by water from the soil to the leaf.", 4, [
      "Enters the root hair cells by osmosis (1)",
      "Moves across the cortex to the xylem (1)",
      "Moves up the xylem vessels to the leaf (1)",
      "Evaporates from the leaf cells and leaves through the stomata (1)",
    ]),
    part("b", "Name two factors that affect the rate of transpiration and explain how one of them does so.", 3, [
      "Any one factor: temperature, wind, humidity, light (1)",
      "Any other factor (1)",
      "Correct explanation, e.g. higher temperature makes water evaporate faster (1)",
    ]),
    part("c", "State three importance of transpiration to a plant.", 3, [
      "Pulls water and mineral salts up the plant (1)",
      "Cools the leaves (1)",
      "Supplies water for photosynthesis / keeps cells turgid (1)",
    ]),
  ], { lastUsed: USED_EXAM }),
  structured("T11", "Transport", "hard", "Blood transports substances around the body.", [
    part("a", "Name the four main components of blood.", 4, [
      "Red blood cells (1)",
      "White blood cells (1)",
      "Platelets (1)",
      "Plasma (1)",
    ]),
    part("b", "State one function of red blood cells and one function of platelets.", 2, [
      "Red blood cells carry oxygen (1)",
      "Platelets help blood to clot (1)",
    ]),
    part("c", "Explain how the shape and structure of a red blood cell help it to carry oxygen.", 4, [
      "It has no nucleus, leaving more room for haemoglobin (1)",
      "So it can carry more oxygen (1)",
      "It is biconcave, giving a large surface area (1)",
      "So oxygen diffuses in and out quickly (1)",
    ]),
  ]),
  structured("T12", "Transport", "medium", "The circulatory system of a human.", [
    part("a", "State one difference between arteries and veins in each of: (i) wall thickness, (ii) valves, (iii) direction of blood flow.", 3, [
      "Arteries have thick walls; veins have thin walls (1)",
      "Veins have valves; arteries do not (1)",
      "Arteries carry blood away from the heart; veins carry blood towards it (1)",
    ]),
    part("b", "Explain why veins have valves.", 3, [
      "Blood in veins is at low pressure (1)",
      "The valves stop the blood from flowing backwards (1)",
      "So the blood keeps moving towards the heart (1)",
    ]),
    part("c", "State two ways of keeping the heart healthy and explain how each one helps.", 4, [
      "Regular exercise: strengthens the heart muscle (2)",
      "Eating less fat / not smoking: prevents blocked arteries (2)",
    ]),
  ]),
  // ---- Classification
  structured("K10", "Classification", "medium", "Organisms are grouped into a classification system.", [
    part("a", "Define the term classification.", 2, [
      "Grouping of organisms (1)",
      "According to the similarities and differences between them (1)",
    ]),
    part("b", "Arrange these from the largest group to the smallest: species, kingdom, class, genus, phylum, family, order.", 3, [
      "Kingdom, phylum, class, order, family, genus, species (3)",
    ]),
    part("c", "Write the scientific name of a human being and state three rules for writing scientific names.", 5, [
      "Homo sapiens (1)",
      "Two names: genus and species (binomial) (1)",
      "The genus name begins with a capital letter (1)",
      "The species name begins with a small letter (1)",
      "Written in italics or underlined separately (1)",
    ]),
  ]),
  structured("K11", "Classification", "hard", "Arthropods are the largest group of animals.", [
    part("a", "Name four classes of arthropods.", 4, [
      "Any four: Insecta, Arachnida, Crustacea, Chilopoda, Diplopoda (4)",
    ]),
    part("b", "State three features common to all arthropods.", 3, [
      "Jointed legs (1)",
      "Hard outer skeleton (exoskeleton) (1)",
      "Segmented body (1)",
    ]),
    part("c", "State three differences between insects and arachnids.", 3, [
      "Insects have three pairs of legs; arachnids have four pairs (1)",
      "Insects have antennae and usually wings; arachnids have neither (1)",
      "Insects have three body parts; arachnids have two (1)",
    ]),
  ]),
  structured("K12", "Classification", "medium", "Vertebrates are divided into five classes.", [
    part("a", "Name the five classes of vertebrates.", 5, [
      "Fish (1)",
      "Amphibians (1)",
      "Reptiles (1)",
      "Birds (1)",
      "Mammals (1)",
    ]),
    part("b", "State one feature that distinguishes birds and one that distinguishes amphibians.", 2, [
      "Birds: feathers / wings (1)",
      "Amphibians: moist skin without scales / lay eggs in water (1)",
    ]),
    part("c", "A whale lives in water but is classified as a mammal. Explain why.", 3, [
      "It has mammary glands and feeds its young on milk (1)",
      "It breathes with lungs (1)",
      "It is warm-blooded and gives birth to live young (1)",
    ]),
  ], { diagram: true }),
];

export const QUESTIONS = [...SHORT, ...STRUCTURED].map((q, i) => ({ ...q, n: i + 1 }));
export const questionById = (id) => QUESTIONS.find((q) => q.id === id);
