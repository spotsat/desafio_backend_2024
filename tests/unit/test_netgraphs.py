import pytest
from app.services.graphs import NetGraph
import networkx as nx
import os
import json
from app.schemas.graphs import Graph

@pytest.fixture
def sample_net_graph():

    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Construindo o caminho relativo para o diretório "fixtures"
    test_case = os.path.join(current_directory, "fixtures/graph_one.json")
    with open(test_case) as file:
        graph = json.load(file)
    return NetGraph(Graph(**graph))

def test_shortest_path(sample_net_graph):
    assert sample_net_graph.shortest_path('B', 'H') == ['b', 'a', 'g', 'h']

def test_euclidean_distance(sample_net_graph):
    assert sample_net_graph._euclidean_distance('A', 'B') == pytest.approx(math.sqrt(2))


def test_find_all_paths(sample_net_graph):
    assert sample_net_graph.find_all_paths('a', 'e') == [
        ['a', 'c', 'd', 'e'],
        ['a', 'j', 'c', 'd', 'e'],
        ['a', 'i', 'e']
    ]

def test_find_all_paths_max_nodes(sample_net_graph):
    assert sample_net_graph.find_all_paths('A', 'C', max_nodes=1) == [['A', 'B', 'C']]
    assert sample_net_graph.find_all_paths('A', 'C', max_nodes=0) == [['A', 'B', 'C']]
    assert sample_net_graph.find_all_paths('A', 'C', max_nodes=2) == []
