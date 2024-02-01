export const graphEntityList = [
  {
    id: 1,
    name: 'Graph Test',
    vertices: [
      {
        id: 1,
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
      },
      {
        id: 2,
        location: {
          type: 'Point',
          coordinates: [1, 1],
        },
      },
      {
        id: 3,
        location: {
          type: 'Point',
          coordinates: [2, 2],
        },
      },
      {
        id: 4,
        location: {
          type: 'Point',
          coordinates: [3, 3],
        },
      },
    ],
    edges: [
      {
        id: 4,
        origin: {
          id: 4,
          location: {
            type: 'Point',
            coordinates: [3, 3],
          },
        },
        destiny: {
          id: 1,
          location: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      },
      {
        id: 5,
        origin: {
          id: 4,
          location: {
            type: 'Point',
            coordinates: [3, 3],
          },
        },
        destiny: {
          id: 2,
          location: {
            type: 'Point',
            coordinates: [1, 1],
          },
        },
      },
      {
        id: 1,
        origin: {
          id: 1,
          location: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
        destiny: {
          id: 2,
          location: {
            type: 'Point',
            coordinates: [1, 1],
          },
        },
      },
      {
        id: 2,
        origin: {
          id: 2,
          location: {
            type: 'Point',
            coordinates: [1, 1],
          },
        },
        destiny: {
          id: 3,
          location: {
            type: 'Point',
            coordinates: [2, 2],
          },
        },
      },
      {
        id: 3,
        origin: {
          id: 3,
          location: {
            type: 'Point',
            coordinates: [2, 2],
          },
        },
        destiny: {
          id: 4,
          location: {
            type: 'Point',
            coordinates: [3, 3],
          },
        },
      },
      {
        id: 4,
        origin: {
          id: 1,
          location: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
        destiny: {
          id: 3,
          location: {
            type: 'Point',
            coordinates: [2, 2],
          },
        },
      },
    ],
  },
];
