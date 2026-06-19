const CANVAS_SIZE = 768;

const SELECT_ORDER = ["TYPE", "HEAD", "EYES", "MOUTH", "ACC1", "ACC2", "BG"];
const DRAW_ORDER = ["BG", "TYPE", "MOUTH", "HEAD", "EYES", "ACC1", "ACC2"];
const ASSET_BASE = "../assets/builder";

const NONE_PART = { file: "", display: "None", none: true };
const PARTS = {
  "Male": {
    "TYPE": [
      {
        "file": "Robot",
        "display": "Robot"
      },
      {
        "file": "Ghost",
        "display": "Ghost"
      },
      {
        "file": "Specter",
        "display": "Specter"
      },
      {
        "file": "Phantom",
        "display": "Phantom"
      },
      {
        "file": "Male_01",
        "display": "Male(caucasoid)"
      },
      {
        "file": "Male_02",
        "display": "Male(mongoloid)"
      },
      {
        "file": "Male_03",
        "display": "Male(australoid)"
      },
      {
        "file": "Male_04",
        "display": "Male(negroid)"
      },
      {
        "file": "Male_05",
        "display": "Male(kasparoid)",
        "limited": true
      },
      {
        "file": "Ape",
        "display": "Ape",
        "limited": true
      }
    ],
    "HEAD": [
      {
        "file": "Afro_01",
        "display": "Afro(gray)"
      },
      {
        "file": "Afro_02",
        "display": "Afro(brown)"
      },
      {
        "file": "Afro_03",
        "display": "Afro(black)"
      },
      {
        "file": "Beanie_01",
        "display": "Beanie(red)"
      },
      {
        "file": "Beanie_02",
        "display": "Beanie(orange)"
      },
      {
        "file": "Beanie_03",
        "display": "Beanie(yellow)"
      },
      {
        "file": "Beanie_04",
        "display": "Beanie(green)"
      },
      {
        "file": "Beanie_05",
        "display": "Beanie(sky)"
      },
      {
        "file": "Beanie_06",
        "display": "Beanie(blue)"
      },
      {
        "file": "Beanie_07",
        "display": "Beanie(purple)"
      },
      {
        "file": "Beanie_08",
        "display": "Beanie(pink)"
      },
      {
        "file": "Beanie_09",
        "display": "Beanie(black)"
      },
      {
        "file": "Beanie_10",
        "display": "Beanie(brown)"
      },
      {
        "file": "BowlCut_01",
        "display": "BowlCut(gray)"
      },
      {
        "file": "BowlCut_02",
        "display": "BowlCut(brown)"
      },
      {
        "file": "BowlCut_03",
        "display": "BowlCut(black)"
      },
      {
        "file": "Bowler_01",
        "display": "Bowler(black)"
      },
      {
        "file": "Bowler_02",
        "display": "Bowler(ivory)"
      },
      {
        "file": "BuzzCut_01",
        "display": "BuzzCut(gray)"
      },
      {
        "file": "BuzzCut_02",
        "display": "BuzzCut(brown)"
      },
      {
        "file": "BuzzCut_03",
        "display": "BuzzCut(black)"
      },
      {
        "file": "ChefHat_01",
        "display": "ChefHat(white)"
      },
      {
        "file": "ChefHat_02",
        "display": "ChefHat(Ice)"
      },
      {
        "file": "CueBall",
        "display": "CueBall"
      },
      {
        "file": "Do-rag",
        "display": "Do-rag"
      },
      {
        "file": "Hachimaki",
        "display": "Hachimaki"
      },
      {
        "file": "Helmet_01",
        "display": "Helmet(yellow)"
      },
      {
        "file": "Helmet_02",
        "display": "Helmet(green)"
      },
      {
        "file": "Hoodie_01",
        "display": "Hoodie(black)"
      },
      {
        "file": "Hoodie_02",
        "display": "Hoodie(white)",
        "limited": true
      },
      {
        "file": "ILH_01",
        "display": "ILH(gray)"
      },
      {
        "file": "ILH_02",
        "display": "ILH(brown)"
      },
      {
        "file": "ILH_03",
        "display": "ILH(black)"
      },
      {
        "file": "KasCap_01",
        "display": "KasCap(red)"
      },
      {
        "file": "KasCap_02",
        "display": "KasCap(orange)"
      },
      {
        "file": "KasCap_03",
        "display": "KasCap(yellow)"
      },
      {
        "file": "KasCap_04",
        "display": "KasCap(green)"
      },
      {
        "file": "KasCap_05",
        "display": "KasCap(sky)"
      },
      {
        "file": "KasCap_06",
        "display": "KasCap(blue)"
      },
      {
        "file": "KasCap_07",
        "display": "KasCap(purple)"
      },
      {
        "file": "KasCap_08",
        "display": "KasCap(pink)"
      },
      {
        "file": "KasCap_09",
        "display": "KasCap(black)"
      },
      {
        "file": "KasCap_10",
        "display": "KasCap(brown)"
      },
      {
        "file": "KasCap_11",
        "display": "KasCap(white)"
      },
      {
        "file": "KasCap_12",
        "display": "KasCap(kaspa)"
      },
      {
        "file": "King",
        "display": "King"
      },
      {
        "file": "Knight",
        "display": "Knight"
      },
      {
        "file": "LongHair_01",
        "display": "LongHair(gray)"
      },
      {
        "file": "LongHair_02",
        "display": "LongHair(brown)"
      },
      {
        "file": "LongHair_03",
        "display": "LongHair(black)"
      },
      {
        "file": "LuchaMask_01",
        "display": "LuchaMask(red)"
      },
      {
        "file": "LuchaMask_02",
        "display": "LuchaMask(navy)"
      },
      {
        "file": "Mohawk_01",
        "display": "Mohawk(gray)"
      },
      {
        "file": "Mohawk_02",
        "display": "Mohawk(brown)"
      },
      {
        "file": "Mohawk_03",
        "display": "Mohawk(black)"
      },
      {
        "file": "Perm_01",
        "display": "Perm(gray)"
      },
      {
        "file": "Perm_02",
        "display": "Perm(brown)"
      },
      {
        "file": "Perm_03",
        "display": "Perm(black)"
      },
      {
        "file": "PropellerBeanie",
        "display": "PropellerBeanie"
      },
      {
        "file": "Ten-GallonHat_01",
        "display": "Ten-GallonHat(brown)"
      },
      {
        "file": "Ten-GallonHat_02",
        "display": "Ten-GallonHat(black)"
      },
      {
        "file": "Viking",
        "display": "Viking"
      },
      {
        "file": "VividHair_01",
        "display": "VividHair(red)"
      },
      {
        "file": "VividHair_02",
        "display": "VividHair(orange)"
      },
      {
        "file": "VividHair_03",
        "display": "VividHair(yellow)"
      },
      {
        "file": "VividHair_04",
        "display": "VividHair(green)"
      },
      {
        "file": "VividHair_05",
        "display": "VividHair(sky)"
      },
      {
        "file": "VividHair_06",
        "display": "VividHair(blue)"
      },
      {
        "file": "VividHair_07",
        "display": "VividHair(purple)"
      },
      {
        "file": "VividHair_08",
        "display": "VividHair(pink)"
      },
      {
        "file": "VividHair_09",
        "display": "VividHair(black)"
      },
      {
        "file": "VividHair_10",
        "display": "VividHair(brown)"
      },
      {
        "file": "WorkCap_01",
        "display": "WorkCap(red)"
      },
      {
        "file": "WorkCap_02",
        "display": "WorkCap(orange)"
      },
      {
        "file": "WorkCap_03",
        "display": "WorkCap(yellow)"
      },
      {
        "file": "WorkCap_04",
        "display": "WorkCap(green)"
      },
      {
        "file": "WorkCap_05",
        "display": "WorkCap(sky)"
      },
      {
        "file": "WorkCap_06",
        "display": "WorkCap(blue)"
      },
      {
        "file": "WorkCap_07",
        "display": "WorkCap(purple)"
      },
      {
        "file": "WorkCap_08",
        "display": "WorkCap(pink)"
      },
      {
        "file": "WorkCap_09",
        "display": "WorkCap(black)"
      },
      {
        "file": "WorkCap_10",
        "display": "WorkCap(brown)"
      },
      {
        "file": "Santa",
        "display": "Santa",
        "limited": true
      },
      {
        "file": "Clown",
        "display": "Clown",
        "limited": true
      },
      {
        "file": "Headband",
        "display": "Headband",
        "limited": true
      },
      {
        "file": "Bandana",
        "display": "Bandana",
        "limited": true
      }
    ],
    "EYES": [
      {
        "file": "3D",
        "display": "3D"
      },
      {
        "file": "BlueShades",
        "display": "BlueShades"
      },
      {
        "file": "BtcEyes",
        "display": "BtcEyes"
      },
      {
        "file": "EyePatch",
        "display": "EyePatch"
      },
      {
        "file": "Glasses",
        "display": "Glasses"
      },
      {
        "file": "KasEyes",
        "display": "KasEyes"
      },
      {
        "file": "NerdGlasses",
        "display": "NerdGlasses"
      },
      {
        "file": "RedShades",
        "display": "RedShades"
      },
      {
        "file": "Shades",
        "display": "Shades"
      },
      {
        "file": "SlimGlasses",
        "display": "SlimGlasses"
      },
      {
        "file": "VR_01",
        "display": "VR(white)"
      },
      {
        "file": "VR_02",
        "display": "VR(black)"
      },
      {
        "file": "EyeMask",
        "display": "EyeMask",
        "limited": true
      }
    ],
    "MOUTH": [
      {
        "file": "Beard_01",
        "display": "Beard(gray)"
      },
      {
        "file": "Beard_02",
        "display": "Beard(brown)"
      },
      {
        "file": "Beard_03",
        "display": "Beard(black)"
      },
      {
        "file": "BigBeard_01",
        "display": "BigBeard(gray)"
      },
      {
        "file": "BigBeard_02",
        "display": "BigBeard(brown)"
      },
      {
        "file": "BigBeard_03",
        "display": "BigBeard(black)"
      },
      {
        "file": "FrontBeard_01",
        "display": "FrontBeard(gray)"
      },
      {
        "file": "FrontBeard_02",
        "display": "FrontBeard(brown)"
      },
      {
        "file": "FrontBeard_03",
        "display": "FrontBeard(black)"
      },
      {
        "file": "Goat_01",
        "display": "Goat(gray)"
      },
      {
        "file": "Goat_02",
        "display": "Goat(brown)"
      },
      {
        "file": "Goat_03",
        "display": "Goat(black)"
      },
      {
        "file": "ShadowBeard_01",
        "display": "ShadowBeard(gray)"
      },
      {
        "file": "ShadowBeard_02",
        "display": "ShadowBeard(brown)"
      },
      {
        "file": "ShadowBeard_03",
        "display": "ShadowBeard(black)"
      },
      {
        "file": "Stubble_01",
        "display": "Stubble(gray)"
      },
      {
        "file": "Stubble_02",
        "display": "Stubble(brown)"
      },
      {
        "file": "Stubble_03",
        "display": "Stubble(black)"
      }
    ],
    "ACC1": [
      {
        "file": "Bubble_01",
        "display": "Bubble(strawberry)"
      },
      {
        "file": "Bubble_02",
        "display": "Bubble(lemon)"
      },
      {
        "file": "Bubble_03",
        "display": "Bubble(muscat)"
      },
      {
        "file": "Bubble_04",
        "display": "Bubble(mint)"
      },
      {
        "file": "Bubble_05",
        "display": "Bubble(grapes)"
      },
      {
        "file": "Bubble_06",
        "display": "Bubble(black)"
      },
      {
        "file": "Cigs",
        "display": "Cigs"
      },
      {
        "file": "Roll",
        "display": "Roll"
      },
      {
        "file": "Vape",
        "display": "Vape"
      }
    ],
    "ACC2": [
      {
        "file": "Chain_01",
        "display": "Chain(silver)"
      },
      {
        "file": "Chain_02",
        "display": "Chain(gold)"
      },
      {
        "file": "Studs_01",
        "display": "Studs(silver)"
      },
      {
        "file": "Studs_02",
        "display": "Studs(gold)"
      }
    ]
  },
  "Female": {
    "TYPE": [
      {
        "file": "Female_01",
        "display": "Female(caucasoid)"
      },
      {
        "file": "Female_02",
        "display": "Female(mongoloid)"
      },
      {
        "file": "Female_03",
        "display": "Female(australoid)"
      },
      {
        "file": "Female_04",
        "display": "Female(negroid)"
      },
      {
        "file": "Female_05",
        "display": "Female(kasparoid)",
        "limited": true
      }
    ],
    "HEAD": [
      {
        "file": "Afro_01",
        "display": "Afro(gray)"
      },
      {
        "file": "Afro_02",
        "display": "Afro(brown)"
      },
      {
        "file": "Afro_03",
        "display": "Afro(black)"
      },
      {
        "file": "Beanie_01",
        "display": "Beanie(red)"
      },
      {
        "file": "Beanie_02",
        "display": "Beanie(orange)"
      },
      {
        "file": "Beanie_03",
        "display": "Beanie(yellow)"
      },
      {
        "file": "Beanie_04",
        "display": "Beanie(green)"
      },
      {
        "file": "Beanie_05",
        "display": "Beanie(sky)"
      },
      {
        "file": "Beanie_06",
        "display": "Beanie(blue)"
      },
      {
        "file": "Beanie_07",
        "display": "Beanie(purple)"
      },
      {
        "file": "Beanie_08",
        "display": "Beanie(pink)"
      },
      {
        "file": "Beanie_09",
        "display": "Beanie(black)"
      },
      {
        "file": "Beanie_10",
        "display": "Beanie(brown)"
      },
      {
        "file": "BowlCut_01",
        "display": "BowlCut(gray)"
      },
      {
        "file": "BowlCut_02",
        "display": "BowlCut(brown)"
      },
      {
        "file": "BowlCut_03",
        "display": "BowlCut(black)"
      },
      {
        "file": "Bowler_01",
        "display": "Bowler(black)"
      },
      {
        "file": "Bowler_02",
        "display": "Bowler(ivory)"
      },
      {
        "file": "BucketHat_01",
        "display": "BucketHat(dandelion)"
      },
      {
        "file": "BucketHat_02",
        "display": "BucketHat(lavender)"
      },
      {
        "file": "Bunny",
        "display": "Bunny"
      },
      {
        "file": "ChefHat_01",
        "display": "ChefHat(white)"
      },
      {
        "file": "ChefHat_02",
        "display": "ChefHat(Ice)"
      },
      {
        "file": "ClassicBob_01",
        "display": "ClassicBob(gray)"
      },
      {
        "file": "ClassicBob_02",
        "display": "ClassicBob(brown)"
      },
      {
        "file": "ClassicBob_03",
        "display": "ClassicBob(black)"
      },
      {
        "file": "CueBall",
        "display": "CueBall"
      },
      {
        "file": "CurlyHair_01",
        "display": "CurlyHair(gray)"
      },
      {
        "file": "CurlyHair_02",
        "display": "CurlyHair(brown)"
      },
      {
        "file": "CurlyHair_03",
        "display": "CurlyHair(black)"
      },
      {
        "file": "Helmet_01",
        "display": "Helmet(yellow)"
      },
      {
        "file": "Helmet_02",
        "display": "Helmet(green)"
      },
      {
        "file": "Hoodie_01",
        "display": "Hoodie(black)"
      },
      {
        "file": "Hoodie_02",
        "display": "Hoodie(white)",
        "limited": true
      },
      {
        "file": "KasCap_01",
        "display": "KasCap(red)"
      },
      {
        "file": "KasCap_02",
        "display": "KasCap(orange)"
      },
      {
        "file": "KasCap_03",
        "display": "KasCap(yellow)"
      },
      {
        "file": "KasCap_04",
        "display": "KasCap(green)"
      },
      {
        "file": "KasCap_05",
        "display": "KasCap(sky)"
      },
      {
        "file": "KasCap_06",
        "display": "KasCap(blue)"
      },
      {
        "file": "KasCap_07",
        "display": "KasCap(purple)"
      },
      {
        "file": "KasCap_08",
        "display": "KasCap(pink)"
      },
      {
        "file": "KasCap_09",
        "display": "KasCap(black)"
      },
      {
        "file": "KasCap_10",
        "display": "KasCap(brown)"
      },
      {
        "file": "KasCap_11",
        "display": "KasCap(white)"
      },
      {
        "file": "KasCap_12",
        "display": "KasCap(kaspa)"
      },
      {
        "file": "LongHair_01",
        "display": "LongHair(gray)"
      },
      {
        "file": "LongHair_02",
        "display": "LongHair(brown)"
      },
      {
        "file": "LongHair_03",
        "display": "LongHair(black)"
      },
      {
        "file": "LuchaMask_01",
        "display": "LuchaMask(red)"
      },
      {
        "file": "LuchaMask_02",
        "display": "LuchaMask(navy)"
      },
      {
        "file": "Mohawk_01",
        "display": "Mohawk(gray)"
      },
      {
        "file": "Mohawk_02",
        "display": "Mohawk(brown)"
      },
      {
        "file": "Mohawk_03",
        "display": "Mohawk(black)"
      },
      {
        "file": "Perm_01",
        "display": "Perm(gray)"
      },
      {
        "file": "Perm_02",
        "display": "Perm(brown)"
      },
      {
        "file": "Perm_03",
        "display": "Perm(black)"
      },
      {
        "file": "PropellerBeanie",
        "display": "PropellerBeanie"
      },
      {
        "file": "VividHair_01",
        "display": "VividHair(red)"
      },
      {
        "file": "VividHair_02",
        "display": "VividHair(orange)"
      },
      {
        "file": "VividHair_03",
        "display": "VividHair(yellow)"
      },
      {
        "file": "VividHair_04",
        "display": "VividHair(green)"
      },
      {
        "file": "VividHair_05",
        "display": "VividHair(sky)"
      },
      {
        "file": "VividHair_06",
        "display": "VividHair(blue)"
      },
      {
        "file": "VividHair_07",
        "display": "VividHair(purple)"
      },
      {
        "file": "VividHair_08",
        "display": "VividHair(pink)"
      },
      {
        "file": "VividHair_09",
        "display": "VividHair(black)"
      },
      {
        "file": "VividHair_10",
        "display": "VividHair(brown)"
      },
      {
        "file": "WorkCap_01",
        "display": "WorkCap(red)"
      },
      {
        "file": "WorkCap_02",
        "display": "WorkCap(orange)"
      },
      {
        "file": "WorkCap_03",
        "display": "WorkCap(yellow)"
      },
      {
        "file": "WorkCap_04",
        "display": "WorkCap(green)"
      },
      {
        "file": "WorkCap_05",
        "display": "WorkCap(sky)"
      },
      {
        "file": "WorkCap_06",
        "display": "WorkCap(blue)"
      },
      {
        "file": "WorkCap_07",
        "display": "WorkCap(purple)"
      },
      {
        "file": "WorkCap_08",
        "display": "WorkCap(pink)"
      },
      {
        "file": "WorkCap_09",
        "display": "WorkCap(black)"
      },
      {
        "file": "WorkCap_10",
        "display": "WorkCap(brown)"
      },
      {
        "file": "PilotHelmet",
        "display": "PilotHelmet",
        "limited": true
      },
      {
        "file": "TassleHat",
        "display": "TassleHat",
        "limited": true
      }
    ],
    "EYES": [
      {
        "file": "3D",
        "display": "3D"
      },
      {
        "file": "BlueShades",
        "display": "BlueShades"
      },
      {
        "file": "BtcEyes",
        "display": "BtcEyes"
      },
      {
        "file": "EyePatch",
        "display": "EyePatch"
      },
      {
        "file": "Glasses",
        "display": "Glasses"
      },
      {
        "file": "KasEyes",
        "display": "KasEyes"
      },
      {
        "file": "NerdGlasses",
        "display": "NerdGlasses"
      },
      {
        "file": "RedShades",
        "display": "RedShades"
      },
      {
        "file": "Shades",
        "display": "Shades"
      },
      {
        "file": "SlimGlasses",
        "display": "SlimGlasses"
      },
      {
        "file": "VR_01",
        "display": "VR(white)"
      },
      {
        "file": "VR_02",
        "display": "VR(black)"
      },
      {
        "file": "EyeMask",
        "display": "EyeMask",
        "limited": true
      }
    ],
    "MOUTH": [
      {
        "file": "Makeup_01",
        "display": "Makeup(pink)"
      },
      {
        "file": "Makeup_02",
        "display": "Makeup(rosepink)"
      },
      {
        "file": "Makeup_03",
        "display": "Makeup(adult)"
      },
      {
        "file": "Makeup_04",
        "display": "Makeup(orange)"
      },
      {
        "file": "Makeup_05",
        "display": "Makeup(bitcoin)"
      },
      {
        "file": "Makeup_06",
        "display": "Makeup(nightblue)"
      },
      {
        "file": "Makeup_07",
        "display": "Makeup(kaspa)",
        "limited": true
      }
    ],
    "ACC1": [
      {
        "file": "Bubble_01",
        "display": "Bubble(strawberry)"
      },
      {
        "file": "Bubble_02",
        "display": "Bubble(lemon)"
      },
      {
        "file": "Bubble_03",
        "display": "Bubble(muscat)"
      },
      {
        "file": "Bubble_04",
        "display": "Bubble(mint)"
      },
      {
        "file": "Bubble_05",
        "display": "Bubble(grapes)"
      },
      {
        "file": "Bubble_06",
        "display": "Bubble(black)"
      },
      {
        "file": "Cigs",
        "display": "Cigs"
      },
      {
        "file": "Vape",
        "display": "Vape"
      }
    ],
    "ACC2": [
      {
        "file": "Chain_01",
        "display": "Chain(silver)"
      },
      {
        "file": "Chain_02",
        "display": "Chain(gold)"
      },
      {
        "file": "Studs_01",
        "display": "Studs(silver)"
      },
      {
        "file": "Studs_02",
        "display": "Studs(gold)"
      }
    ]
  },
  "BG": [
    {
      "file": "bg_01",
      "display": "bg(kaspa)"
    },
    {
      "file": "bg_02",
      "display": "bg(bitcoin)"
    },
    {
      "file": "bg_03",
      "display": "bg(sale)",
      "limited": true
    },
    {
      "file": "bg_04",
      "display": "bg(for sale)",
      "limited": true
    },
    {
      "file": "bg_05",
      "display": "bg(bid)",
      "limited": true
    },
    {
      "file": "bg_06",
      "display": "bg(wrapp)",
      "limited": true
    }
  ]
};

const canvas = document.getElementById("punkCanvas");
const ctx = canvas.getContext("2d");
const genderSelect = document.getElementById("genderSelect");
const controls = document.getElementById("controls");

const state = {
  gender: null,
  selected: {
    TYPE: null,
    HEAD: null,
    EYES: null,
    MOUTH: null,
    ACC1: null,
    ACC2: null,
    BG: PARTS.BG[0] || null
  }
};

const accordionOpen = SELECT_ORDER.reduce((acc, category) => {
  acc[category] = true;
  return acc;
}, {});

const imageCache = new Map();

function getPartsFor(category) {
  if (category === "BG") return PARTS.BG;
  if (!state.gender) return [];
  return PARTS[state.gender]?.[category] || [];
}

function getAssetPath(category, file) {
  if (category === "BG") return `${ASSET_BASE}/bg/${file}.png`;
  return `${ASSET_BASE}/${state.gender.toLowerCase()}/${category.toLowerCase()}/${file}.png`;
}

function loadImage(src) {
  if (imageCache.has(src)) return imageCache.get(src);

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

  imageCache.set(src, promise);
  return promise;
}

async function render() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.imageSmoothingEnabled = false;

  for (const category of DRAW_ORDER) {
    const part = state.selected[category];
    if (!part || !part.file) continue;
    if (category !== "BG" && !state.gender) continue;

    const img = await loadImage(getAssetPath(category, part.file));
    if (img) ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}


function clearAllSelections() {
  SELECT_ORDER.forEach((category) => {
    state.selected[category] = category === "BG" ? (PARTS.BG[0] || null) : null;
  });
}

function clearNonBgSelections() {
  ["TYPE", "HEAD", "EYES", "MOUTH", "ACC1", "ACC2"].forEach((category) => {
    state.selected[category] = null;
  });
}


function captureScrollState() {
  const lists = {};
  document.querySelectorAll(".option-list[data-category]").forEach((list) => {
    lists[list.dataset.category] = list.scrollTop;
  });

  return {
    windowX: window.scrollX,
    windowY: window.scrollY,
    lists
  };
}

function restoreScrollState(scrollState) {
  if (!scrollState) return;

  requestAnimationFrame(() => {
    Object.entries(scrollState.lists).forEach(([category, top]) => {
      const list = document.querySelector(`.option-list[data-category="${category}"]`);
      if (list) list.scrollTop = top;
    });

    window.scrollTo(scrollState.windowX, scrollState.windowY);
  });
}

function rebuildAndRenderPreservingScroll() {
  const scrollState = captureScrollState();
  buildUI();
  render();
  restoreScrollState(scrollState);
}

function buildGenderButtons() {
  genderSelect.innerHTML = "";

  ["Male", "Female"].forEach((gender) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `gender-btn ${state.gender === gender ? "active" : ""}`;
    btn.textContent = gender;

    btn.addEventListener("click", () => {
      if (state.gender === gender) return;
      state.gender = gender;
      clearNonBgSelections();
      buildUI();
      render();
    });

    genderSelect.appendChild(btn);
  });
}

function splitDisplayName(display) {
  const match = String(display).match(/^(.+?)\((.+)\)$/);
  if (!match) {
    return {
      groupName: display,
      variantName: null
    };
  }

  return {
    groupName: match[1].trim(),
    variantName: match[2].trim()
  };
}

function buildPartGroups(category) {
  const groups = getPartsFor(category).reduce((groups, part) => {
    const parsed = splitDisplayName(part.display);
    const key = parsed.groupName;

    let group = groups.find((item) => item.key === key);
    if (!group) {
      group = {
        key,
        display: parsed.groupName,
        variants: [],
        limited: false
      };
      groups.push(group);
    }

    group.variants.push({
      ...part,
      groupName: parsed.groupName,
      variantName: parsed.variantName || parsed.groupName
    });

    return groups;
  }, []);

  groups.forEach((group) => {
    group.limited = group.variants.length === 1 && !!group.variants[0].limited;
  });

  return groups;
}

function getSelectedGroupKey(category) {
  const selected = state.selected[category];
  if (!selected) return null;
  return splitDisplayName(selected.display).groupName;
}

function createNoneRow(category) {
  const label = document.createElement("label");
  label.className = "option-row none-option";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = category;
  input.checked = !state.selected[category];

  input.addEventListener("change", () => {
    if (!input.checked) {
      input.checked = true;
      return;
    }

    state.selected[category] = null;
    rebuildAndRenderPreservingScroll();
  });

  const span = document.createElement("span");
  span.textContent = NONE_PART.display;

  label.appendChild(input);
  label.appendChild(span);
  return label;
}

function createGroupRow(category, group) {
  const wrapper = document.createElement("div");
  wrapper.className = "option-block";
  if (group.limited) wrapper.classList.add("limited");

  const selectedGroupKey = getSelectedGroupKey(category);
  const selectedPart = state.selected[category];
  const isSelected = selectedGroupKey === group.key;

  const label = document.createElement("label");
  label.className = "option-row";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = category;
  input.checked = isSelected;

  input.addEventListener("change", () => {
    if (input.checked) {
      state.selected[category] = group.variants[0] || null;
    } else if (category === "BG") {
      input.checked = true;
      return;
    } else {
      state.selected[category] = null;
    }

    rebuildAndRenderPreservingScroll();
  });

  const span = document.createElement("span");
  span.textContent = group.display;

  label.appendChild(input);
  label.appendChild(span);
  wrapper.appendChild(label);

  if (group.limited) {
    const original = document.createElement("div");
    original.className = "original-tag";
    original.textContent = "ORIGINAL";
    wrapper.appendChild(original);
  }

  if (isSelected && group.variants.length > 1) {
    const switcher = document.createElement("div");
    switcher.className = "variant-switcher";

    group.variants.forEach((variant) => {
      const item = document.createElement("div");
      item.className = "variant-item";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "variant-btn";
      if (selectedPart?.file === variant.file) btn.classList.add("active");
      btn.textContent = variant.variantName || variant.display;

      btn.addEventListener("click", () => {
        state.selected[category] = variant;
        rebuildAndRenderPreservingScroll();
      });

      item.appendChild(btn);

      if (variant.limited) {
        const original = document.createElement("div");
        original.className = "variant-original-tag";
        original.textContent = "ORIGINAL";
        item.appendChild(original);
      }

      switcher.appendChild(item);
    });

    wrapper.appendChild(switcher);
  }

  return wrapper;
}

function buildControls() {
  controls.innerHTML = "";

  SELECT_ORDER.forEach((category) => {
    const details = document.createElement("details");
    details.className = "filter-group";
    details.open = accordionOpen[category];

    details.addEventListener("toggle", () => {
      accordionOpen[category] = details.open;
    });

    const summary = document.createElement("summary");
    summary.className = "filter-summary";
    summary.textContent = category;

    const list = document.createElement("div");
    list.className = "option-list";
    list.dataset.category = category;

    if (category !== "BG") {
      list.appendChild(createNoneRow(category));
    }

    buildPartGroups(category).forEach((group) => {
      list.appendChild(createGroupRow(category, group));
    });

    details.appendChild(summary);
    details.appendChild(list);
    controls.appendChild(details);
  });
}

function buildUI() {
  buildGenderButtons();
  buildControls();
}

function randomize() {
  if (!state.gender) {
    state.gender = Math.random() < 0.5 ? "Male" : "Female";
  }

  SELECT_ORDER.forEach((category) => {
    const parts = getPartsFor(category);
    state.selected[category] = parts.length ? parts[Math.floor(Math.random() * parts.length)] : null;
  });

  buildUI();
  render();
}

function resetAll() {
  state.gender = null;
  clearAllSelections();
  buildUI();
  render();
}

function downloadPNG() {
  render().then(() => {
    const link = document.createElement("a");
    const id = Date.now().toString(36).toUpperCase();
    const gender = state.gender || "NONE";
    link.download = `KP_BUILDER_${gender}_${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

document.getElementById("randomBtn").addEventListener("click", randomize);
document.getElementById("resetBtn").addEventListener("click", resetAll);
document.getElementById("downloadBtn").addEventListener("click", downloadPNG);

buildUI();
render();
