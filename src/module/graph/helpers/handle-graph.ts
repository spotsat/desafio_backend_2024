export class HelperVertex {
  id: number;
  coordinates: number[];
  edges: HelperEdge[];
  constructor(id: number, coordinates: [number, number]) {
    this.id = id;
    this.coordinates = coordinates;
    this.edges = [];
  }

  addEdge(edge: HelperEdge) {
    this.edges.push(edge);
  }
}

export class HelperEdge {
  origin: HelperVertex;
  destiny: HelperVertex;
  length: number;
  constructor(origin: HelperVertex, destiny: HelperVertex, length: number) {
    this.origin = origin;
    this.destiny = destiny;
    this.length = length;
  }
}

export class Graph {
  vertices: Map<number, HelperVertex>;
  constructor() {
    this.vertices = new Map();
  }

  addVertex(id: number, coordinates: [number, number]): HelperVertex {
    const vertex = new HelperVertex(id, coordinates);
    this.vertices.set(id, vertex);
    return vertex;
  }

  addEdge(originId: number, destinyId: number, length: number) {
    const origin = this.vertices.get(originId);
    const destiny = this.vertices.get(destinyId);

    if (origin && destiny) {
      const edge = new HelperEdge(origin, destiny, length);
      origin.addEdge(edge);
    }
  }
  findBestPath({
    originId,
    destinyId,
  }: {
    originId: number;
    destinyId: number;
  }) {
    const queue: any[] = [];
    const visited: Set<number> = new Set();
    const path: number[] = [];
    const predecessors: Map<number, number> = new Map();

    queue.push(this.vertices.get(originId));
    visited.add(originId);

    while (queue.length > 0) {
      const actualVertex = queue.shift();
      if (actualVertex.id === destinyId) {
        let vertexPath = actualVertex.id;
        while (vertexPath !== originId) {
          path.unshift(vertexPath);
          vertexPath = predecessors.get(vertexPath);
        }
        path.unshift(originId);
        return path.map((id) => this.vertices.get(id).id);
      }

      actualVertex.edges.forEach((edge: HelperEdge) => {
        const idDestino = edge.destiny.id;
        if (!visited.has(idDestino)) {
          visited.add(idDestino);
          queue.push(edge.destiny);
          predecessors.set(idDestino, actualVertex.id);
        }
      });
    }

    return []; // Retorna um array vazio se não encontrar um path
  }

  listAllPaths({ originId, destinyId }) {
    const paths = [];
    const path = [];

    const dfs = (vertexId) => {
      path.push(vertexId);

      if (vertexId === destinyId) {
        paths.push([...path]);
      } else {
        const actualVertex = this.vertices.get(vertexId);
        actualVertex.edges.forEach((edge) => {
          if (!path.includes(edge.destiny.id)) {
            dfs(edge.destiny.id);
          }
        });
      }

      path.pop();
    };

    dfs(originId);

    return paths;
  }
  viewVertices() {
    return this.vertices;
  }
  viewEdges() {
    const edges: HelperEdge[] = [];
    this.vertices.forEach((vertex) => {
      vertex.edges.forEach((edge) => {
        edges.push(edge);
      });
    });
    return edges;
  }
}

