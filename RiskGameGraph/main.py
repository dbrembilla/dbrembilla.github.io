import networkx as nx
import pandas as pd

nodes = list()
edges = list()

while True:
    nodeToAdd = input('Please write nodes to add or stop: ')
    if nodeToAdd.lower() == 'stop':
        break
    attributeToAdd = input('Please write the attribute of the node in the form attr- value: ')
    try:
        attributeToAdd = {attributeToAdd.split('- ')[0]: attributeToAdd.split('- ')[1]}
    except:
        print('Please write in the form attr- value.')
        continue
    nodeToAdd = (nodeToAdd, attributeToAdd)
    nodes.append(nodeToAdd)
    
while True:
    edgeToAdd = input('Please write edges to add or stop in the form edge1; edge2-edge3-edge4... ')
    if edgeToAdd.lower() == 'stop':
        break
    startEdge=edgeToAdd.split(';')[0]
    endEdge=list(edgeToAdd.split('; ')[1].split('-'))
    for edge in endEdge:
        edges.append((startEdge, edge))

g = nx.Graph()

g.add_nodes_from(nodes)
g.add_edges_from(edges)
nx.write_gml(g, 'graph.gml')
nx.write_adjlist(g, 'adjmatrix.txt')
nx.write_edgelist(g, 'edgelist.txt')