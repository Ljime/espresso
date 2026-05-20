export function emptyShot(profileId = null) {
  return {
    profile_id: profileId,
    brew_actuals: {
      dose_weight: '',
      grind_level: '',
      water_temp: '',
      pressure: '',
      pull_time: '',
      shot_weight: '',
    },
    // Visual inspection
    crema_colour: null,
    crema_thickness: 3,
    crema_persistence: 3,
    crema_tiger_striping: false,
    shot_colour: null,
    // Sensory descriptors
    fragrance_descriptors: [],
    fragrance_notes: '',
    aroma_descriptors: [],
    aroma_notes: '',
    flavour_descriptors: [],
    flavour_notes: '',
    finish_descriptors: [],
    finish_notes: '',
    // Mouthfeel
    mouthfeel: {
      weight: 5,
      astringency: 5,
      temperature: 5,
      texture: '',
    },
    final_notes: '',
    hedonic_score: null,
  };
}

export function emptyProfile() {
  return {
    name: '',
    roaster: '',
    origin: '',
    producer: '',
    location: '',
    elevation: '',
    variety: '',
    process: '',
    roast_date: '',
    roast_level: '',
    brew_defaults: {
      dose_weight: '',
      grind_level: '',
      water_temp: '',
      pressure: '',
      pull_time: '',
      shot_weight: '',
    },
    components: [],
  };
}
