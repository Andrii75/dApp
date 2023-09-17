(async () => {
  await loadFull(tsParticles);

  await tsParticles.load('tsparticles', {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: '#059670',
      },
      shape: {
        type: 'square',
      },
      opacity: {
        value: 0.5,
        random: false,
      },
      size: {
        value: 4,
        random: true,
      },
      line_linked: {
        enable: true,
        distance: 200, // Adjust this for desired connection distance
        color: '#04bf9d',
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 3, // Adjust this for desired movement speed
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'grab',
        },
        onclick: {
          enable: true,
          mode: 'push',
        },
      },
      modes: {
        grab: {
          distance: 200, // Adjust this for desired hover connection distance
          line_linked: {
            opacity: 1,
          },
        },
      },
    },
    retina_detect: true,
  });
})();
