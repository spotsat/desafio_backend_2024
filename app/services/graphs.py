import networkx as nx
import typing
import math
import matplotlib.pyplot as plt


class NetGraph:
    """ TODO: EXPLICAR """
    def __init__(self, graph: typing.List):

        self._network = nx.Graph()

        nodes = [(node.name, node.coordinate) for node in graph.nodes]
        self._network.add_nodes_from(nodes)
        for edge in graph.edges:
            self._network.add_edge(edge[0], edge[1])

        # Agora, adicionando os pesos com base nas distâncias euclidianas
        for u, v in self._network.edges:
            self._network.edges[u, v]['weight'] = self._euclidean_distance(u, v)

    @property
    def graph(self):
        """ Retorna a rede gerada """
        return self._network

    def shortest_path(self, source: str, target: str):
        """ TODO: EXPLICAR """

        # Padronizando
        source, target = source.lower(), target.lower()

        if source not in self._network.nodes \
        or target not in self._network.nodes:
            raise ValueError("Caminho não existe")

        return nx.shortest_path(
            self._network,
            source=source,
            target=target,
            weight="weight"
        )

    def _euclidean_distance(self, u: str, v: str):
        """ TODO: EXPLICAR """
        u_coords = (
            self._network.nodes[u]['latitude'],
            self._network.nodes[u]['longitude'])
        v_coords = (
            self._network.nodes[v]['latitude'],
            self._network.nodes[v]['longitude'])
        return math.sqrt(
            (u_coords[0] - v_coords[0])**2 + (u_coords[1] - v_coords[1])**2
        )

    def plot(self):
        """ TODO: """

        # Calculando as posições dos nós com base na latitude e longitude
        node_positions = {
            node: (
                self._network.nodes[node]['longitude'],
                self._network.nodes[node]['latitude'])
                for node in self._network.nodes()
            }

        # Traçando o gráfico com arestas escaladas de acordo com as distâncias reais
        plt.figure(figsize=(8, 8))
        nx.draw(
            self._network,
            pos=node_positions,
            with_labels=True,
            node_size=500,
            node_color="skyblue",
            font_size=10,
            width=2
        )
        edge_labels = nx.get_edge_attributes(self._network, 'weight')
        nx.draw_networkx_edge_labels(
            self._network,
            pos=node_positions,
            edge_labels=edge_labels
        )
        plt.show()

    def find_all_paths(self, start, end, **kwargs):
        """ TODO: EXPLICAR """
        all_paths = []
        max_nodes = kwargs.get("max_nodes", 0)
        if isinstance(max_nodes, int) and max_nodes > 0:
            for path in nx.all_simple_paths(self._network, source=start, target=end):
                if len(path) <= max_nodes + 1:  # +1 para ignorar o nó inicial
                    all_paths.append(path)
        else:
            return list(nx.all_simple_paths(self._network, source=start, target=end))
        return all_paths
