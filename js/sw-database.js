/* ============================================================
   SW-DATABASE.JS — Base de donnees metier Street Workout
   Source : principes NSCA, Schoenfeld 2017, communaute SW
   ============================================================ */

var SW_DB = {

  exercices: {

    /* ─────────── PULL ─────────── */
    australian_row: {
      id: 'australian_row', nom: 'Rang\u00e9e australienne', categorie: 'pull',
      equipement: ['barre_basse', 'table', 'barres_paralleles'],
      muscles_principaux: ['Grand dorsal', 'Trap\u00e8ze moyen', 'Biceps'],
      muscles_secondaires: ['Delto\u00efde post\u00e9rieur', 'Core'],
      niveau_requis: 'debutant',
      description: 'Allong\u00e9 sous une barre fixe \u00e0 hauteur de poitrine. Corps gain\u00e9, tirer la barre vers la poitrine.',
      points_forme: ['Corps parfaitement rigide', 'Coudes \u00e0 45\u00b0 du corps', 'Poitrine touche la barre'],
      erreurs: ['Ne pas laisser les hanches tomber', 'Ne pas tirer avec les biceps seuls'],
      variantes: { plus_facile: null, plus_difficile: 'tractions_bande' }
    },

    tractions_bande: {
      id: 'tractions_bande', nom: 'Tractions \u00e9lastique', categorie: 'pull',
      equipement: ['barre_traction', 'elastique'],
      muscles_principaux: ['Grand dorsal', 'Biceps'],
      muscles_secondaires: ['Trap\u00e8ze', 'Rhombo\u00efdes'],
      niveau_requis: 'debutant',
      description: 'Traction \u00e0 la barre avec \u00e9lastique de r\u00e9sistance pour r\u00e9duire le poids effectif.',
      points_forme: ['D\u00e9part bras tendus', 'Tirer les coudes vers les hanches', 'Menton au-dessus de la barre'],
      erreurs: ['Ne pas balancer le corps', 'Amplitude compl\u00e8te obligatoire'],
      variantes: { plus_facile: 'australian_row', plus_difficile: 'chin_up' }
    },

    chin_up: {
      id: 'chin_up', nom: 'Chin-up (prise supination)', categorie: 'pull',
      equipement: ['barre_traction'],
      muscles_principaux: ['Grand dorsal', 'Biceps'],
      muscles_secondaires: ['Grand pectoral', 'Rhombo\u00efdes'],
      niveau_requis: 'novice',
      description: 'Traction prise en supination (paumes vers soi). Plus facile que le pull-up car le biceps est plus sollicit\u00e9.',
      points_forme: ['Prise largeur \u00e9paules', 'Coudes devant le corps', 'Mont\u00e9e jusqu\'au menton'],
      erreurs: ['\u00c9viter le balancement', 'Pas de triche avec les jambes'],
      variantes: { plus_facile: 'tractions_bande', plus_difficile: 'pull_up' }
    },

    pull_up: {
      id: 'pull_up', nom: 'Pull-up (prise pronation)', categorie: 'pull',
      equipement: ['barre_traction'],
      muscles_principaux: ['Grand dorsal', 'Trap\u00e8ze inf\u00e9rieur'],
      muscles_secondaires: ['Biceps', 'Delto\u00efde post\u00e9rieur'],
      niveau_requis: 'novice',
      description: 'Traction prise en pronation (paumes vers l\'avant). Version standard de r\u00e9f\u00e9rence.',
      points_forme: ['Prise l\u00e9g\u00e8rement plus large que les \u00e9paules', 'Descente contr\u00f4l\u00e9e 3s', 'Amplitude compl\u00e8te'],
      erreurs: ['Ne pas raccourcir l\'amplitude', 'Pas de kipping (balancement)'],
      variantes: { plus_facile: 'chin_up', plus_difficile: 'pull_up_leste' }
    },

    pull_up_leste: {
      id: 'pull_up_leste', nom: 'Pull-up lest\u00e9', categorie: 'pull',
      equipement: ['barre_traction', 'gilet_leste'],
      muscles_principaux: ['Grand dorsal', 'Trap\u00e8ze inf\u00e9rieur', 'Biceps'],
      muscles_secondaires: ['Rhombo\u00efdes', 'Delto\u00efde post\u00e9rieur'],
      niveau_requis: 'avance',
      description: 'Pull-up avec charge additionnelle. D\u00e9veloppe la force maximale.',
      points_forme: ['M\u00eame technique que pull-up standard', 'Charge progressive', 'Amplitude compl\u00e8te'],
      erreurs: ['Ne pas ajouter de charge avant de ma\u00eetriser 12+ pull-ups strict'],
      variantes: { plus_facile: 'pull_up', plus_difficile: 'muscle_up_strict' }
    },

    /* ─────────── PUSH ─────────── */
    pompes_genoux: {
      id: 'pompes_genoux', nom: 'Pompes sur genoux', categorie: 'push',
      equipement: [],
      muscles_principaux: ['Grand pectoral', 'Triceps'],
      muscles_secondaires: ['Delto\u00efde ant\u00e9rieur'],
      niveau_requis: 'debutant',
      description: 'Pompes avec les genoux au sol pour r\u00e9duire le poids effectif. Id\u00e9al pour d\u00e9buter.',
      points_forme: ['Corps align\u00e9 \u00e9paules-hanches-genoux', 'Coudes \u00e0 45\u00b0', 'Amplitude compl\u00e8te'],
      erreurs: ['Ne pas laisser les hanches s\'affaisser'],
      variantes: { plus_facile: null, plus_difficile: 'pompes_standard' }
    },

    pompes_standard: {
      id: 'pompes_standard', nom: 'Pompes standard', categorie: 'push',
      equipement: [],
      muscles_principaux: ['Grand pectoral', 'Triceps', 'Delto\u00efde ant\u00e9rieur'],
      muscles_secondaires: ['Core', 'Dentel\u00e9 ant\u00e9rieur'],
      niveau_requis: 'debutant',
      description: 'Pompes classiques en appui sur les orteils. La base de tout entra\u00eenement push.',
      points_forme: ['Corps rigide', 'Mains \u00e0 largeur d\'\u00e9paules', 'Poitrine \u00e0 2cm du sol'],
      erreurs: ['Ne pas piquer les fesses en l\'air', 'Amplitude compl\u00e8te'],
      variantes: { plus_facile: 'pompes_genoux', plus_difficile: 'pompes_declin' }
    },

    pompes_declin: {
      id: 'pompes_declin', nom: 'Pompes d\u00e9clin\u00e9es', categorie: 'push',
      equipement: [],
      muscles_principaux: ['Grand pectoral haut', 'Delto\u00efde ant\u00e9rieur', 'Triceps'],
      muscles_secondaires: ['Dentel\u00e9 ant\u00e9rieur'],
      niveau_requis: 'novice',
      description: 'Pompes pieds sur\u00e9lev\u00e9s. Cible le pectoral sup\u00e9rieur et les \u00e9paules.',
      points_forme: ['Pieds sur un banc ou step', 'Corps parfaitement align\u00e9', 'Descente contr\u00f4l\u00e9e'],
      erreurs: ['Ne pas laisser le dos s\'arrondir'],
      variantes: { plus_facile: 'pompes_standard', plus_difficile: 'pike_pushup' }
    },

    dips_chaise: {
      id: 'dips_chaise', nom: 'Dips sur chaise', categorie: 'push',
      equipement: [],
      muscles_principaux: ['Triceps', 'Grand pectoral inf\u00e9rieur'],
      muscles_secondaires: ['Delto\u00efde ant\u00e9rieur'],
      niveau_requis: 'debutant',
      description: 'Dips avec les mains sur une chaise ou table. Version facilit\u00e9e.',
      points_forme: ['Dos proche de la chaise', 'Coudes vers l\'arri\u00e8re', 'Descend jusqu\'\u00e0 90\u00b0'],
      erreurs: ['Ne pas descendre trop bas (risque \u00e9paules)', 'Garder les coudes align\u00e9s'],
      variantes: { plus_facile: null, plus_difficile: 'dips_barres' }
    },

    dips_barres: {
      id: 'dips_barres', nom: 'Dips barres parall\u00e8les', categorie: 'push',
      equipement: ['barres_paralleles'],
      muscles_principaux: ['Triceps', 'Grand pectoral', 'Delto\u00efde ant\u00e9rieur'],
      muscles_secondaires: ['Rhombo\u00efdes', 'Core'],
      niveau_requis: 'novice',
      description: 'Dips sur barres parall\u00e8les. Mouvement de base du streetlifting.',
      points_forme: ['Corps l\u00e9g\u00e8rement inclin\u00e9', 'Descente \u00e0 90\u00b0 coudes', 'Mont\u00e9e explosive'],
      erreurs: ['Ne pas balancer le corps', 'Pas de demi-amplitude'],
      variantes: { plus_facile: 'dips_chaise', plus_difficile: 'dips_lestes' }
    },

    dips_lestes: {
      id: 'dips_lestes', nom: 'Dips lest\u00e9s', categorie: 'push',
      equipement: ['barres_paralleles', 'gilet_leste'],
      muscles_principaux: ['Triceps', 'Grand pectoral', 'Delto\u00efde ant\u00e9rieur'],
      muscles_secondaires: ['Core'],
      niveau_requis: 'avance',
      description: 'Dips avec charge additionnelle. Exercice phare du streetlifting comp\u00e9titif.',
      points_forme: ['M\u00eame technique que dips standard', 'Charge progressive'],
      erreurs: ['Ne pas ajouter de charge avant 15+ dips strict'],
      variantes: { plus_facile: 'dips_barres', plus_difficile: null }
    },

    pike_pushup: {
      id: 'pike_pushup', nom: 'Pike push-up', categorie: 'push',
      equipement: [],
      muscles_principaux: ['Delto\u00efde', 'Triceps'],
      muscles_secondaires: ['Trap\u00e8ze', 'Dentel\u00e9 ant\u00e9rieur'],
      niveau_requis: 'novice',
      description: 'Pompes en position pike (fessiers en l\'air). Pr\u00e9pare au HSPU.',
      points_forme: ['Angle de corps proche de la verticale', 'T\u00eate entre les bras', 'Coudes \u00e9cart\u00e9s'],
      erreurs: ['Ne pas tomber en position pompe standard'],
      variantes: { plus_facile: 'pompes_declin', plus_difficile: 'hspu_mur' }
    },

    hspu_mur: {
      id: 'hspu_mur', nom: 'HSPU au mur', categorie: 'push',
      equipement: [],
      muscles_principaux: ['Delto\u00efde', 'Triceps', 'Trap\u00e8ze'],
      muscles_secondaires: ['Core'],
      niveau_requis: 'avance',
      description: 'Pompe en appui renvers\u00e9 contre le mur. Force d\'\u00e9paules maximale.',
      points_forme: ['Mains \u00e0 15cm du mur', 'Corps align\u00e9', 'Descente jusqu\'\u00e0 la t\u00eate au sol'],
      erreurs: ['Jamais sans avoir ma\u00eetris\u00e9 pike push-up \u00d7 10'],
      variantes: { plus_facile: 'pike_pushup', plus_difficile: null }
    },

    /* ─────────── LEGS ─────────── */
    squat_standard: {
      id: 'squat_standard', nom: 'Squat', categorie: 'legs',
      equipement: [],
      muscles_principaux: ['Quadriceps', 'Fessiers', 'Ischio-jambiers'],
      muscles_secondaires: ['Mollets', 'Core'],
      niveau_requis: 'debutant',
      description: 'Squat au poids de corps. Fondation de l\'entra\u00eenement des jambes.',
      points_forme: ['Pieds largeur d\'\u00e9paules', 'Genoux suivent les orteils', 'Descente cuisses parall\u00e8les'],
      erreurs: ['Ne pas laisser les genoux rentrer', 'Garder le dos droit'],
      variantes: { plus_facile: null, plus_difficile: 'jump_squat' }
    },

    jump_squat: {
      id: 'jump_squat', nom: 'Squat saut\u00e9', categorie: 'legs',
      equipement: [],
      muscles_principaux: ['Quadriceps', 'Fessiers', 'Mollets'],
      muscles_secondaires: ['Core'],
      niveau_requis: 'novice',
      description: 'Squat avec saut \u00e0 la mont\u00e9e. D\u00e9veloppe la puissance explosive des jambes.',
      points_forme: ['R\u00e9ception souple', 'Descente imm\u00e9diate en squat', 'Bras propulseurs'],
      erreurs: ['Ne pas sauter avant de ma\u00eetriser squat standard'],
      variantes: { plus_facile: 'squat_standard', plus_difficile: 'pistol_squat_assist' }
    },

    pistol_squat_assist: {
      id: 'pistol_squat_assist', nom: 'Pistol squat assist\u00e9', categorie: 'legs',
      equipement: [],
      muscles_principaux: ['Quadriceps', 'Fessiers'],
      muscles_secondaires: ['Mollets', '\u00c9quilibre proprioceptif'],
      niveau_requis: 'intermediaire',
      description: 'Squat sur une jambe avec aide d\'une main ou d\'un TRX.',
      points_forme: ['Jambe libre tendue devant', 'Descente lente et contr\u00f4l\u00e9e', 'Genou ne d\u00e9passe pas le pied'],
      erreurs: ['\u00c9viter si douleur genou', 'Travailler la mobilit\u00e9 de cheville d\'abord'],
      variantes: { plus_facile: 'jump_squat', plus_difficile: 'pistol_squat' }
    },

    pistol_squat: {
      id: 'pistol_squat', nom: 'Pistol squat', categorie: 'legs',
      equipement: [],
      muscles_principaux: ['Quadriceps', 'Fessiers', 'Ischio-jambiers'],
      muscles_secondaires: ['Core', '\u00c9quilibre'],
      niveau_requis: 'avance',
      description: 'Squat complet sur une jambe sans aide. Niveau \u00e9lite de l\'entra\u00eenement legs.',
      points_forme: ['Jambe libre \u00e0 l\'horizontale', 'Amplitude compl\u00e8te', 'Dos droit'],
      erreurs: ['Ne jamais forcer si manque de mobilit\u00e9'],
      variantes: { plus_facile: 'pistol_squat_assist', plus_difficile: null }
    },

    /* ─────────── CORE ─────────── */
    gainage_planche: {
      id: 'gainage_planche', nom: 'Gainage planche', categorie: 'core',
      equipement: [],
      muscles_principaux: ['Transverse', 'Obliques', 'Rectus abdominis'],
      muscles_secondaires: ['Delto\u00efde', 'Fessiers'],
      niveau_requis: 'debutant',
      description: 'Position isom\u00e9trique de gainage. Base de tout le travail de core.',
      points_forme: ['Corps ligne droite', 'Hanches ni trop hautes ni trop basses', 'Respiration continue'],
      erreurs: ['Ne pas bloquer la respiration', 'Pas de cambrure'],
      variantes: { plus_facile: null, plus_difficile: 'hollow_body' }
    },

    hollow_body: {
      id: 'hollow_body', nom: 'Hollow body hold', categorie: 'core',
      equipement: [],
      muscles_principaux: ['Abdominaux profonds', 'Hip flexors'],
      muscles_secondaires: ['Lombaires', 'Quadriceps'],
      niveau_requis: 'novice',
      description: 'Position creuse allong\u00e9. Fondation des skills gymnastics (muscle-up, front lever).',
      points_forme: ['Bas du dos coll\u00e9 au sol', 'Jambes tendues \u00e0 30\u00b0', 'Bras tendus derri\u00e8re la t\u00eate'],
      erreurs: ['Si cambrure \u2192 lever plus les jambes', 'Commencer par version genoux fl\u00e9chis'],
      variantes: { plus_facile: 'gainage_planche', plus_difficile: 'l_sit_sol' }
    },

    l_sit_sol: {
      id: 'l_sit_sol', nom: 'L-sit au sol', categorie: 'core',
      equipement: [],
      muscles_principaux: ['Abdominaux', 'Hip flexors', 'Triceps'],
      muscles_secondaires: ['Quadriceps', 'Avant-bras'],
      niveau_requis: 'intermediaire',
      description: 'Position L tenue en appui sur les mains au sol. Pr\u00e9pare au L-sit sur barres.',
      points_forme: ['Bras tendus', 'Jambes \u00e0 l\'horizontal', '\u00c9paules basses'],
      erreurs: ['Commencer jambes fl\u00e9chies puis progresser'],
      variantes: { plus_facile: 'hollow_body', plus_difficile: null }
    },

    /* ─────────── SKILLS ─────────── */
    muscle_up_negatif: {
      id: 'muscle_up_negatif', nom: 'Muscle-up n\u00e9gatif', categorie: 'skills',
      equipement: ['barre_traction'],
      muscles_principaux: ['Grand dorsal', 'Triceps', 'Grand pectoral'],
      muscles_secondaires: ['Biceps', 'Delto\u00efde'],
      niveau_requis: 'intermediaire',
      description: 'Commencer au-dessus de la barre et descendre lentement. Pr\u00e9pare au muscle-up.',
      points_forme: ['Descente en 5s minimum', 'Corps gain\u00e9', 'Contr\u00f4le total'],
      erreurs: ['Ne pas sauter trop t\u00f4t vers le muscle-up complet'],
      variantes: { plus_facile: 'pull_up_leste', plus_difficile: 'muscle_up_kipping' }
    },

    muscle_up_kipping: {
      id: 'muscle_up_kipping', nom: 'Muscle-up avec \u00e9lan', categorie: 'skills',
      equipement: ['barre_traction'],
      muscles_principaux: ['Grand dorsal', 'Triceps', 'Grand pectoral'],
      muscles_secondaires: ['Core', '\u00c9paules'],
      niveau_requis: 'avance',
      description: 'Muscle-up avec l\u00e9ger \u00e9lan pour passer la transition. \u00c9tape vers le strict.',
      points_forme: ['\u00c9lan contr\u00f4l\u00e9', 'Transition rapide', 'Extension compl\u00e8te en haut'],
      erreurs: ['\u00c9lan excessif = moins de b\u00e9n\u00e9fice musculaire'],
      variantes: { plus_facile: 'muscle_up_negatif', plus_difficile: 'muscle_up_strict' }
    },

    muscle_up_strict: {
      id: 'muscle_up_strict', nom: 'Muscle-up strict', categorie: 'skills',
      equipement: ['barre_traction'],
      muscles_principaux: ['Grand dorsal', 'Triceps', 'Grand pectoral', 'Biceps'],
      muscles_secondaires: ['Core', 'Delto\u00efde'],
      niveau_requis: 'elite',
      description: 'Muscle-up sans \u00e9lan, force pure. Top du street workout en terme de force fonctionnelle.',
      points_forme: ['D\u00e9part suspendu immobile', 'Mont\u00e9e verticale', 'Transition fluide', 'Extension compl\u00e8te'],
      erreurs: ['Pr\u00e9requis : 15 pull-ups stricts ET 15 dips stricts'],
      variantes: { plus_facile: 'muscle_up_kipping', plus_difficile: null }
    }
  },

  /* ══════════════════════════════════════════════
     TEMPLATES DE SEANCES PAR TYPE
     Chaque template = structure reelle d'entrainement
     ══════════════════════════════════════════════ */
  templates: {

    push: {
      nom: 'Push', muscles: 'Pectoraux, Triceps, \u00c9paules',
      structure: {
        debutant: [
          { ex: 'pompes_genoux',   sets: 3, reps: '8\u201312', repos: 90,  intensite: '70%' },
          { ex: 'dips_chaise',     sets: 3, reps: '8\u201312', repos: 90,  intensite: '70%' },
          { ex: 'pompes_standard', sets: 2, reps: '5\u20138',  repos: 120, intensite: '75%' },
          { ex: 'gainage_planche', sets: 3, reps: '20\u201330s', repos: 60, intensite: 'isometrique' }
        ],
        novice: [
          { ex: 'pompes_standard', sets: 4, reps: '10\u201315', repos: 75, intensite: '75%' },
          { ex: 'dips_barres',     sets: 3, reps: '8\u201312',  repos: 90, intensite: '75%' },
          { ex: 'pompes_declin',   sets: 3, reps: '8\u201312',  repos: 90, intensite: '75%' },
          { ex: 'pike_pushup',     sets: 3, reps: '6\u201310',  repos: 90, intensite: '75%' },
          { ex: 'hollow_body',     sets: 3, reps: '20\u201330s', repos: 60, intensite: 'isometrique' }
        ],
        intermediaire: [
          { ex: 'dips_barres',     sets: 4, reps: '10\u201315', repos: 90, intensite: '80%' },
          { ex: 'pompes_declin',   sets: 4, reps: '12\u201320', repos: 75, intensite: '80%' },
          { ex: 'pike_pushup',     sets: 4, reps: '8\u201312',  repos: 90, intensite: '80%' },
          { ex: 'pompes_standard', sets: 3, reps: 'max',   repos: 90, intensite: 'max' },
          { ex: 'hollow_body',     sets: 3, reps: '30\u201345s', repos: 60, intensite: 'isometrique' }
        ],
        avance: [
          { ex: 'dips_lestes',     sets: 5, reps: '5\u20138',   repos: 180, intensite: '85\u201390%' },
          { ex: 'hspu_mur',        sets: 4, reps: '5\u20138',   repos: 120, intensite: '85%' },
          { ex: 'pompes_declin',   sets: 3, reps: '12\u201320', repos: 90,  intensite: '80%', superset_with: 'hollow_body' },
          { ex: 'pike_pushup',     sets: 3, reps: '10\u201315', repos: 90,  intensite: '80%' },
          { ex: 'l_sit_sol',       sets: 3, reps: '10\u201315s', repos: 60, intensite: 'isometrique' }
        ],
        elite: [
          { ex: 'dips_lestes',     sets: 5, reps: '3\u20135',   repos: 240, intensite: '90\u201395%' },
          { ex: 'hspu_mur',        sets: 5, reps: '5\u20138',   repos: 150, intensite: '90%' },
          { ex: 'muscle_up_strict',sets: 4, reps: '3\u20135',   repos: 180, intensite: '90%' },
          { ex: 'pike_pushup',     sets: 3, reps: 'max',   repos: 120, intensite: 'max' },
          { ex: 'l_sit_sol',       sets: 3, reps: '20\u201330s', repos: 60, intensite: 'isometrique' }
        ]
      }
    },

    pull: {
      nom: 'Pull', muscles: 'Grand dorsal, Biceps, Trap\u00e8ze',
      structure: {
        debutant: [
          { ex: 'australian_row',  sets: 3, reps: '8\u201312', repos: 90,  intensite: '70%' },
          { ex: 'tractions_bande', sets: 3, reps: '5\u20138',  repos: 120, intensite: '70%' },
          { ex: 'gainage_planche', sets: 3, reps: '20\u201330s', repos: 60, intensite: 'isometrique' }
        ],
        novice: [
          { ex: 'chin_up',         sets: 4, reps: '5\u20138',  repos: 120, intensite: '75%' },
          { ex: 'australian_row',  sets: 3, reps: '10\u201315', repos: 75, intensite: '75%' },
          { ex: 'pull_up',         sets: 3, reps: '3\u20135',   repos: 150, intensite: '80%' },
          { ex: 'hollow_body',     sets: 3, reps: '20s',   repos: 60,  intensite: 'isometrique' }
        ],
        intermediaire: [
          { ex: 'pull_up',         sets: 4, reps: '8\u201312',  repos: 90, intensite: '80%' },
          { ex: 'chin_up',         sets: 4, reps: '10\u201315', repos: 75, intensite: '80%' },
          { ex: 'australian_row',  sets: 3, reps: '12\u201320', repos: 75, intensite: '75%' },
          { ex: 'pull_up',         sets: 2, reps: 'max',   repos: 120, intensite: 'max' },
          { ex: 'hollow_body',     sets: 3, reps: '30s',   repos: 60,  intensite: 'isometrique' }
        ],
        avance: [
          { ex: 'pull_up_leste',   sets: 5, reps: '5\u20138',  repos: 180, intensite: '85%' },
          { ex: 'muscle_up_negatif',sets:4, reps: '3\u20135',  repos: 150, intensite: '85%' },
          { ex: 'pull_up',         sets: 3, reps: 'max',  repos: 120, intensite: 'max' },
          { ex: 'l_sit_sol',       sets: 3, reps: '15s',  repos: 90,  intensite: 'isometrique' }
        ],
        elite: [
          { ex: 'muscle_up_strict',sets: 5, reps: '3\u20135',   repos: 240, intensite: '90%' },
          { ex: 'pull_up_leste',   sets: 5, reps: '5\u20138',   repos: 180, intensite: '90%' },
          { ex: 'muscle_up_kipping',sets:3, reps: '5\u20138',   repos: 120, intensite: '85%' },
          { ex: 'l_sit_sol',       sets: 3, reps: '20\u201330s', repos: 90, intensite: 'isometrique' }
        ]
      }
    },

    lower: {
      nom: 'Jambes', muscles: 'Quadriceps, Fessiers, Ischio-jambiers',
      structure: {
        debutant: [
          { ex: 'squat_standard',  sets: 3, reps: '12\u201320', repos: 90, intensite: '70%' },
          { ex: 'gainage_planche', sets: 3, reps: '20\u201330s', repos: 60, intensite: 'isometrique' }
        ],
        novice: [
          { ex: 'squat_standard',  sets: 4, reps: '15\u201320', repos: 75, intensite: '75%' },
          { ex: 'jump_squat',      sets: 3, reps: '8\u201312',  repos: 90, intensite: '75%' },
          { ex: 'hollow_body',     sets: 3, reps: '20s',   repos: 60, intensite: 'isometrique' }
        ],
        intermediaire: [
          { ex: 'jump_squat',          sets: 4, reps: '10\u201315', repos: 90, intensite: '80%' },
          { ex: 'pistol_squat_assist', sets: 3, reps: '5\u20138/jambe', repos: 120, intensite: '80%' },
          { ex: 'squat_standard',      sets: 3, reps: 'max',  repos: 90, intensite: 'max' },
          { ex: 'l_sit_sol',           sets: 3, reps: '10s',  repos: 60, intensite: 'isometrique' }
        ],
        avance: [
          { ex: 'pistol_squat',        sets: 4, reps: '5\u20138/jambe', repos: 150, intensite: '85%' },
          { ex: 'jump_squat',          sets: 4, reps: 'max',       repos: 90,  intensite: 'max' },
          { ex: 'pistol_squat_assist', sets: 3, reps: '8\u201312/jambe', repos: 120, intensite: '85%' }
        ],
        elite: [
          { ex: 'pistol_squat',        sets: 5, reps: '8\u201312/jambe', repos: 120, intensite: '90%' },
          { ex: 'jump_squat',          sets: 4, reps: 'max',        repos: 90,  intensite: 'max' },
          { ex: 'l_sit_sol',           sets: 4, reps: '20\u201330s',     repos: 90,  intensite: 'isometrique' }
        ]
      }
    },

    upper: {
      nom: 'Haut du corps', muscles: 'Push + Pull \u00e9quilibr\u00e9',
      structure: {
        debutant: [
          { ex: 'australian_row',  sets: 3, reps: '8\u201312', repos: 90,  intensite: '70%' },
          { ex: 'pompes_standard', sets: 3, reps: '8\u201312', repos: 90,  intensite: '70%' },
          { ex: 'tractions_bande', sets: 2, reps: '5\u20138',  repos: 120, intensite: '70%' },
          { ex: 'dips_chaise',     sets: 2, reps: '8\u201312', repos: 90,  intensite: '70%' },
          { ex: 'gainage_planche', sets: 3, reps: '20s',  repos: 60,  intensite: 'isometrique' }
        ],
        novice: [
          { ex: 'chin_up',         sets: 4, reps: '5\u20138',   repos: 120, intensite: '75%' },
          { ex: 'dips_barres',     sets: 4, reps: '8\u201312',  repos: 90,  intensite: '75%' },
          { ex: 'australian_row',  sets: 3, reps: '10\u201315', repos: 75,  intensite: '75%' },
          { ex: 'pompes_declin',   sets: 3, reps: '8\u201312',  repos: 90,  intensite: '75%' },
          { ex: 'hollow_body',     sets: 3, reps: '25s',   repos: 60,  intensite: 'isometrique' }
        ],
        intermediaire: [
          { ex: 'pull_up',         sets: 4, reps: '8\u201310',  repos: 90,  intensite: '80%' },
          { ex: 'dips_barres',     sets: 4, reps: '10\u201315', repos: 90,  intensite: '80%' },
          { ex: 'chin_up',         sets: 3, reps: '8\u201312',  repos: 90,  intensite: '80%' },
          { ex: 'pike_pushup',     sets: 3, reps: '8\u201312',  repos: 90,  intensite: '80%' },
          { ex: 'hollow_body',     sets: 3, reps: '30s',   repos: 60,  intensite: 'isometrique' }
        ],
        avance: [
          { ex: 'pull_up_leste',   sets: 4, reps: '5\u20138',  repos: 150, intensite: '85%' },
          { ex: 'dips_lestes',     sets: 4, reps: '5\u20138',  repos: 150, intensite: '85%' },
          { ex: 'muscle_up_negatif',sets:3, reps: '3\u20135',  repos: 150, intensite: '85%' },
          { ex: 'hspu_mur',        sets: 3, reps: '5\u20138',  repos: 120, intensite: '85%' },
          { ex: 'l_sit_sol',       sets: 3, reps: '15s',  repos: 90,  intensite: 'isometrique' }
        ],
        elite: [
          { ex: 'muscle_up_strict',sets: 5, reps: '3\u20135',  repos: 240, intensite: '90%' },
          { ex: 'dips_lestes',     sets: 5, reps: '3\u20135',  repos: 180, intensite: '90%' },
          { ex: 'pull_up_leste',   sets: 4, reps: '5\u20138',  repos: 180, intensite: '90%' },
          { ex: 'hspu_mur',        sets: 3, reps: '5\u20138',  repos: 150, intensite: '90%' }
        ]
      }
    },

    full_body: {
      nom: 'Full Body', muscles: 'Corps complet',
      structure: {
        debutant: [
          { ex: 'australian_row',  sets: 3, reps: '8\u201312',  repos: 90, intensite: '70%' },
          { ex: 'pompes_standard', sets: 3, reps: '8\u201312',  repos: 90, intensite: '70%' },
          { ex: 'squat_standard',  sets: 3, reps: '12\u201320', repos: 75, intensite: '70%' },
          { ex: 'gainage_planche', sets: 3, reps: '20\u201330s', repos: 60, intensite: 'isometrique' }
        ],
        novice: [
          { ex: 'chin_up',         sets: 3, reps: '5\u20138',   repos: 120, intensite: '75%' },
          { ex: 'dips_barres',     sets: 3, reps: '8\u201312',  repos: 90,  intensite: '75%' },
          { ex: 'squat_standard',  sets: 3, reps: '15\u201320', repos: 75,  intensite: '75%' },
          { ex: 'pompes_standard', sets: 3, reps: '10\u201315', repos: 75,  intensite: '75%' },
          { ex: 'hollow_body',     sets: 3, reps: '20s',   repos: 60,  intensite: 'isometrique' }
        ],
        intermediaire: [
          { ex: 'pull_up',         sets: 4, reps: '6\u201310',  repos: 90,  intensite: '80%' },
          { ex: 'dips_barres',     sets: 4, reps: '10\u201315', repos: 90,  intensite: '80%' },
          { ex: 'jump_squat',      sets: 3, reps: '10\u201315', repos: 90,  intensite: '80%' },
          { ex: 'pompes_declin',   sets: 3, reps: '10\u201315', repos: 75,  intensite: '80%' },
          { ex: 'hollow_body',     sets: 3, reps: '30s',   repos: 60,  intensite: 'isometrique' }
        ],
        avance: [
          { ex: 'pull_up_leste',   sets: 4, reps: '5\u20138',  repos: 150, intensite: '85%' },
          { ex: 'dips_lestes',     sets: 4, reps: '5\u20138',  repos: 150, intensite: '85%' },
          { ex: 'pistol_squat',    sets: 3, reps: '5\u20138/jambe', repos: 120, intensite: '85%' },
          { ex: 'pike_pushup',     sets: 3, reps: '8\u201312',  repos: 90,  intensite: '80%' },
          { ex: 'l_sit_sol',       sets: 3, reps: '15s',   repos: 90,  intensite: 'isometrique' }
        ],
        elite: [
          { ex: 'muscle_up_strict',sets: 4, reps: '3\u20135',   repos: 240, intensite: '90%' },
          { ex: 'pistol_squat',    sets: 4, reps: '8\u201312/jambe', repos: 120, intensite: '90%' },
          { ex: 'dips_lestes',     sets: 4, reps: '5\u20138',   repos: 180, intensite: '90%' },
          { ex: 'l_sit_sol',       sets: 3, reps: '25\u201330s', repos: 90, intensite: 'isometrique' }
        ]
      }
    },

    skills: {
      nom: 'Skills SW', muscles: 'Corps complet \u2014 coordination',
      structure: {
        debutant: [
          { ex: 'hollow_body',     sets: 4, reps: '20\u201330s', repos: 60, note: 'Base de tous les skills' },
          { ex: 'australian_row',  sets: 3, reps: '10\u201315',  repos: 90 },
          { ex: 'gainage_planche', sets: 3, reps: '30\u201345s', repos: 60 }
        ],
        novice: [
          { ex: 'hollow_body',     sets: 4, reps: '30s',  repos: 60, note: 'Pr\u00e9requis skills' },
          { ex: 'pull_up',         sets: 4, reps: '5\u20138',  repos: 120 },
          { ex: 'dips_barres',     sets: 3, reps: '8\u201312', repos: 90 },
          { ex: 'l_sit_sol',       sets: 3, reps: '5\u201310s', repos: 90, note: 'Pr\u00e9pare le L-sit' }
        ],
        intermediaire: [
          { ex: 'muscle_up_negatif', sets: 5, reps: '3\u20135',  repos: 150, note: 'Travail excentrique muscle-up' },
          { ex: 'pull_up',           sets: 4, reps: '8\u201310', repos: 120 },
          { ex: 'l_sit_sol',         sets: 4, reps: '10\u201315s', repos: 90, note: 'Progression L-sit' },
          { ex: 'hollow_body',       sets: 3, reps: '45s',  repos: 60 }
        ],
        avance: [
          { ex: 'muscle_up_kipping', sets: 5, reps: '3\u20135',  repos: 180, note: 'Apprentissage muscle-up' },
          { ex: 'muscle_up_negatif', sets: 3, reps: '5',    repos: 150 },
          { ex: 'pull_up_leste',     sets: 4, reps: '5\u20138',  repos: 150 },
          { ex: 'l_sit_sol',         sets: 4, reps: '20\u201330s', repos: 90 }
        ],
        elite: [
          { ex: 'muscle_up_strict',  sets: 5, reps: '3\u20135',  repos: 240, note: 'Force maximale' },
          { ex: 'muscle_up_kipping', sets: 3, reps: '5\u20138',  repos: 150 },
          { ex: 'pull_up_leste',     sets: 4, reps: '3\u20135',  repos: 180 },
          { ex: 'l_sit_sol',         sets: 4, reps: '30s',  repos: 90 }
        ]
      }
    },

    core: {
      nom: 'Core & Abdos', muscles: 'Abdominaux, Core profond',
      structure: {
        debutant: [
          { ex: 'gainage_planche', sets: 4, reps: '20\u201330s', repos: 60, note: 'Base absolue' },
          { ex: 'hollow_body',     sets: 3, reps: '15\u201320s', repos: 75 }
        ],
        novice: [
          { ex: 'hollow_body',     sets: 4, reps: '25\u201335s', repos: 60 },
          { ex: 'gainage_planche', sets: 3, reps: '40\u201360s', repos: 60 },
          { ex: 'l_sit_sol',       sets: 3, reps: '5\u201310s',  repos: 90, note: 'Initiation L-sit' }
        ],
        intermediaire: [
          { ex: 'l_sit_sol',       sets: 4, reps: '10\u201315s', repos: 75, note: 'Progression L-sit' },
          { ex: 'hollow_body',     sets: 4, reps: '40s',    repos: 60 },
          { ex: 'gainage_planche', sets: 3, reps: '60s',    repos: 60 }
        ],
        avance: [
          { ex: 'l_sit_sol',       sets: 5, reps: '15\u201325s', repos: 90 },
          { ex: 'hollow_body',     sets: 4, reps: '45\u201360s', repos: 60 },
          { ex: 'muscle_up_negatif',sets:3, reps: '3',      repos: 150, note: 'Core + skill' }
        ],
        elite: [
          { ex: 'l_sit_sol',       sets: 5, reps: '25\u201330s', repos: 90 },
          { ex: 'hollow_body',     sets: 4, reps: '60s',    repos: 60 },
          { ex: 'muscle_up_strict',sets: 3, reps: '3\u20135',    repos: 180 }
        ]
      }
    }
  },

  /* ══════════════════════════════════════════════
     MODIFICATEURS PAR OBJECTIF
     ══════════════════════════════════════════════ */
  objectif_modifiers: {
    force: {
      reps_modifier: -2,
      sets_modifier: +1,
      repos_modifier: +60,
      label: 'Force',
      conseil: 'Travaille lourd avec peu de reps et beaucoup de repos.'
    },
    hypertrophie: {
      reps_modifier: 0,
      sets_modifier: 0,
      repos_modifier: 0,
      label: 'Hypertrophie',
      conseil: 'Volume mod\u00e9r\u00e9, reps moyennes, repos mod\u00e9r\u00e9. Base de la construction musculaire.'
    },
    endurance: {
      reps_modifier: +5,
      sets_modifier: -1,
      repos_modifier: -30,
      label: 'Endurance',
      conseil: 'Beaucoup de reps, peu de repos. D\u00e9veloppe la r\u00e9sistance musculaire.'
    },
    street_workout: {
      reps_modifier: 0,
      sets_modifier: 0,
      repos_modifier: 0,
      label: 'Street Workout',
      conseil: '\u00c9quilibre force/technique. Travaille la ma\u00eetrise des mouvements.'
    }
  },

  /* ══════════════════════════════════════════════
     FILTRES EQUIPEMENT
     ══════════════════════════════════════════════ */
  filterByEquipement: function(exercices, equipement_dispo) {
    return exercices.filter(function(item) {
      var ex = SW_DB.exercices[item.ex];
      if (!ex) return true;
      if (!ex.equipement || ex.equipement.length === 0) return true;
      return ex.equipement.every(function(equip) {
        return equipement_dispo.indexOf(equip) !== -1;
      });
    });
  }
};
