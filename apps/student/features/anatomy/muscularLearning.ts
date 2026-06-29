// AUTO-GENERATED from packages/data/simulations/muscular-structure-map.json — the
// learning content for the muscular system (info panel + tour + quiz). Regenerate if
// the map changes. Do not hand-edit token data here; edit the map and re-run.
export type MuscleDepth = 'L1' | 'L2' | 'L3';
export interface MuscleInfo { label: string; region: string; depth: MuscleDepth; blurb: string; }

export const DEPTH_TIERS: { id: MuscleDepth; label: string }[] = [
  { id: 'L1', label: 'Superficial' },
  { id: 'L2', label: 'Intermediate' },
  { id: 'L3', label: 'Deep' },
];

export const REGIONS: { id: string; label: string }[] = [
  { id: 'head_neck', label: 'Head & neck' },
  { id: 'trunk_anterior', label: 'Trunk (front)' },
  { id: 'back', label: 'Back' },
  { id: 'shoulder_arm', label: 'Shoulder & arm' },
  { id: 'forearm_hand', label: 'Forearm & hand' },
  { id: 'hip_thigh', label: 'Hip & thigh' },
  { id: 'leg_foot', label: 'Leg & foot' },
];

export const MUSCLE_INFO: Record<string, MuscleInfo> = {
  "frontalis": {
    "label": "Frontalis",
    "region": "head_neck",
    "depth": "L1",
    "blurb": "Raises the eyebrows and wrinkles the forehead; part of the occipitofrontalis."
  },
  "occipitalis": {
    "label": "Occipitalis",
    "region": "head_neck",
    "depth": "L2",
    "blurb": "Pulls the scalp backward; the rear belly of the occipitofrontalis."
  },
  "orbicularis_oculi": {
    "label": "Orbicularis oculi",
    "region": "head_neck",
    "depth": "L1",
    "blurb": "The sphincter that closes the eyelids (blinking, squinting)."
  },
  "orbicularis_oris": {
    "label": "Orbicularis oris",
    "region": "head_neck",
    "depth": "L1",
    "blurb": "The sphincter around the mouth; purses and closes the lips (the muscles of facial expression cluster here)."
  },
  "zygomaticus": {
    "label": "Zygomaticus",
    "region": "head_neck",
    "depth": "L1",
    "blurb": "Lifts the corner of the mouth — the smiling muscle."
  },
  "buccinator": {
    "label": "Buccinator",
    "region": "head_neck",
    "depth": "L2",
    "blurb": "Compresses the cheek against the teeth (chewing, blowing, whistling)."
  },
  "masseter": {
    "label": "Masseter",
    "region": "head_neck",
    "depth": "L1",
    "blurb": "The main chewing muscle; elevates the mandible. One of the strongest muscles by weight."
  },
  "temporalis": {
    "label": "Temporalis",
    "region": "head_neck",
    "depth": "L2",
    "blurb": "Fan-shaped chewing muscle; closes the jaw and retracts the mandible."
  },
  "pterygoids": {
    "label": "Pterygoid muscles",
    "region": "head_neck",
    "depth": "L3",
    "blurb": "Deep jaw muscles that protrude the mandible and produce side-to-side grinding."
  },
  "platysma": {
    "label": "Platysma",
    "region": "head_neck",
    "depth": "L1",
    "blurb": "Thin superficial sheet of the neck; tenses the skin and depresses the jaw/lip."
  },
  "sternocleidomastoid": {
    "label": "Sternocleidomastoid",
    "region": "head_neck",
    "depth": "L1",
    "blurb": "Turns and tilts the head; the prominent strap on the side of the neck."
  },
  "suprahyoids": {
    "label": "Suprahyoid muscles",
    "region": "head_neck",
    "depth": "L2",
    "blurb": "Above the hyoid bone; elevate the hyoid and floor of the mouth during swallowing."
  },
  "infrahyoids": {
    "label": "Infrahyoid muscles",
    "region": "head_neck",
    "depth": "L2",
    "blurb": "Below the hyoid; depress the hyoid and larynx after swallowing."
  },
  "scalenes": {
    "label": "Scalene muscles",
    "region": "head_neck",
    "depth": "L3",
    "blurb": "Elevate the upper ribs (accessory breathing) and flex the neck laterally."
  },
  "prevertebral": {
    "label": "Prevertebral muscles",
    "region": "head_neck",
    "depth": "L3",
    "blurb": "Deep flexors in front of the cervical spine."
  },
  "suboccipital": {
    "label": "Suboccipital muscles",
    "region": "head_neck",
    "depth": "L3",
    "blurb": "Small deep muscles connecting the skull to the top two vertebrae; fine head movements."
  },
  "extraocular_muscles": {
    "label": "Extraocular muscles",
    "region": "head_neck",
    "depth": "L3",
    "blurb": "The six muscles that move each eyeball plus the lid-lifter."
  },
  "pharyngeal_constrictors": {
    "label": "Pharyngeal & laryngeal muscles",
    "region": "head_neck",
    "depth": "L3",
    "blurb": "Drive swallowing (constrictors) and the voice box (laryngeal muscles)."
  },
  "tongue_muscles": {
    "label": "Tongue muscles",
    "region": "head_neck",
    "depth": "L3",
    "blurb": "Extrinsic tongue muscles that move the tongue in chewing, swallowing and speech."
  },
  "pectoralis_major": {
    "label": "Pectoralis major",
    "region": "trunk_anterior",
    "depth": "L1",
    "blurb": "Large fan of the chest; adducts and medially rotates the arm (pushing, throwing)."
  },
  "pectoralis_minor": {
    "label": "Pectoralis minor",
    "region": "trunk_anterior",
    "depth": "L2",
    "blurb": "Deep to pec major; pulls the scapula forward and down."
  },
  "subclavius": {
    "label": "Subclavius",
    "region": "trunk_anterior",
    "depth": "L2",
    "blurb": "Small muscle steadying the clavicle."
  },
  "serratus_anterior": {
    "label": "Serratus anterior",
    "region": "trunk_anterior",
    "depth": "L1",
    "blurb": "Wraps the ribs to the scapula; protracts and rotates the scapula ('boxer's muscle'). Winging if its nerve fails."
  },
  "rectus_abdominis": {
    "label": "Rectus abdominis",
    "region": "trunk_anterior",
    "depth": "L1",
    "blurb": "The 'six-pack'; flexes the trunk and supports the abdominal wall."
  },
  "external_oblique": {
    "label": "External oblique",
    "region": "trunk_anterior",
    "depth": "L1",
    "blurb": "Outermost abdominal sheet; rotates and flexes the trunk, compresses the abdomen."
  },
  "internal_oblique": {
    "label": "Internal oblique",
    "region": "trunk_anterior",
    "depth": "L2",
    "blurb": "Middle abdominal sheet; fibres run opposite to the external oblique for trunk rotation."
  },
  "transversus_abdominis": {
    "label": "Transversus abdominis",
    "region": "trunk_anterior",
    "depth": "L3",
    "blurb": "Deepest abdominal sheet; the body's natural 'corset' compressing the abdomen."
  },
  "intercostals": {
    "label": "Intercostal muscles",
    "region": "trunk_anterior",
    "depth": "L3",
    "blurb": "Between the ribs; raise and lower the rib cage during breathing."
  },
  "diaphragm": {
    "label": "Diaphragm",
    "region": "trunk_anterior",
    "depth": "L3",
    "blurb": "The dome-shaped main muscle of breathing; flattens to pull air in."
  },
  "quadratus_lumborum": {
    "label": "Quadratus lumborum",
    "region": "trunk_anterior",
    "depth": "L3",
    "blurb": "Deep posterior abdominal wall; side-bends the trunk and fixes the 12th rib."
  },
  "trapezius": {
    "label": "Trapezius",
    "region": "back",
    "depth": "L1",
    "blurb": "Large diamond over the upper back; elevates, retracts and rotates the scapula."
  },
  "latissimus_dorsi": {
    "label": "Latissimus dorsi",
    "region": "back",
    "depth": "L1",
    "blurb": "Broad muscle of the back; extends, adducts and medially rotates the arm (pull-ups, swimming)."
  },
  "rhomboids": {
    "label": "Rhomboids",
    "region": "back",
    "depth": "L2",
    "blurb": "Retract the scapula toward the spine; deep to the trapezius."
  },
  "levator_scapulae": {
    "label": "Levator scapulae",
    "region": "back",
    "depth": "L2",
    "blurb": "Elevates the scapula and side-bends the neck."
  },
  "splenius": {
    "label": "Splenius",
    "region": "back",
    "depth": "L2",
    "blurb": "Straps of the neck; extend and rotate the head and neck."
  },
  "erector_spinae": {
    "label": "Erector spinae",
    "region": "back",
    "depth": "L3",
    "blurb": "The three-column extensor of the spine (iliocostalis, longissimus, spinalis) that keeps you upright."
  },
  "transversospinalis": {
    "label": "Transversospinalis (deep back)",
    "region": "back",
    "depth": "L3",
    "blurb": "Deepest back muscles spanning a few vertebrae each; fine spinal control and posture."
  },
  "deltoid": {
    "label": "Deltoid",
    "region": "shoulder_arm",
    "depth": "L1",
    "blurb": "Caps the shoulder; abducts the arm (and its parts flex/extend it)."
  },
  "biceps_brachii": {
    "label": "Biceps brachii",
    "region": "shoulder_arm",
    "depth": "L1",
    "blurb": "Flexes the elbow and supinates the forearm; the classic 'making a muscle' bulge."
  },
  "triceps_brachii": {
    "label": "Triceps brachii",
    "region": "shoulder_arm",
    "depth": "L1",
    "blurb": "Back of the arm; the main extensor of the elbow."
  },
  "brachialis": {
    "label": "Brachialis",
    "region": "shoulder_arm",
    "depth": "L2",
    "blurb": "Deep to biceps; the workhorse elbow flexor."
  },
  "coracobrachialis": {
    "label": "Coracobrachialis",
    "region": "shoulder_arm",
    "depth": "L2",
    "blurb": "Flexes and adducts the arm at the shoulder."
  },
  "supraspinatus": {
    "label": "Supraspinatus",
    "region": "shoulder_arm",
    "depth": "L2",
    "blurb": "Rotator-cuff muscle; starts arm abduction and stabilises the shoulder."
  },
  "infraspinatus": {
    "label": "Infraspinatus",
    "region": "shoulder_arm",
    "depth": "L2",
    "blurb": "Rotator-cuff muscle; laterally rotates the arm."
  },
  "subscapularis": {
    "label": "Subscapularis",
    "region": "shoulder_arm",
    "depth": "L3",
    "blurb": "Rotator-cuff muscle on the front of the scapula; medially rotates the arm."
  },
  "teres_major": {
    "label": "Teres major",
    "region": "shoulder_arm",
    "depth": "L3",
    "blurb": "Adducts and medially rotates the arm ('lat's little helper')."
  },
  "teres_minor": {
    "label": "Teres minor",
    "region": "shoulder_arm",
    "depth": "L3",
    "blurb": "Rotator-cuff muscle; laterally rotates the arm."
  },
  "anconeus": {
    "label": "Anconeus",
    "region": "shoulder_arm",
    "depth": "L3",
    "blurb": "Small elbow extensor assisting the triceps."
  },
  "brachioradialis": {
    "label": "Brachioradialis",
    "region": "forearm_hand",
    "depth": "L1",
    "blurb": "Flexes the elbow with the forearm in mid-position (the 'hammer' muscle)."
  },
  "superficial_flexors": {
    "label": "Superficial forearm flexors",
    "region": "forearm_hand",
    "depth": "L1",
    "blurb": "Front-of-forearm group that flexes the wrist; the tendons you feel at the wrist."
  },
  "superficial_extensors": {
    "label": "Superficial forearm extensors",
    "region": "forearm_hand",
    "depth": "L1",
    "blurb": "Back-of-forearm group that extends the wrist and fingers."
  },
  "flexor_digitorum_superficialis": {
    "label": "Flexor digitorum superficialis",
    "region": "forearm_hand",
    "depth": "L2",
    "blurb": "Flexes the middle finger joints; the intermediate flexor layer."
  },
  "pronator_teres": {
    "label": "Pronator teres",
    "region": "forearm_hand",
    "depth": "L2",
    "blurb": "Pronates the forearm (turns the palm down)."
  },
  "supinator": {
    "label": "Supinator",
    "region": "forearm_hand",
    "depth": "L2",
    "blurb": "Supinates the forearm (turns the palm up)."
  },
  "deep_forearm": {
    "label": "Deep forearm muscles",
    "region": "forearm_hand",
    "depth": "L3",
    "blurb": "Deep layer working the thumb and fingertip joints."
  },
  "hand_intrinsics": {
    "label": "Intrinsic hand muscles",
    "region": "forearm_hand",
    "depth": "L3",
    "blurb": "Small muscles within the hand that fine-tune finger and thumb movements (grip, pinch)."
  },
  "gluteus_maximus": {
    "label": "Gluteus maximus",
    "region": "hip_thigh",
    "depth": "L1",
    "blurb": "Largest, most superficial buttock muscle; extends the hip (standing, climbing). The IT tract is its tendon sheet."
  },
  "gluteus_medius": {
    "label": "Gluteus medius",
    "region": "hip_thigh",
    "depth": "L2",
    "blurb": "Abducts the hip and keeps the pelvis level when walking."
  },
  "gluteus_minimus": {
    "label": "Gluteus minimus",
    "region": "hip_thigh",
    "depth": "L3",
    "blurb": "Deepest gluteal; assists hip abduction and medial rotation."
  },
  "tensor_fasciae_latae": {
    "label": "Tensor fasciae latae",
    "region": "hip_thigh",
    "depth": "L1",
    "blurb": "Tightens the iliotibial band on the side of the thigh; assists hip flexion/abduction."
  },
  "iliopsoas": {
    "label": "Iliopsoas",
    "region": "hip_thigh",
    "depth": "L2",
    "blurb": "The main hip flexor (iliacus + psoas major); lifts the thigh."
  },
  "deep_hip_rotators": {
    "label": "Deep hip rotators",
    "region": "hip_thigh",
    "depth": "L3",
    "blurb": "Short deep muscles that laterally rotate the hip and form the pelvic floor."
  },
  "rectus_femoris": {
    "label": "Rectus femoris",
    "region": "hip_thigh",
    "depth": "L1",
    "blurb": "The central quadriceps head; extends the knee and flexes the hip."
  },
  "vastus_lateralis": {
    "label": "Vastus lateralis",
    "region": "hip_thigh",
    "depth": "L1",
    "blurb": "Outer quadriceps; powerful knee extensor."
  },
  "vastus_medialis": {
    "label": "Vastus medialis",
    "region": "hip_thigh",
    "depth": "L1",
    "blurb": "Inner quadriceps; stabilises the kneecap and extends the knee."
  },
  "vastus_intermedius": {
    "label": "Vastus intermedius",
    "region": "hip_thigh",
    "depth": "L2",
    "blurb": "Deep quadriceps head between the two vasti; extends the knee."
  },
  "sartorius": {
    "label": "Sartorius",
    "region": "hip_thigh",
    "depth": "L1",
    "blurb": "Longest muscle in the body; crosses the thigh to flex hip and knee ('tailor's muscle')."
  },
  "adductors": {
    "label": "Adductor group",
    "region": "hip_thigh",
    "depth": "L2",
    "blurb": "Inner-thigh muscles that pull the leg toward the midline."
  },
  "gracilis": {
    "label": "Gracilis",
    "region": "hip_thigh",
    "depth": "L1",
    "blurb": "Slender inner-thigh muscle; adducts the hip and flexes the knee."
  },
  "biceps_femoris": {
    "label": "Biceps femoris",
    "region": "hip_thigh",
    "depth": "L1",
    "blurb": "Lateral hamstring; flexes the knee and extends the hip."
  },
  "semitendinosus": {
    "label": "Semitendinosus",
    "region": "hip_thigh",
    "depth": "L1",
    "blurb": "Medial hamstring; flexes the knee and extends the hip."
  },
  "semimembranosus": {
    "label": "Semimembranosus",
    "region": "hip_thigh",
    "depth": "L2",
    "blurb": "Deep medial hamstring; flexes the knee and extends the hip."
  },
  "gastrocnemius": {
    "label": "Gastrocnemius",
    "region": "leg_foot",
    "depth": "L1",
    "blurb": "The two-headed calf muscle; plantarflexes the foot and flexes the knee (jumping, push-off)."
  },
  "soleus": {
    "label": "Soleus",
    "region": "leg_foot",
    "depth": "L2",
    "blurb": "Deep to gastrocnemius; plantarflexes the foot for standing and walking. Feeds the Achilles tendon."
  },
  "plantaris": {
    "label": "Plantaris",
    "region": "leg_foot",
    "depth": "L2",
    "blurb": "Small slender calf muscle; weak plantarflexor."
  },
  "tibialis_anterior": {
    "label": "Tibialis anterior",
    "region": "leg_foot",
    "depth": "L1",
    "blurb": "Front of the shin; dorsiflexes and inverts the foot (lifts the foot when walking)."
  },
  "extensor_digitorum_longus": {
    "label": "Extensor digitorum longus",
    "region": "leg_foot",
    "depth": "L1",
    "blurb": "Extends the toes and dorsiflexes the foot."
  },
  "fibularis": {
    "label": "Fibularis (peroneus)",
    "region": "leg_foot",
    "depth": "L1",
    "blurb": "Lateral leg; everts the foot and plantarflexes — guards against ankle sprains."
  },
  "tibialis_posterior": {
    "label": "Tibialis posterior",
    "region": "leg_foot",
    "depth": "L3",
    "blurb": "Deep calf; inverts the foot and supports the arch."
  },
  "deep_leg_flexors": {
    "label": "Deep leg flexors",
    "region": "leg_foot",
    "depth": "L3",
    "blurb": "Deep posterior leg; curl the toes and unlock the knee (popliteus)."
  },
  "foot_intrinsics": {
    "label": "Intrinsic foot muscles",
    "region": "leg_foot",
    "depth": "L3",
    "blurb": "Small muscles within the foot that support the arches and move the toes."
  }
};

/** Guided tour — iconic NEET muscles, head→toe. */
export const MUSCLE_TOUR: string[] = ["masseter","sternocleidomastoid","trapezius","deltoid","pectoralis_major","biceps_brachii","triceps_brachii","latissimus_dorsi","rectus_abdominis","external_oblique","gluteus_maximus","rectus_femoris","biceps_femoris","gastrocnemius"];

/** Quiz pool for "tap the muscle" active recall. */
export const MUSCLE_QUIZ: string[] = ["deltoid","biceps_brachii","triceps_brachii","pectoralis_major","rectus_abdominis","latissimus_dorsi","trapezius","gluteus_maximus","rectus_femoris","gastrocnemius","sternocleidomastoid","masseter"];
