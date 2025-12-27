import networkx as nx

class CityMap:
    def __init__(self):
        self.graph=nx.Graph()

    def add_intersection(self,node_id,x,y,is_charging=False):
        """Junction nodes add"""
        self.graph.add_node(node_id, pos=(x,y),charging=is_charging)

    def add_road(self,start,end,distance):
        """Roadside additions initially have traffic settings of 1.0 (normal)."""
        self.graph.add_edge(start,end,weigh=distance,traffic=1.0)

    def update_traffic(self,start,end,new_traffic):
        """Updates traffic on a specific road."""
        if self.graph.has_edge(start,end):
            self.graph[start][end]['traffic']=new_traffic

    def get_cost(self,u,v,d):
        """Cost calculation function for Dijkstra."""
        return d['weight']* d['traffic']
