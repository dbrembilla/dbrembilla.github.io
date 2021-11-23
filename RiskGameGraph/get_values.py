import networkx as nx
import json
import csv
import math 
from networkx.algorithms.centrality.closeness import closeness_centrality

output = input('Select file to write to: ')
my_input = input('Select input graph (gml format is the only accepted right now): ')

with open(output, 'w') as values:
    g = nx.read_gml(my_input)
    degree_centrality = nx.degree_centrality(g)
    betweenness_value = nx.betweenness_centrality(g)
    betweenness_edge = sorted(nx.edge_betweenness_centrality(g).items(), key=lambda x:x[1])
    eigencentrality = nx.eigenvector_centrality(g)
    num_components = nx.number_connected_components(g)
    all_components = list(nx.connected_components(g))
    num_cliques = nx.number_of_cliques(g)
    cluster_coeff = nx.clustering(g)
    avg_cluster = nx.average_clustering(g)
    triangl = len(nx.triangles(g).items())
    omega= nx.omega(g)
    sigma = nx.sigma(g)
    closeness = nx.closeness_centrality(g)
    val = dict()
    for i in degree_centrality.keys():
        tmp = dict()
        val[i] = []
        tmp[i] = [degree_centrality[i], betweenness_value[i],closeness[i],eigencentrality[i], cluster_coeff[i], num_cliques[i],g.nodes.data()[i]['continent']]
        for el in tmp[i]:
            x = el
            if not isinstance(el, str):
                x = round(el, 5)
            val[i].append(x)
            
    with open('table.csv','w') as table:
        writer = csv.writer(table, delimiter=',')
        writer.writerow(['TERRITORY','DEGREE','BETWENNESS','CLOSENESS','EIGCENTRALITY','CLCOE','CLQ','CONT'])
        for i in val.keys():
            row= [i]
            row.extend(val[i])
            writer.writerow(row)

    my_string=f'''
    Degree Centrality values: {degree_centrality}
    
    Betweenness Centrality values: {betweenness_value}
    
    Betweenness Centrality edge values: {betweenness_edge}
    
    Eigenvector centrality measures: {eigencentrality}
    
    Component Number: {num_components}
    
    Components: {all_components}
    
    Number of Cliques: {num_cliques}
        
    Closeness: {closeness}
    
    Cluster: {cluster_coeff}
    
    Avg Clustering: {avg_cluster}
        
    Small world values:
        Omega: {omega}
        Sigma: {sigma}
    
    Triangles: {triangl}
    '''
    values.write(my_string)
    
with open('short_past.json','w') as sp:
    short_path = dict(nx.shortest_path(g))
    json.dump(short_path, sp)

with open('triangles.json','w') as tr:
    triangl = dict(nx.triangles(g))
    json.dump(triangl, tr)
    
with open('cliques.txt','w') as cl:
    for i in nx.enumerate_all_cliques(g):
        cl_towrite = " - ".join(i)
        cl.write(cl_towrite + "\n")
